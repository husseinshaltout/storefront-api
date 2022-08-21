# API Requirements
The company stakeholders want to create an online storefront to showcase their great product ideas. Users need to be able to browse an index of all products, see the specifics of a single product, and add products to an order that they can view in a cart page. You have been tasked with building the API that will support this application, and your coworker is building the frontend.

These are the notes from a meeting with the frontend developer that describe what endpoints the API needs to supply, as well as data shapes the frontend and backend have agreed meet the requirements of the application. 
## API Endpoints
## Products
### Index:

```http
  GET /products
```
#### Response
```javascript
[
  {
    id:number,
    name:string,
    price:number,
    category:string
  },
  {
    ...
  }
]
```

### Show:

```http
  GET /products/:id
```

| Parameter | Type     | Description                          |
| :-------- | :------- | :----------------------------------- |
| `id`      | `number` | **Required**. Id of product to fetch |
#### Response
```javascript
{
  id:number,
  name:string,
  price:number,
  category:string
}
```

### Create **`[token required]`** :

```http
  POST /products
```
#### Body
```javascript
{
  name:string,
  price:number,
  category:string
}
```

### Get Products by category (args: product category)  :

```http
  POST /products/:category
```

| Parameter | Type     | Description                                 |
| :-------- | :------- | :------------------------------------------ |
| `category`| `string` | **Required**. category of products to fetch |
#### Response
```javascript
[
  {
    id:number,
    name:string,
    price:number,
    category:string
  },
  {
    ...
  }
]
```

## Users
### Index **`[token required]`** :

```http
  GET /users
```
#### Response
```javascript
[
  {
    id: number,
    username: string,
    first_name: string,
    last_name: string,
    password: string
},
  {
    ...
  }
]
```
### Show **`[token required]`** :

```http
  GET /users/:id'
```

| Parameter | Type     | Description                          |
| :-------- | :------- | :----------------------------------- |
| `id`      | `number` | **Required**. Id of user to fetch    |
#### Response
```javascript
{
  id: number,
  username: string,
  first_name: string,
  last_name: string,
  password: string
}
```
### Create **`[token required]`** :

```http
  POST /users/create
```
#### Body
```javascript
{
  username: string,
  first_name: string,
  last_name: string,
  password: string
}
```
### Login:

```http
  POST /users/Login
```
#### Body
```javascript
{
  username: string,
  password: string
}
```

## Orders
### Index:
```http
  GET /orders
```
#### Response
```javascript
[
  {
    id: number,
    user_id: string,
    status: string
  },
  {
    ...
  }
]
```
### Current Order by user**`[token required]`** :
```http
  GET /orders/cart/
```
#### Response
```javascript
{
  id: number,
  user_id: string,
  status: string
}
```

### Completed Orders by user **`[token required]`** :
```http
  GET /orders/complete
```
#### Response
```javascript
[
  {
    id: number,
    user_id: string,
    status: string
  },
  {
    ...
  }
]
```
### Show Order :
```http
  GET /orders/:id
```
| Parameter | Type     | Description                          |
| :-------- | :------- | :----------------------------------- |
| `id`      | `number` | **Required**. Id of order to fetch   |
#### Response
```javascript
{
    id: number,
    user_id: string,
    status: string
}
```
### Show Order Details (show products in order) :
```http
  GET /orders/detailed/:id
```
| Parameter | Type     | Description                          |
| :-------- | :------- | :----------------------------------- |
| `id`      | `number` | **Required**. Id of order to fetch   |
#### Response
```javascript
[
    {
      id: number,
      name: string,
      price: float,
      quantity: number
    },
    {
      ...
    }
]
```
### Create Order **`[token required]`** :
```http
  POST /orders/create
```
#### Body
```javascript
{
  status: "active"
}
```
### Update Order **`[token required]`** :
```http
  POST /orders/update/:id
```
| Parameter | Type     | Description                          |
| :-------- | :------- | :----------------------------------- |
| `id`      | `number` | **Required**. Id of order to update  |
#### Body
```javascript
{
  status: "complete"
}
```
## OrderProducts
### Index:
```http
  GET /order_products
```
#### Response
```javascript
[
  {
    id: number,
    order_id: string,
    product_id: string,
    quantity: number
  },
  {
    ...
  }
]
```
### Show:
```http
  GET /order_products/:id
```
| Parameter | Type     | Description                          |
| :-------- | :------- | :----------------------------------- |
| `id`      | `number` | **Required**. Id of order products to show|
#### Response
```javascript
{
  id: number,
  order_id: string,
  product_id: string,
  quantity: number
}
```
### Create:
```http
  POST /order_products/create
```
#### Body
```javascript
{
  order_id: string,
  product_id: string,
  quantity: number
}
```


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
       user_id: int NOT NULL [foreign key to users table],
       status: varchar NOT NULL)
```
### OrderProducts
```sql
Orders (id: SERIAL PRIMARY KEY,
       order_id: int NOT NULL [foreign key to orders table],
       product_id: int NOT NULL [foreign key to products table],
       quantity int NOT NULL)
```