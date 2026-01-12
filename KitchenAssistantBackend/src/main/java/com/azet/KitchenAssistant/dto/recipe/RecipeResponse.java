package com.azet.KitchenAssistant.dto.recipe;

import lombok.Getter;
import lombok.Setter;

import java.util.Set;

@Getter
@Setter
public class RecipeResponse {
    private int id;
    private String recipeTitle;
//    private Set<RecipeItemDto> recipeItems;
}
