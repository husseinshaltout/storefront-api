
# Storefront API

An API for online storefront to showcase product ideas. Users can browse an index of all products, see the specifics of a single product, and add products to an order that they can view in a cart page.
## Environment Variables

To run this project, you will need to add the following environment variables to your .env file (.env_template file could be renamed and used)

`PORT` \
`POSTGRES_HOST`\
`POSTGRES_DB`\
`POSTGRES_USER`\
`POSTGRES_PWD`\
`POSTGRES_DB_TEST`\
`ENV`\
`BCRYPT_PASSWORD`\
`SALT_ROUNDS`\
`TOKEN_SECRET`
## Run Locally

Clone the project

```bash
  git clone https://github.com/husseinshaltout/storefront-api.git
```

Go to the project directory

```bash
  cd storefront-api
```

Install dependencies

```bash
  npm install
```
#### In a terminal tab, create and run the database:
- start psql `psql postgres`
- in psql run the following:
  - `CREATE USER full_stack_user WITH PASSWORD 'password123';`
  - `CREATE DATABASE store_db;`
  - `CREATE DATABASE store_test_db;`
  - `\c store_db`
  - `GRANT ALL PRIVILEGES ON DATABASE store_test_db TO full_stack_user;`
  - `GRANT ALL PRIVILEGES ON DATABASE store_db TO full_stack_user;`
- to test that it is working run `\dt` and it should output "No relations found."
- update .env file to match new info

Start the server

```bash
  yarn start
```
Watch mode

```bash
  yarn watch
```

## Running Tests

To run tests, run the following command

```bash
  yarn test
```

## Build
To build, run the following command
```bash
  yarn build
```

## Usage/Examples

```bash
GET
http://localhost:3000/products
```
- Add Bearer Authorization to header for endpoint that requires token (can be identified from [REQUIREMENTS.md](./REQUIREMENTS.md))
 
    `Authorization   Bearer <token>`
- JWT can be acquired after creating user from login endpoint
```bash
POST
http://localhost:3000/login
```




## Authors

- [@husseinshaltout](https://www.github.com/husseinshaltout)

