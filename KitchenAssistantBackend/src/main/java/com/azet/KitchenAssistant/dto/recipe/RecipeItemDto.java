package com.azet.KitchenAssistant.dto.recipe;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RecipeItemDto {

    @Valid
    @NotNull(message = "Dane przepisy są wymagane.")
    RecipeDto recipe;

    @Min(value=0, message = "waga produktu nie może być mniejsza niz 0g")
    double weight_grams;

    @NotNull
    private  Integer productId;

}
