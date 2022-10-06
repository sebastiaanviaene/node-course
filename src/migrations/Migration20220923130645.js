'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const { Migration } = require('@mikro-orm/migrations');

class Migration20220923130645 extends Migration {

  async up() {
    this.addSql('create table "product" ("id" uuid not null, "name" varchar(255) not null, "owner" varchar(255) not null, "size" int not null, constraint "product_pkey" primary key ("id"));');
  }

  async down() {
    this.addSql('drop table if exists "product" cascade;');
  }

}
exports.Migration20220923130645 = Migration20220923130645;
