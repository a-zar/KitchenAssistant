package com.azet.KitchenAssistant.dto.shoppingList;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class ShoppingListDto {

    @NotBlank(message = "Nazwa listy jest wymagana.")
    private String listTitle;
    private RecurrencePattern recurrencePattern;
    private LocalDate startOccurrenceDate;

//  private LocalDate nextOccurrenceDate;
//    private Set<ShoppingListItemDto> shoppingListItems;
}
