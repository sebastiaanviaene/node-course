'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const { Migration } = require('@mikro-orm/migrations');

class Migration20220926121622 extends Migration {

  async up() {
    this.addSql('alter table "fridgecontent" add column "id" uuid not null;');
    this.addSql('alter table "fridgecontent" drop constraint "fridgecontent_pkey";');
    this.addSql('alter table "fridgecontent" add constraint "fridgecontent_product_id_foreign" foreign key ("product_id") references "product" ("id") on update cascade;');
    this.addSql('alter table "fridgecontent" add constraint "fridgecontent_product_id_unique" unique ("product_id");');
    this.addSql('alter table "fridgecontent" add constraint "fridgecontent_pkey" primary key ("id");');
  }

  async down() {
    this.addSql('alter table "fridgecontent" drop constraint "fridgecontent_product_id_foreign";');

    this.addSql('alter table "fridgecontent" drop constraint "fridgecontent_product_id_unique";');
    this.addSql('alter table "fridgecontent" drop constraint "fridgecontent_pkey";');
    this.addSql('alter table "fridgecontent" drop column "id";');
    this.addSql('alter table "fridgecontent" add constraint "fridgecontent_pkey" primary key ("product_id");');
  }

}
exports.Migration20220926121622 = Migration20220926121622;
