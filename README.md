# Periodic Tables
Final Capstone for Thinkful

## Links
* Monorepo: [Periodic Tables](https://github.com/voxom/Periodic_Tables)
* Deployed App: [Periodic Tables](https://periodic-tables-client-voxom.herokuapp.com/)

## Installation
1. Go to the project root
2. Run `npm install` to install dependencies
3. Start up the front end with `npm run start`
4. Start up the back end with `npm run start`

## Summary
Built a full-stack web app for use as an internal tool to manage restaurant reservations.

Has the following features:
* users can create, edit, or cancel a reservation
* users can create a table
* users can seat reservations to a table
* users can finish a table
* users can search for reservations by phone numbers 

## Stack
* React
* Tailwind CSS
* Bootstrap
* Node
* Express
* PostgreSQL
* Knex.js

## Other Tools
* Trello
* Git and GitHub
* Heroku

## Dashboard
![dashboard](/front-end/images/Dashboard.PNG)

## New Reservation
![new-reservation](/front-end/images/NewReservation.PNG)

## Search By Phone Number
![search-phone](/front-end/images/SearchPhone.PNG)

## New Table
![new-table](/front-end/images/NewTable.PNG)

## Seat Reservation
![seat-reservation](/front-end/images/SeatReservation.PNG)

## Documentation for API 
| Route                                | Description                                        | Methods |
| ------------------------------------ | -------------------------------------------------- | ------- |
| /reservations	                       | returns a list of reservations for current date    | GET     | 
| /reservations                        | creates a new reservation                          | POST    |  
| /reservations?date=YYYY-MM-DD        | returns a list of reservations for a given date    | GET     |
| /reservations/:reservation_id	       | returns a reservation matching a given id          | GET     |
| /reservations/:reservation_id	       | updates a reservation matching a given id          | PUT     |
| /reservations/:reservation_id/status | updates the status of a reservation for a given id | PUT     |
| /tables	                           | returns a list of tables                           | GET     |
| /tables	                           | creates a new table                                | POST    |
| /tables/:table_id/seat	           | moves reservation to a table for a given id        | PUT     |
| /tables/:table_id/seat	           | remove a reservation from a table for a given id   | DELETE  |


## Reservation Example
```
{
    data: {
        reservation_id: 5,
        first_name: "Anthony",
        last_name: "Charboneau",
        mobile_number: "620-646-8897",
        reservation_date: "2026-12-30",
        reservation_time: "18:00:00",
        people: 2,
        status: "booked",
        created_at: "2020-12-10T08:31:32.326Z",
        updated_at: "2020-12-10T08:31:32.326Z"
    }
}
```

## Table Example
```
{
    table_id: 3,
    table_name: "#1",
    capacity: 6,
    reservation_id: 11
}
```