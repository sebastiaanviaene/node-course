'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const { Migration } = require('@mikro-orm/migrations');

class Migration20220927082823 extends Migration {

  async up() {
    this.addSql('alter table "fridgecontent" drop constraint "fridgecontent_$fridge_id_unique";');
  }

  async down() {
    this.addSql('alter table "fridgecontent" add constraint "fridgecontent_$fridge_id_unique" unique ("$fridge_id");');
  }

}
exports.Migration20220927082823 = Migration20220927082823;
