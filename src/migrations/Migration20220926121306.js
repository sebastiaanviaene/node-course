'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const { Migration } = require('@mikro-orm/migrations');

class Migration20220926121306 extends Migration {

  async up() {
    this.addSql('alter table "fridgecontent" alter column "fridge_id" drop default;');
    this.addSql('alter table "fridgecontent" alter column "fridge_id" type uuid using ("fridge_id"::text::uuid);');
    this.addSql('alter table "fridgecontent" add constraint "fridgecontent_fridge_id_foreign" foreign key ("fridge_id") references "fridge" ("id") on update cascade;');
    this.addSql('alter table "fridgecontent" add constraint "fridgecontent_fridge_id_unique" unique ("fridge_id");');
  }

  async down() {
    this.addSql('alter table "fridgecontent" alter column "fridge_id" type text using ("fridge_id"::text);');

    this.addSql('alter table "fridgecontent" drop constraint "fridgecontent_fridge_id_foreign";');

    this.addSql('alter table "fridgecontent" alter column "fridge_id" type varchar(255) using ("fridge_id"::varchar(255));');
    this.addSql('alter table "fridgecontent" drop constraint "fridgecontent_fridge_id_unique";');
  }

}
exports.Migration20220926121306 = Migration20220926121306;
