package com.azet.KitchenAssistant.dto.productCreation;

import com.azet.KitchenAssistant.Entity.Product;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class NutrientData {

    @PositiveOrZero
    private int energy;

    @PositiveOrZero
    private double fat;

    @PositiveOrZero
    private double saturatedFat;

    @PositiveOrZero
    private double carbohydrate;

    @PositiveOrZero
    private double sugar;

    @PositiveOrZero
    private double protein;

    @PositiveOrZero
    private double fiber;

    @NotNull
    private String nutritionGrade;

}
