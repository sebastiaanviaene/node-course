'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const { Migration } = require('@mikro-orm/migrations');

class Migration20221007144533 extends Migration {

  async up() {
    this.addSql('create table "content" ("id" uuid not null, "fridge_id" uuid not null, "product_id" uuid not null, constraint "content_pkey" primary key ("id"));');

    this.addSql('alter table "content" add constraint "content_fridge_id_foreign" foreign key ("fridge_id") references "fridge" ("id") on update cascade;');
    this.addSql('alter table "content" add constraint "content_product_id_foreign" foreign key ("product_id") references "product" ("id") on update cascade;');

    this.addSql('drop table if exists "fridgecontent" cascade;');
  }

  async down() {
    this.addSql('create table "fridgecontent" ("id" uuid not null, "fridge_id" uuid not null, "product_id" uuid not null, constraint "fridgecontent_pkey" primary key ("id"));');

    this.addSql('alter table "fridgecontent" add constraint "fridgecontent_fridge_id_foreign" foreign key ("fridge_id") references "fridge" ("id") on update cascade;');
    this.addSql('alter table "fridgecontent" add constraint "fridgecontent_product_id_foreign" foreign key ("product_id") references "product" ("id") on update cascade;');

    this.addSql('drop table if exists "content" cascade;');
  }

}
exports.Migration20221007144533 = Migration20221007144533;
