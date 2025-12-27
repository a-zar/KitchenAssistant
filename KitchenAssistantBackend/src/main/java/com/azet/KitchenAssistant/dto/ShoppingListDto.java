package com.azet.KitchenAssistant.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.Set;

@Getter
@Setter
public class ShoppingListDto {

    @NotBlank(message = "Nazwa listy jest wymagana.")
    private String listTitle;

    //parameters to do recurring list
    private Boolean isRecurring;
    private RecurrencePattern recurrencePattern;
    private LocalDate nextOccurrenceDate;

//    private Set<ShoppingListItemDto> shoppingListItems;
}
