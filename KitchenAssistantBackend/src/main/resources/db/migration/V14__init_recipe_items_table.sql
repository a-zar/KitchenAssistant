CREATE TABLE IF NOT EXISTS `kitchen_assistant`.`recipe_items`(
    id INT PRIMARY KEY auto_increment,
    recipe_id INT NOT NULL,
    product_id INT NOT NULL,
    weight_grams INT NOT NULL,

    CONSTRAINT fk_ri_product FOREIGN KEY (product_id) references product(id),
    CONSTRAINT fk_ri_recipe FOREIGN KEY (recipe_id) references recipe(id)
);