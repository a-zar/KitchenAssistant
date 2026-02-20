package com.azet.KitchenAssistant.dto.shoppingList;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class ShoppingListDto {
    private Integer id;

    @NotBlank(message = "Nazwa listy jest wymagana.")
    private String listTitle;
    private RecurrencePattern recurrencePattern = RecurrencePattern.BRAK;
    private LocalDate startOccurrenceDate;
    private LocalDate nextOccurrenceDate;

    public void setRecurrencePattern (RecurrencePattern recurrence) {
        if(recurrencePattern == null){
            this.recurrencePattern = RecurrencePattern.BRAK;
        }
        else this.recurrencePattern = recurrence;
    }
}
