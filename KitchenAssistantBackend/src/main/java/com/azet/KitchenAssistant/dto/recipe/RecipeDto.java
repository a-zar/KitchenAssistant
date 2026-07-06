package com.azet.KitchenAssistant.dto.recipe;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RecipeDto {
    @NotBlank(message = "Tytuł przepisu jest wymagany.")
    private String title;
    private String instruction;
}
