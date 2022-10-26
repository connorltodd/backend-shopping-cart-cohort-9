DROP DATABASE IF EXISTS `fake_store_db_cohort_9`;

CREATE DATABASE `fake_store_db_cohort_9`;

USE `fake_store_db_cohort_9`;

CREATE TABLE `Product` (
	`id` INT NOT NULL AUTO_INCREMENT,
	`title` varchar(255) NOT NULL,
	`price` FLOAT NOT NULL,
	`description` TEXT NOT NULL,
	`category` varchar(255) NOT NULL,
	`image` TEXT NOT NULL,
	PRIMARY KEY (`id`)
);

CREATE TABLE `Order_Product` (
	`id` INT NOT NULL AUTO_INCREMENT,
	`order_id` INT NOT NULL,
	`product_id` INT NOT NULL,
	PRIMARY KEY (`id`)
);

CREATE TABLE `Order` (
	`id` INT NOT NULL AUTO_INCREMENT,
	`user_id` INT NOT NULL,
	PRIMARY KEY (`id`)
);

CREATE TABLE `User` (
	`id` INT NOT NULL AUTO_INCREMENT,
	`first_name` varchar(255) NOT NULL,
	`last_name` varchar(255) NOT NULL,
	`email` varchar(255) NOT NULL,
	`password` varchar(255) NOT NULL,
	PRIMARY KEY (`id`)
);

CREATE TABLE `Cart` (
	`id` INT NOT NULL AUTO_INCREMENT,
	`user_id` INT NOT NULL,
	PRIMARY KEY (`id`)
);

CREATE TABLE `Cart_Product` (
	`id` INT NOT NULL AUTO_INCREMENT,
	`product_id` INT NOT NULL,
	`cart_id` INT NOT NULL,
	`quantity` INT NOT NULL DEFAULT (0)
	PRIMARY KEY (`id`)
);

ALTER TABLE `Order_Product` ADD CONSTRAINT `Order_Product_fk0` FOREIGN KEY (`order_id`) REFERENCES `Order`(`id`);

ALTER TABLE `Order_Product` ADD CONSTRAINT `Order_Product_fk1` FOREIGN KEY (`product_id`) REFERENCES `Product`(`id`);

ALTER TABLE `Order` ADD CONSTRAINT `Order_fk0` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`);

ALTER TABLE `Cart` ADD CONSTRAINT `Cart_fk0` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`);

ALTER TABLE `Cart_Product` ADD CONSTRAINT `Cart_Product_fk0` FOREIGN KEY (`product_id`) REFERENCES `Product`(`id`);

ALTER TABLE `Cart_Product` ADD CONSTRAINT `Cart_Product_fk1` FOREIGN KEY (`cart_id`) REFERENCES `Cart`(`id`);

SET FOREIGN_KEY_CHECKS = 0;