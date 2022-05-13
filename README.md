# Bookify (Backend) - Bookings & Appointments Scheduler

## What is Bookify?

This is the backend repository for Bookify. Bookify is an application designed for small businesses to advertise their own services which are assigned to individual calendars, meaning that a company could if they so choose either bundle all services into one calendar, or separate calendars for different types of services.

## Why Bookify?

The idea for Bookify was born because my mum is ALWAYS double booking clients, and though she does manage to always squeeze them in, hopefully now she won't need to!

## Technologies Used

* [TypeScript](https://www.typescriptlang.org/)
* [Express](https://expressjs.com/)
* [JWT (Json Web Token)](https://jwt.io/)
* [Bcrypt](https://www.npmjs.com/package/bcrypt)
* [DB Migrate](https://github.com/db-migrate/node-db-migrate)
* [PostgreSQL](https://www.postgresql.org/)
* [Jest (TS Jest)](https://github.com/kulshekhar/ts-jest)
* [SuperTest](https://github.com/visionmedia/supertest)

## Deployment

This API is currently deployed on Heroku and is available here: [Bookify Backend](https://bookify-be.herokuapp.com/api/)

## Features

* Users can sign up
* Routes can be protected and require a JWT
  * This can also vary on role, i.e. must be a superuser or must be the owner of the resource
* Password hashing, salting and peppering
* Users can create calendars
  * Users can assign services to those calendars
* Bookings can be placed against those services (paid for via Stripe)
* We use the Stripe Checkout API to allow users to purchase services
* There is also a webhook that lets Stripe notify us when a payment is complete and update our database
* Logging, there is a custom logging class which will write error messages or debug messages to log files, hiding critical info from users
* Problem Detail error handling standard

... and much more!

## Getting Started

* Pull down a postgres image and set up the container
  * `docker run -d -p 5433:5432 --name <NAME> -e POSTGRES_PASSWORD=password postgres`
* Create databases and users with privileges only for those databases
  * `docker exec -it <NAME> psql -U postgres`
  * `create database <DB_NAME_dev>;`
  * `create database <DB_NAME_test>;`
  * `create <DB_NAME_dev_user> with encrypted password 'password';`
  * `create <DB_NAME_test_user> with encrypted password 'password';`
  * `grant all privileges on database <DB_NAME_dev> to <DB_NAME_dev_user>;`
  * `grant all privileges on database <DB_NAME_test> to <DB_NAME_test_user>;`
* Clone this repo
  * e.g. `git clone git@github.com:invertostew/bookify-backend.git`
* Change into the repo directory
  * `cd bookify-backend`
* Install the dependencies from `package-lock.json`
  * `yarn add`
* Create an `.env` file and a `database.json` file
  * `touch .env && touch database.json`
* Add the necesary `.env` variables as per `src/app.ts`
* Configure the `database.json` file to link up to your database in order to run migrations
* `db-migrate up` to run the up migrations and build the database (must be installed globally)
* Compile into JavaScript
  * `yarn build`
* Start the production server
  * `yarn start`
* Start the development server
  * `yarn start:dev`

## Testing

There are some tests written with TS Jest and SuperTest, however I do plan on coming back and fleshing out the tests to add much more coverage, most of the testing on this application has been done through testing on Insomnia and through integrations with the frontend.

## Future Plans

* Document the API with Swagger
* Add more unit tests and integration tests
* Update the users to integrate their own stripe accounts so they themselves can receive payments

## Frontend

[Bookify Frontend!](https://github.com/Disc0des/bookify) Here is a link to the frontend repository for bookify, please take a look!

## Authors

* [Nathan Humphreys](https://github.com/wxmnath)
* [Dan Hembery](https://github.com/Disc0des)
* [Stuart Green](https://github.com/invertostew)
