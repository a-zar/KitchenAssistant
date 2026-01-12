package com.azet.KitchenAssistant.dto.recipe;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class RecipeDto {
    @NotBlank(message = "Tytuł przepisu jest wymagany.")
    private String title;
    private String instruction;
    @NotNull
    private LocalDate created_at;
}
