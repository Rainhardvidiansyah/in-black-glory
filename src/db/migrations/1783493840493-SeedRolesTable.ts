import { MigrationInterface, QueryRunner } from "typeorm";

export class SeedRolesTable1783493840493 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        console.log("seeding role table...");
        
        await queryRunner.query(`
            INSERT INTO roles (id, role_name) VALUES 
            (uuid_generate_v7(), 'ADMIN'),
            (uuid_generate_v7(), 'SUPER_ADMIN'),
            (uuid_generate_v7(), 'CUSTOMER'),
            (uuid_generate_v7(), 'MANAGER'),
            (uuid_generate_v7(), 'FINANCE'),
            (uuid_generate_v7(), 'DEVELOPER'),
            (uuid_generate_v7(), 'MARKETING');
    `);


    }

        
    public async down(queryRunner: QueryRunner): Promise<void> {
        console.log("reverting seed for roles table...");
        
        await queryRunner.query(`
            DELETE FROM roles WHERE role_name IN (
            'ADMIN', 'SUPER_ADMIN', 'CUSTOMER', 'MANAGER', 
            'FINANCE', 'DEVELOPER', 'MARKETING'
            );
            `);
        
    }

}
