'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const { Migration } = require('@mikro-orm/migrations');

class Migration20220923102541 extends Migration {

  async up() {
    this.addSql('create table "recipe" ("id" uuid not null, "name" varchar(255) not null, "description" varchar(255) not null, "products" varchar(255) not null, constraint "recipe_pkey" primary key ("id"));');
  }

  async down() {
    this.addSql('drop table if exists "recipe" cascade;');
  }

}
exports.Migration20220923102541 = Migration20220923102541;
