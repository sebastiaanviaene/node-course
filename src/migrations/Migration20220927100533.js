'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const { Migration } = require('@mikro-orm/migrations');

class Migration20220927100533 extends Migration {

  async up() {
    this.addSql('alter table "recipe" rename column "products" to "ingredients";');
  }

  async down() {
    this.addSql('alter table "recipe" rename column "ingredients" to "products";');
  }

}
exports.Migration20220927100533 = Migration20220927100533;
