package com.azet.KitchenAssistant.dto.shoppingList;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ShoppingListItemResponse {
    private int id;
    private String productName;
    private String shoppingListName;
}
