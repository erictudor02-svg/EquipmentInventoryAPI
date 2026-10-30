CREATE DATABASE IF NOT EXISTS equipment_inventory;

USE equipment_inventory;

CREATE TABLE IF NOT EXISTS equipment (
    equipment_id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT NULL,
    quantity INT NOT NULL,
    is_available BOOLEAN NOT NULL DEFAULT FALSE,
    PRIMARY KEY (equipment_id)
);