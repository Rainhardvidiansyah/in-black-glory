import { MigrationInterface, QueryRunner } from "typeorm";
import * as bcrypt from 'bcrypt';


interface SeedUser {
    email: string;
    password: string;
    role: string;
    isActive?: boolean;
}


export class SeedingUserTable1783653783956 implements MigrationInterface {

    
//Don't forget to use env file to store the password, this is just for testing purpose

    public async up(queryRunner: QueryRunner): Promise<void> {

        const users: SeedUser[] = [
      {
        email: 'admin@local.test',
        password: 'admin123',
        role: 'ADMIN',
        isActive: true,
      },
      {
        email: 'manager@local.test',
        password: 'manager123',
        role: 'MANAGER',
        isActive: true,
      },
      {
        email: 'customer@local.test',
        password: 'customer123',
        role: 'CUSTOMER',
        isActive: true,
      },
    ];

    for (const user of users){
        const hashedPassword = await bcrypt.hash(user.password, 10);

        const [{ id: userId }] = await queryRunner.query(
            `INSERT INTO "users" ("email", "password", "provider", "isActive")
            VALUES ($1, $2, 'local', $3)
            RETURNING id`,
            [user.email, hashedPassword, user.isActive ?? true],
        )

        const role = await queryRunner.query(
            `SELECT id FROM "roles" WHERE "role_name" = $1`,
            [user.role],
        );

        if(!role || role.length ===0){
            console.warn(`Role ${user.role} not found. Skipping user ${user.email}`);
            continue;
        }
        
        await queryRunner.query(`
            INSERT INTO "users_roles" ("user_id", "role_id") VALUES ($1, $2)`,
            [userId, role[0].id],
        )


        console.log(`Seeding user: ${user.email} with role ${user.role} completed.`);
    }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        console.log('Reverting user seeding...');

        const emails = [
            `admin@local.test`,
            `manager@local.test`,
            `customer@local.test`
        ];

        await queryRunner.query(`
            DELETE FROM "users" WHERE "email" = ANY($1)`,
            [emails],
            );

}


}
