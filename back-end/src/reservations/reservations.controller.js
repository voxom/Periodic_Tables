const service = require('./reservations.service')
const asyncErrorBoundary = require('../errors/asyncErrorBoundary')
const hasProperties = require('../errors/hasProperties')
const hasRequiredProperties = hasProperties(
  'first_name',
  'last_name',
  'mobile_number',
  'reservation_date',
  'reservation_time',
  'people',
)
const dayjs = require('dayjs')
const utc = require('dayjs/plugin/utc')
const timezone = require('dayjs/plugin/timezone')
dayjs.extend(utc)
dayjs.extend(timezone)

const VALID_PROPERTIES = [
  'first_name',
  'last_name',
  'mobile_number',
  'reservation_date',
  'reservation_time',
  'people',
  'status'
]

function hasOnlyValidProperties(req, res, next) {
  const { data = {} } = req.body;

  const invalidFields = Object.keys(data).filter(
    (field) => !VALID_PROPERTIES.includes(field)
  );

  if (invalidFields.length) {
    return next({
      status: 400,
      message: `Invalid field(s): ${invalidFields.join(", ")}`,
    });
  }
  next();
}

async function list(req, res) {
  const { date } = req.query
  const { mobile_number } = req.query

  let data
  if (date) {
    data = await service.listByDate(date)
  } else if (mobile_number) {
    data = await service.search(mobile_number)
  } else {
    data = await service.list()
  }
  res.json({ data });
}

async function read(req, res) {
  const { reservation } = res.locals
  const data = await service.read(reservation.reservation_id)
  res.json({ data })
}

async function create(req, res) {
  let data = await service.create(req.body.data)
  res.status(201).json({ data })
}

function hasData(req, res, next) {
  const data = req.body.data
  if (!data) {
    return next({
      status: 400,
      message: `Request body must have data.`,
    })
  }
  next()
}

function hasValidPeople(req, res, next) {
  const { data: { people } } = req.body
  if (typeof people !== 'number' || people <= 0) {
    return next({
      status: 400,
      message: "'people' must be a number and be greater than 1"
    })
  }
  next()
}

function hasValidDate(req, res, next) {
  const { data: { reservation_date, reservation_time } } = req.body // UTC
  const trimmedDate = reservation_date.substring(0, 10)
  const dateInput = dayjs(trimmedDate + ' ' + reservation_time) // UTC

  const today = dayjs()

  const day = dayjs(dateInput).day()

  console.log(dateInput)
  console.log(today)
  console.log(day)

  const dateFormat = /\d\d\d\d-\d\d-\d\d/
  if (!reservation_date) {
    return next({
      status: 400,
      message: 'reservation_date is empty'
    })
  }
  if (!trimmedDate.match(dateFormat)) {
    return next({
      status: 400,
      message: `reservation_date is invalid`
    })
  }
  if (day === 2) {
    return next({
      status: 400,
      message: `The restaurant is closed on Tuesday.`,
    });
  }
  if (res.locals.reservation) {
    return next()
  }
  if (dateInput < today) {
    return next({
      status: 400,
      message: `Reservations can't be in the past. Please pick a future date.`,
    });
  }
  next()
}

function hasValidTime(req, res, next) {
  const { data: { reservation_time } } = req.body
  const timeFormat = /^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$/
  if (!reservation_time) {
    return next({
      status: 400,
      message: `reservation_time is empty`
    })
  }
  if (!reservation_time.match(timeFormat)) {
    return next({
      status: 400,
      message: `reservation_time is invalid`
    })
  }
  if (reservation_time < "10:30:00") {
    return next({
      status: 400,
      message: `reservation_time can't be before 10:30 AM`,
    });
  }
  if (reservation_time >= "21:30:00") {
    return next({
      status: 400,
      message: `reservation_time can't be after 9:30 PM`,
    });
  }
  next()
}

function checkBookedStatus(req, res, next) {
  const { status } = req.body.data
  if (status) {
    if (status !== 'booked') {
      next({
        status: 400,
        message: `New reservation can't have the status ${status}`
      })
    }
  }
  next()
}

async function reservationExists(req, res, next) {
  const { reservationId } = req.params
  const reservation = await service.read(reservationId)

  if (reservation) {
    res.locals.reservation = reservation
    return next()
  }
  next({
    status: 404,
    message: `Reservation not found '${reservationId}'.`
  })
}

module.exports = {
  list: asyncErrorBoundary(list),
  read: [
    asyncErrorBoundary(reservationExists),
    asyncErrorBoundary(read)
  ],
  create: [
    hasData,
    hasOnlyValidProperties,
    hasRequiredProperties,
    checkBookedStatus,
    hasValidDate,
    hasValidTime,
    hasValidPeople,
    asyncErrorBoundary(create)
  ],
};
