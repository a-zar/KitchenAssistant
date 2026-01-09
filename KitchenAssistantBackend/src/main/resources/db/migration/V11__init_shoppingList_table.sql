CREATE TABLE IF NOT EXISTS `kitchen_assistant`.`shopping_list`(
    id INT PRIMARY KEY auto_increment,
    title VARCHAR(255) NOT NULL,
    is_recurring BOOLEAN NOT NULL DEFAULT FALSE,
    recurrence_pattern VARCHAR(50),
    next_occurrence_date DATE
)