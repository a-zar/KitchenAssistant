package com.azet.KitchenAssistant.dto.shoppingList;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class ShoppingListResponse {
    private int id;
    private String listTitle;
    private LocalDate nextOccurrenceDate;
    private LocalDate startOccurrenceDate;

}
