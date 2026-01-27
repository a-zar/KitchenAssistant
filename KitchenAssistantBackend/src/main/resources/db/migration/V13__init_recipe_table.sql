CREATE TABLE IF NOT EXISTS `kitchen_assistant`.`recipe`(
    id INT PRIMARY KEY auto_increment,
    title VARCHAR(255) NOT NULL,
    instruction TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);