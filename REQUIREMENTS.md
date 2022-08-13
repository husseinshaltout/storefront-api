# API Requirements
The company stakeholders want to create an online storefront to showcase their great product ideas. Users need to be able to browse an index of all products, see the specifics of a single product, and add products to an order that they can view in a cart page. You have been tasked with building the API that will support this application, and your coworker is building the frontend.

These are the notes from a meeting with the frontend developer that describe what endpoints the API needs to supply, as well as data shapes the frontend and backend have agreed meet the requirements of the application. 

## API Endpoints
#### Products
- Index 
- Show
- Create [token required]
- [OPTIONAL] Top 5 most popular products 
- [OPTIONAL] Products by category (args: product category)

#### Users
- Index [token required]
- Show [token required]
- Create N[token required]

#### Orders
- Current Order by user (args: user id)[token required]
- [OPTIONAL] Completed Orders by user (args: user id)[token required]

## Data Shapes
#### Product
-  id
- name
- price
- [OPTIONAL] category

#### User
- id
- firstName
- lastName
- password

#### Orders
- id
- id of each product in the order
- quantity of each product in the order
- user_id
- status of order (active or complete)




## API Endpoints
## Products
### Index:

```http
  GET /api/products
```


### Show:

```http
  GET /api/products/:id
```

| Parameter | Type     | Description                          |
| :-------- | :------- | :----------------------------------- |
| `id`      | `string` | **Required**. Id of product to fetch |

### Create **`[token required]`** :

```http
  POST /api/products
```

### [OPTIONAL] Get Top 5 most popular products :

```http
  GET /api/products/top
```
### [OPTIONAL] Get Products by category (args: product category)  :

```http
  POST /api/products/:category
```

| Parameter | Type     | Description                                 |
| :-------- | :------- | :------------------------------------------ |
| `id`      | `string` | **Required**. Id of product to fetch        |
| `category`| `string` | **Required**. category of products to fetch |


## Users
### Index **`[token required]`** :

```http
  GET /api/users
```
### Show **`[token required]`** :

```http
  GET /api/users/:id'
```

| Parameter | Type     | Description                          |
| :-------- | :------- | :----------------------------------- |
| `id`      | `string` | **Required**. Id of user to fetch    |

### Create **`[token required]`** :

```http
  POST /api/users
```

## Orders
### Current Order by user (args: user id) **`[token required]`** :
```http
  GET /api/orders/cart/:user_id'
```

| Parameter | Type     | Description                            |
| :-------- | :------- | :------------------------------------- |
| `user_id` | `string` | **Required**. Id of user to fetch      |

### [OPTIONAL] Completed Orders by user (args: user id) **`[token required]`** :
```http
  GET /api/orders/:user_id'
```
| Parameter | Type     | Description                            |
| :-------- | :------- | :------------------------------------- |
| `user_id` | `string` | **Required**. Id of user to fetch    



## Database Design
![Alt text](docs/storefront_erd.png?raw=true "Flow Chart")
### Products
```sql
Products (id: SERIAL PRIMARY KEY,
          name: varchar NOT NULL,
          price: float NOT NULL,
          category: varchar)
```
### Users
```sql
Users (id: SERIAL PRIMARY KEY,
       username: varchar NOT NULL,
       first_name: varchar NOT NULL,
       last_name: varchar NOT NULL,
       password: varchar NOT NULL)
```
### Orders
```sql
Orders (id: SERIAL PRIMARY KEY,
       user_id: varchar NOT NULL [foreign key to users table],
       status: varchar NOT NULL)
```
### OrderProducts
```sql
Orders (id: SERIAL PRIMARY KEY,
       order_id: varchar NOT NULL [foreign key to orders table],
       product_id: varchar NOT NULL [foreign key to products table],
       quantity int NOT NULL)
```