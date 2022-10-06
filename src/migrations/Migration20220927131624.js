'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const { Migration } = require('@mikro-orm/migrations');

class Migration20220927131624 extends Migration {

  async up() {
    this.addSql('alter table "fridgecontent" drop constraint "fridgecontent_$fridge_id_foreign";');
    this.addSql('alter table "fridgecontent" drop constraint "fridgecontent_$product_id_foreign";');

    this.addSql('alter table "fridgecontent" add column "fridge_id" uuid not null, add column "product_id" uuid not null;');
    this.addSql('alter table "fridgecontent" drop constraint "fridgecontent_$product_id_unique";');
    this.addSql('alter table "fridgecontent" add constraint "fridgecontent_fridge_id_foreign" foreign key ("fridge_id") references "fridge" ("id") on update cascade;');
    this.addSql('alter table "fridgecontent" add constraint "fridgecontent_product_id_foreign" foreign key ("product_id") references "product" ("id") on update cascade;');
    this.addSql('alter table "fridgecontent" drop column "$fridge_id";');
    this.addSql('alter table "fridgecontent" drop column "$product_id";');
    this.addSql('alter table "fridgecontent" add constraint "fridgecontent_product_id_unique" unique ("product_id");');
  }

  async down() {
    this.addSql('alter table "fridgecontent" drop constraint "fridgecontent_fridge_id_foreign";');
    this.addSql('alter table "fridgecontent" drop constraint "fridgecontent_product_id_foreign";');

    this.addSql('alter table "fridgecontent" add column "$fridge_id" uuid not null, add column "$product_id" uuid not null;');
    this.addSql('alter table "fridgecontent" drop constraint "fridgecontent_product_id_unique";');
    this.addSql('alter table "fridgecontent" add constraint "fridgecontent_$fridge_id_foreign" foreign key ("$fridge_id") references "fridge" ("id") on update cascade;');
    this.addSql('alter table "fridgecontent" add constraint "fridgecontent_$product_id_foreign" foreign key ("$product_id") references "product" ("id") on update cascade;');
    this.addSql('alter table "fridgecontent" drop column "fridge_id";');
    this.addSql('alter table "fridgecontent" drop column "product_id";');
    this.addSql('alter table "fridgecontent" add constraint "fridgecontent_$product_id_unique" unique ("$product_id");');
  }

}
exports.Migration20220927131624 = Migration20220927131624;
