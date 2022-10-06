'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const { Migration } = require('@mikro-orm/migrations');

class Migration20220926080556 extends Migration {

  async up() {
    this.addSql('alter table "fridgecontent" alter column "product_id" drop default;');
    this.addSql('alter table "fridgecontent" alter column "product_id" type uuid using ("product_id"::text::uuid);');
    this.addSql('alter table "fridgecontent" alter column "fridge_id" type varchar(255) using ("fridge_id"::varchar(255));');
    this.addSql('alter table "fridgecontent" alter column "product_id" drop default;');
  }

  async down() {
    this.addSql('alter table "fridgecontent" alter column "product_id" drop default;');
    this.addSql('alter table "fridgecontent" alter column "product_id" type uuid using ("product_id"::text::uuid);');
    this.addSql('alter table "fridgecontent" alter column "fridge_id" type int using ("fridge_id"::int);');
    this.addSql('create sequence if not exists "fridgecontent_product_id_seq";');
    this.addSql('select setval(\'fridgecontent_product_id_seq\', (select max("product_id") from "fridgecontent"));');
    this.addSql('alter table "fridgecontent" alter column "product_id" set default nextval(\'fridgecontent_product_id_seq\');');
  }

}
exports.Migration20220926080556 = Migration20220926080556;
