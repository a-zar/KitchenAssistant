package com.azet.KitchenAssistant.dto.recipe;

import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Getter
@Setter
public class RecipeResponse {
    private int id;
    private String recipeTitle;
    private String instruction;
    private LocalDateTime created_at;
}
