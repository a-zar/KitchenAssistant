package com.azet.KitchenAssistant.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

class ShoppingListItemDto {

    @NotBlank
    @Min(value=0, message = "ilosc produktu nie moze być mniejsza niz 0")
    private int quantity;

    @NotBlank
    private Boolean isPurchased;
    private String note;

    @NotBlank(message = "nazwa produktu jest wymagana")
    private String productName;
}

