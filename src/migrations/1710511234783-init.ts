import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1710511234783 implements MigrationInterface {
    name = 'Init1710511234783'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "is_active" boolean NOT NULL DEFAULT true, "disabled" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "clerk_id" character varying NOT NULL, "first_name" character varying NOT NULL, "last_name" character varying NOT NULL, "email" character varying NOT NULL, "username" character varying NOT NULL, "photo" character varying NOT NULL, CONSTRAINT "UQ_bc7be2d54c239f9e1d8a5292117" UNIQUE ("clerk_id"), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "categories" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "is_active" boolean NOT NULL DEFAULT true, "disabled" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "description" character varying NOT NULL, CONSTRAINT "UQ_8b0be371d28245da6e4f4b61878" UNIQUE ("name"), CONSTRAINT "PK_24dbc6126a28ff948da33e97d3b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "buyer-posts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "is_active" boolean NOT NULL DEFAULT true, "disabled" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "price" character varying NOT NULL, "description" character varying NOT NULL, "client_id" uuid, "category_id" uuid, CONSTRAINT "PK_e9538d18d1bbb955c68a6d3ed6a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "clients" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "is_active" boolean NOT NULL DEFAULT true, "disabled" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "user_clerk_id" character varying, "name" character varying NOT NULL, "description" character varying NOT NULL, "email" character varying NOT NULL, "phone" character varying NOT NULL, CONSTRAINT "UQ_99e921caf21faa2aab020476e44" UNIQUE ("name"), CONSTRAINT "UQ_b48860677afe62cd96e12659482" UNIQUE ("email"), CONSTRAINT "UQ_aa22377d7d3e794ae4cd39cd9e5" UNIQUE ("phone"), CONSTRAINT "PK_f1ab7cf3a5714dbc6bb4e1c28a4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "seller-posts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "is_active" boolean NOT NULL DEFAULT true, "disabled" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "price" character varying NOT NULL, "description" character varying NOT NULL, "client_id" uuid, "category_id" uuid, CONSTRAINT "PK_285c618797825f075b367c4813e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."campaigns_status_enum" AS ENUM('Active', 'Paused')`);
        await queryRunner.query(`CREATE TABLE "campaigns" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "is_active" boolean NOT NULL DEFAULT true, "disabled" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "status" "public"."campaigns_status_enum" NOT NULL DEFAULT 'Active', "profit" character varying NOT NULL, "buyer_pay" character varying NOT NULL, "seller_charge" character varying NOT NULL, "description" character varying NOT NULL, "buyer_id" uuid, "seller_id" uuid, "category_id" uuid, CONSTRAINT "PK_831e3fcd4fc45b4e4c3f57a9ee4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "matches" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "is_active" boolean NOT NULL DEFAULT true, "disabled" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "profit" character varying NOT NULL, "description" character varying NOT NULL, "buyer_post_id" uuid, "seller_post_id" uuid, "category_id" uuid, CONSTRAINT "PK_8a22c7b2e0828988d51256117f4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "buyer-posts" ADD CONSTRAINT "FK_483a38261c08ad557de451cf441" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "buyer-posts" ADD CONSTRAINT "FK_9f41942755c54de9027416903cb" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "seller-posts" ADD CONSTRAINT "FK_c2d3e2812f4ad9b617b3bcec990" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "seller-posts" ADD CONSTRAINT "FK_0317e0ee75a1d62260c4c8f1b4c" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "campaigns" ADD CONSTRAINT "FK_1bfefb279a8aa7579243541c632" FOREIGN KEY ("buyer_id") REFERENCES "clients"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "campaigns" ADD CONSTRAINT "FK_b95641b8a870172ee9361b9cffe" FOREIGN KEY ("seller_id") REFERENCES "clients"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "campaigns" ADD CONSTRAINT "FK_05e02ff530b163f0b8ebe409ab4" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "matches" ADD CONSTRAINT "FK_efbb869161d4d8f256f02bc1ec5" FOREIGN KEY ("buyer_post_id") REFERENCES "buyer-posts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "matches" ADD CONSTRAINT "FK_688608009627c67064d1ba9d9f6" FOREIGN KEY ("seller_post_id") REFERENCES "seller-posts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "matches" ADD CONSTRAINT "FK_bb427bcca7144e16f81ba6702df" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "matches" DROP CONSTRAINT "FK_bb427bcca7144e16f81ba6702df"`);
        await queryRunner.query(`ALTER TABLE "matches" DROP CONSTRAINT "FK_688608009627c67064d1ba9d9f6"`);
        await queryRunner.query(`ALTER TABLE "matches" DROP CONSTRAINT "FK_efbb869161d4d8f256f02bc1ec5"`);
        await queryRunner.query(`ALTER TABLE "campaigns" DROP CONSTRAINT "FK_05e02ff530b163f0b8ebe409ab4"`);
        await queryRunner.query(`ALTER TABLE "campaigns" DROP CONSTRAINT "FK_b95641b8a870172ee9361b9cffe"`);
        await queryRunner.query(`ALTER TABLE "campaigns" DROP CONSTRAINT "FK_1bfefb279a8aa7579243541c632"`);
        await queryRunner.query(`ALTER TABLE "seller-posts" DROP CONSTRAINT "FK_0317e0ee75a1d62260c4c8f1b4c"`);
        await queryRunner.query(`ALTER TABLE "seller-posts" DROP CONSTRAINT "FK_c2d3e2812f4ad9b617b3bcec990"`);
        await queryRunner.query(`ALTER TABLE "buyer-posts" DROP CONSTRAINT "FK_9f41942755c54de9027416903cb"`);
        await queryRunner.query(`ALTER TABLE "buyer-posts" DROP CONSTRAINT "FK_483a38261c08ad557de451cf441"`);
        await queryRunner.query(`DROP TABLE "matches"`);
        await queryRunner.query(`DROP TABLE "campaigns"`);
        await queryRunner.query(`DROP TYPE "public"."campaigns_status_enum"`);
        await queryRunner.query(`DROP TABLE "seller-posts"`);
        await queryRunner.query(`DROP TABLE "clients"`);
        await queryRunner.query(`DROP TABLE "buyer-posts"`);
        await queryRunner.query(`DROP TABLE "categories"`);
        await queryRunner.query(`DROP TABLE "users"`);
    }

}
