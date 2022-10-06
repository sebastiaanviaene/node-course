'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const { Migration } = require('@mikro-orm/migrations');

class Migration20220923123604 extends Migration {

  async up() {
    this.addSql('create table "fridge" ("id" uuid not null, "location" varchar(255) not null, "capacity" int not null, constraint "fridge_pkey" primary key ("id"));');
  }

  async down() {
    this.addSql('drop table if exists "fridge" cascade;');
  }

}
exports.Migration20220923123604 = Migration20220923123604;
