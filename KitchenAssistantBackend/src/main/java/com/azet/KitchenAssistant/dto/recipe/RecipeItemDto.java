package com.azet.KitchenAssistant.dto.recipe;

import com.azet.KitchenAssistant.Entity.Recipe;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RecipeItemDto {

    @NotNull(message = "recipeId jest wymagany")
    private Integer recipeId;

    @Min(value=0, message = "waga produktu nie może być mniejsza niz 0g")
    double weight_grams;

    @NotNull(message = "productId jest wymagany")
    private  Integer productId;

}
