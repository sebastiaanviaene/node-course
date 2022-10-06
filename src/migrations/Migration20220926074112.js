'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const { Migration } = require('@mikro-orm/migrations');

class Migration20220926074112 extends Migration {

  async up() {
    this.addSql('create table "fridgecontent" ("fridge_id" int not null, "product_id" uuid not null, constraint "fridgecontent_pkey" primary key ("product_id"));');
  }

  async down() {
    this.addSql('drop table if exists "fridgecontent" cascade;');

  }

}
exports.Migration20220926074112 = Migration20220926074112;
