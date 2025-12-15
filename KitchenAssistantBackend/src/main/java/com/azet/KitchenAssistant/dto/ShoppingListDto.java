package com.azet.KitchenAssistant.dto;

import jakarta.validation.constraints.NotBlank;
import java.time.LocalDate;

class ShoppingListDto {

    @NotBlank(message = "Nazwa listy jest wymagana.")
    private String listTitle;

    //parameters to do recurring list
    private Boolean isRecurring;
    private RecurrencePattern recurrencePattern;
    private LocalDate nextOccurrenceDate;

    private ShoppingListItemDto shoppingListItems;
}
