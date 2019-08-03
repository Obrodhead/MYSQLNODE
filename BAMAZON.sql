DROP DATABASE if exists bamazon;
CREATE DATABASE bamazon;

USE bamazon; 


INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ('Elk milk','Schrute Farms', 19.99, 60);
SELECT * from products;
