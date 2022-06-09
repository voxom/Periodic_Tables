const knex = require("../db/connection");

function list() {
    return knex('reservations')
        .select('*')
        .orderBy('reservation_time')
}

function listByDate(reservation_date) {
    return knex('reservations')
        .select('*')
        .where({ reservation_date })
        .whereNot({ status: 'finished' })
        .orderBy('reservation_time')
}

function read(reservation_id) {
    return knex('reservations')
        .select("*")
        .where({ reservation_id })
        .first()
}

function create(reservation) {
    return knex('reservations')
        .insert(reservation, '*')
        .then((createdRecords) => createdRecords[0])
}

function search(mobile_number) {
  return knex("reservations")
    .whereRaw(
      "translate(mobile_number, '() -', '') like ?",
      `%${mobile_number.replace(/\D/g, "")}%`
    )
    .orderBy("reservation_date");
}

module.exports = {
    list,
    listByDate,
    read,
    create,
    search,
}