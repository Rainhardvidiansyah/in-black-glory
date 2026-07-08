import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateSetupGlobalPostgresql1783488559821 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
    console.log("Running migration: SetupDatabaseExtensions");

    // pgcrypto is needed for gen_random_bytes() in function uuid_generate_v7()
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "pgcrypto";`);

    // Function manual UUIDv7 - is needed for this project uses postgresql v 15 
    // (uuidv7() native is available in postgresql 18 di Postgres 18+)
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION uuid_generate_v7()
      RETURNS UUID
      AS $$
      DECLARE
        unix_ts_ms BYTEA;
        uuid_bytes BYTEA;
      BEGIN
        unix_ts_ms := substring(int8send(floor(extract(epoch FROM clock_timestamp()) * 1000)::bigint) FROM 3);
        uuid_bytes := unix_ts_ms || gen_random_bytes(10);

        -- set version bit (7)
        uuid_bytes := set_byte(uuid_bytes, 6, (get_byte(uuid_bytes, 6) & 15) | 112);
        -- set variant bit
        uuid_bytes := set_byte(uuid_bytes, 8, (get_byte(uuid_bytes, 8) & 63) | 128);

        RETURN encode(uuid_bytes, 'hex')::UUID;
      END;
      $$ LANGUAGE plpgsql VOLATILE;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    console.log("Reverting migration: SetupDatabaseExtensions");

    await queryRunner.query(`DROP FUNCTION IF EXISTS uuid_generate_v7();`);
    await queryRunner.query(`DROP EXTENSION IF EXISTS "pgcrypto";`);
  }

}
