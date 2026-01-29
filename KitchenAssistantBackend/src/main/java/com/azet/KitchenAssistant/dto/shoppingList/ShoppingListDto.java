package com.azet.KitchenAssistant.dto.shoppingList;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class ShoppingListDto {
    @NotNull
    private Integer id;

    @NotBlank(message = "Nazwa listy jest wymagana.")
    private String listTitle;
    private RecurrencePattern recurrencePattern;
    private LocalDate startOccurrenceDate;

//  private LocalDate nextOccurrenceDate;
//    private Set<ShoppingListItemDto> shoppingListItems;
}
