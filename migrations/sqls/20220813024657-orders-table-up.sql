CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) NOT NULL,
    status VARCHAR(30) NOT NULL
);