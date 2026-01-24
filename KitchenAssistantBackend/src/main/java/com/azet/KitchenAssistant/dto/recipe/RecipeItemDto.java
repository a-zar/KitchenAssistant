package com.azet.KitchenAssistant.dto.recipe;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RecipeItemDto {

    private Integer id;

    @NotNull(message = "recipeId jest wymagany")
    private Integer recipeId;

    @Min(value=0, message = "waga produktu nie może być mniejsza niz 0g")
    double weightGrams;

    @NotNull(message = "productId jest wymagany")
    private  Integer productId;

}
