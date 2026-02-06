package com.azet.KitchenAssistant.dto.shoppingList;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ShoppingListItemDto {
    private Integer id;
    @NotNull
    private  Integer productId;

    @NotNull
    private  Integer listId;

    @Min(value=0, message = "ilość produktu nie może być mniejsza niz 0")
    private int quantity;

    private Boolean isPurchased;
    private String note;
}

