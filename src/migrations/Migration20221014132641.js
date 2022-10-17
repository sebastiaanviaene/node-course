'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const { Migration } = require('@mikro-orm/migrations');

class Migration20221014132641 extends Migration {

  async up() {
    this.addSql('create table "fridge" ("id" uuid not null, "location" varchar(255) not null, "capacity" int not null, constraint "fridge_pkey" primary key ("id"));');

    this.addSql('create table "product" ("id" uuid not null, "name" varchar(255) not null, "owner" varchar(255) not null, "size" int not null, constraint "product_pkey" primary key ("id"));');

    this.addSql('create table "content" ("id" uuid not null, "fridge_id" uuid not null, "product_id" uuid not null, constraint "content_pkey" primary key ("id"));');

    this.addSql('create table "recipe" ("id" uuid not null, "name" varchar(255) not null, "description" varchar(255) not null, "ingredients" varchar(255) not null, constraint "recipe_pkey" primary key ("id"));');

    this.addSql('create table "user" ("id" uuid not null, "name" varchar(255) not null, "email" varchar(255) not null, "password" varchar(255) not null, constraint "user_pkey" primary key ("id"));');
    this.addSql('alter table "user" add constraint "user_email_unique" unique ("email");');

    this.addSql('alter table "content" add constraint "content_fridge_id_foreign" foreign key ("fridge_id") references "fridge" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "content" add constraint "content_product_id_foreign" foreign key ("product_id") references "product" ("id") on update cascade on delete cascade;');
  }

  async down() {
    this.addSql('alter table "content" drop constraint "content_fridge_id_foreign";');

    this.addSql('alter table "content" drop constraint "content_product_id_foreign";');

    this.addSql('drop table if exists "fridge" cascade;');

    this.addSql('drop table if exists "product" cascade;');

    this.addSql('drop table if exists "content" cascade;');

    this.addSql('drop table if exists "recipe" cascade;');

    this.addSql('drop table if exists "user" cascade;');
  }

}
exports.Migration20221014132641 = Migration20221014132641;
