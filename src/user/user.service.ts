import { BadRequestException, ConflictException, Inject, Injectable, Logger } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { User } from './user.entity';
import { encodePassword } from '../utils/password.encoder';
import { CreateUserLocalDto } from './dto/create-user-local.dto';
import { CustomerService } from 'src/customer/customer.service';
import { RoleService } from 'src/role/role.service';


@Injectable()
export class UserService {
    
    private readonly logger = new Logger(UserService.name);
    
    constructor(
        @Inject('DATA_SOURCE') private readonly dataSource: DataSource,
        @Inject('USERS_REPOSITORY') private userRepository: Repository<User>,
        private readonly customerProfileService: CustomerService,
        private readonly rolesService: RoleService
        ) {}


    //CREATE NEW USER FOR LOCAL REGISTRATION
    async createLocalUser(createUserLocalDto: CreateUserLocalDto): Promise<User> {
        this.logger.log(`Creating new user with email: ${createUserLocalDto.email}`);

      const isEmailExisting = await this.getUserByEmail(createUserLocalDto.email);
    
        if(isEmailExisting) {
            throw new ConflictException('Email already exists');
        }
        
        if (!createUserLocalDto.password) {
            throw new BadRequestException('Password is required for local provider');
        }

        const hashedPassword = await encodePassword(createUserLocalDto.password);
        
        const role = await this.rolesService.findRoleByRoleName('CUSTOMER');
        
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try{
        const newUser = await queryRunner.manager.save(User, {
          email: createUserLocalDto.email,
          provider: 'local',
          password: hashedPassword,
          roles: [role]
        });

        
        this.logger.log(`New user created: ${JSON.stringify(newUser)}`);


        await this.customerProfileService.createCustomerProfiles(newUser, queryRunner);

        await queryRunner.commitTransaction();

        return newUser;

        }catch(error){
        await queryRunner.rollbackTransaction();
          throw error;

        } finally{
        await queryRunner.release();
        }
    }



    //FIND USER BY EMAIL
    async findByEmail(email: string): Promise<User> {
        
        if (!email) {
            throw new Error('Email must be provided');
        }

        const user = await this.dataSource.getRepository(User)

        .createQueryBuilder('user')
        .where('user.email = :email', { email: email })
        .leftJoinAndSelect('user.roles', 'roles')
        .getOne();

        if (!user) {
            throw new Error('User not found');
        }

        return user;
    }


    //FIND ALL USERS
    async findAll(): Promise<User[]> {
        return this.userRepository.find();
    }


    //FIND USER BY EMAIL
    async getUserByEmail(email: string): Promise<User | null>{
        const user = await this.userRepository.findOne({where: {email: email}});
        return user;
    }

    


}

