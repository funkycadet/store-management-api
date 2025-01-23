# Store Management API 

This repository contains the code for the Store Management API 

## Features

- TypeScript
- ExpressJS
- Prisma
- ESLint
- Prettier
- Jest
- Docker
- Docker Compose
- MongoDB

## Getting Started

### Prerequisites
Ensure you have the following installed on your local machine:

- [Node.js](https://nodejs.org/en/) (>= 14.15.0)
- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)
- [Prisma](https://www.prisma.io/)
- [MongoDB](https://www.mongodb.com)
- [Yarn](https://yarnpkg.com/)
- [Postman](https://www.postman.com/) (for API testing)
- [VSCode](https://code.visualstudio.com/) (or any other code editor)

### Installation

1. Clone the repository

```bash
git clone https://github.com/funkycadet/store-management-api.git
```

2. Install dependencies

```bash
yarn install
```

3. Start the database

```bash
docker compose up -d db
```

4. Run database migrations

```bash
yarn migration:deploy
```

5. Generate Prisma client

```bash
yarn migration:generate
```

6. Seed the database

```bash
yarn prisma:seed
```

7. Start the server

```bash
yarn start:dev
```

Visit `http://0.0.0.0:6543` in your browser to see if the server is running.

If you would prefer to use Docker to spin up the server, you can run the following command:

```bash
docker compose up -d
```

To check the logs, run:

```bash
docker compose logs -f {service-name}
```
where service name is the name of the service you want to check the logs for.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## API Documentation
For API documentation, visit this [link](https://documenter.getpostman.com/view/40606983/2sAYQdkVp7)
The API is currently hosted [here](https://store-management-api-fajb.onrender.com)
