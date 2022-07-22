# the bookclub

## Description

The bookclub is a social network for booklovers.

They idea is to find others who love the same books as you. It is a fullstack application, built with React and Next.js, written in JavaScript and TypeScript. The application is responsive, styled with Tailwind CSS and illustrated with own illustraions.

## Features

- Registration and log in
- Passwords are stored as hash
- Session tokens, valid for 24 hours
- Book search, using google books API
- Dynamic generated pages
- Writing own reviews to books and read the reviews of other users to a spcific book
- Puting books on a privat reading list
- Sending and accepting friendship requests
- Private user profile where the reading list, reviews and friends can be administrated
- Contact details shown to accepted friends
- Secure API routes

## Possible Features

- User should be able to edit and delete own profile
- Link from books an reading list to book page
- Book suggestions after log in
- Chat

## Technologies

- Next.js
- React
- TypeScript
- JavaScript
- PostgreSQL
- Tailwind CSS
- Playwright E2E test

## Libarys

material-react-toastify (for notifications)
Emotion

## Resources

Draft for databases: https://drawsql.app/upleveled-14/diagrams/final-project#
Wireframe on Figma: https://www.figma.com/file/VAfJBJ5FBKqFAuRl8ZT9zl/Final-project---wireframe?node-id=0%3A1

## Setup instructions

- Clone the repository with `git clone <repo>`
- Setup the database by downloading and installing PostgreSQL
- Create a user and a database
- Create a new file `.env`
- Copy the environment variables from `.env-example` into `.env`
- Replace the placeholders xxxxx with your username, password and name of database
- Install dotenv-cli with `yarn add dotenv-cli`
- Run `yarn install` in your command line
- Run the migrations with `yarn migrate up`
- Start the server by running `yarn dev`
