<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

# Order Chat Project

## Overview

The Order Chat Project is a backend application designed to handle order management and chat functionalities. It includes features such as user registration, login, order creation, and chat communication between users. Admins can manage chat rooms, close them, and send summaries to participants.

## Features

- User registration and login
- Order creation and management
- Real-time chat functionalities within order chat rooms
- Chat room management and closure by admins
- Sending of chat summaries to participants
- Role-based access control

## Technologies Used

- Node.js
- NestJS
- Prisma (ORM)
- PostgreSQL (Database)
- Swagger (API Documentation)
- JWT (Authentication)

## Installation and Setup

### Prerequisites

- [Node.js](https://nodejs.org/) (v14 or later)
- [npm](https://www.npmjs.com/)
- [PostgreSQL](https://www.postgresql.org/)

### Clone the Repository

1. Open your terminal.
2. Clone the repository from GitHub:
   ```bash
   git clone https://github.com/your-username/order-chat-project.git
   ```

## Project setup

## Install the required dependencies

```bash
$ npm install
```

## Environment Variables

1. Create a .env file in the root directory and add the following environment variables:

```bash
  DATABASE_URL="your_postgresql_database_url"
  JWT_SECRET="your_jwt_secret"
  PORT=8300
  NODE_ENV=development
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
