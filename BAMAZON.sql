DROP DATABASE if exists bamazon;
CREATE DATABASE bamazon;

USE bamazon; 

CREATE TABLE products(
item_id INT AUTO_INCREMENT NOT NULL,
product_name VARCHAR(45) NOT NULL,
department_name VARCHAR(45) NOT NULL,
price DECIMAL(10,2) NOT NULL,
stock_quantity INT (10) NOT NULL,
primary key (item_id)
);
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ('Elk milk','Schrute Farms', 19.99, 60);
SELECT * from products;



