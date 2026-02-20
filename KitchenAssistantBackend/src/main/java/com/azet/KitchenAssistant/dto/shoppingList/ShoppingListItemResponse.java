package com.azet.KitchenAssistant.dto.shoppingList;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ShoppingListItemResponse {
    private int id;
    private String productName;
    private int productId;
    private int shoppingListId;
    private String shoppingListName;
    private int quantity;
    private Boolean isPurchased;
    private String note;
}
