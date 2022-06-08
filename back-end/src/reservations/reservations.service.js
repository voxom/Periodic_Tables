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

module.exports = {
    list,
    listByDate,
    read,
    create,
}