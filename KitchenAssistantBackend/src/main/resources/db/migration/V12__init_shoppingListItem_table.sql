CREATE TABLE IF NOT EXISTS `kitchen_assistant`.`shopping_list_item`(
    id INT PRIMARY KEY auto_increment,
    list_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    is_purchased BOOLEAN NOT NULL DEFAULT FALSE,
    note VARCHAR(255),

    CONSTRAINT fk_sli_product FOREIGN KEY (product_id) references product(id),
    CONSTRAINT fk_sli_shopping_list FOREIGN KEY (list_id) references shopping_list(id)
)