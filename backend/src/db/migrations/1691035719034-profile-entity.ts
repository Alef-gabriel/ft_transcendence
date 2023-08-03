import { MigrationInterface, QueryRunner } from "typeorm";

export class ProfileEntity1691035719034 implements MigrationInterface {
    name = 'ProfileEntity1691035719034'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "profiles" ("id" SERIAL NOT NULL, "nickname" character varying NOT NULL, "avatar" character varying NOT NULL, "userEntityId" integer, CONSTRAINT "REL_1145146862f40fe12c6d30987c" UNIQUE ("userEntityId"), CONSTRAINT "PK_8e520eb4da7dc01d0e190447c8e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "avatar"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "nickname"`);
        await queryRunner.query(`ALTER TABLE "profiles" ADD CONSTRAINT "FK_1145146862f40fe12c6d30987c2" FOREIGN KEY ("userEntityId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "profiles" DROP CONSTRAINT "FK_1145146862f40fe12c6d30987c2"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "nickname" character varying`);
        await queryRunner.query(`ALTER TABLE "users" ADD "avatar" character varying`);
        await queryRunner.query(`DROP TABLE "profiles"`);
    }

}
