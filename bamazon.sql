DROP DATABASE IF EXISTS bamazonDB;

CREATE DATABASE bamazonDB;

USE bamazonDB;

CREATE TABLE products (
item_id INT NOT NULL AUTO_INCREMENT,
product_name VARCHAR(300) NULL,
department_name VARCHAR(300) NULL,
price DECIMAL(10,2) NULL,
stock_quantity INT NULL,
PRIMARY KEY (item_id) 
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES 
("Samsung 9", "Cellphone", 10.99, 265),
("Iphone x", "Cellphone", 12.21, 300),
("Nokia 6 ", "Cellphone", 258.99, 6),
("LG V20","Cellphone",200,10)
("Samsung Note 5",180,1)
("Google Pixel 2",800,20)
("LG V30",900,20)
("Razor", 400,10)
("Samsung Note 5",400,20)
("Sidekick",20,1)

SELECT * FROM products;