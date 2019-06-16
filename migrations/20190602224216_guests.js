exports.up = function(knex, Promise) {
  return knex.schema.createTable("guests", tbl => {
    tbl.increments();
    tbl
    .integer('user_id')
    .unsigned()
    .notNullable()
    .references('id')
    .inTable('users')
    .onDelete('CASCADE')
    .onUpdate('CASCADE');
    tbl
      .string("names", 255)
      .notNullable()
      .unique();
    tbl.string("email", 255).notNullable();
    tbl.string("phone_number", 255).notNullable();
    tbl.string("number_of_guests", 255).notNullable();
    tbl.string(" number_of_rooms", 255);
    tbl.string("dates_staying", 255).notNullable();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists("guests");
};
