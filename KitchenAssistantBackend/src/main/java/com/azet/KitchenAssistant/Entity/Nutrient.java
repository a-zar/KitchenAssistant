package com.azet.KitchenAssistant.Entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(name="nutrient")
@Getter
@Setter
@ToString(exclude = "product")
public class Nutrient {

    //data for 100g of products

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private int energy;

    @Column(columnDefinition="Decimal(5,2)")
    private double fat;

    @Column(columnDefinition="Decimal(5,2)")
    private double saturatedFat;

    @Column(columnDefinition="Decimal(5,2)")
    private double carbohydrate;

    @Column(columnDefinition="Decimal(5,2)")
    private double sugar;

    @Column(columnDefinition="Decimal(5,2)")
    private double protein;

    @Column(columnDefinition="Decimal(5,2)")
    private double fiber;

    private String nutritionGrade;

    @OneToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinColumn(name="product_id")
    @JsonIgnore
    private Product product;
}


//TODO
//https://pl.openfoodfacts.org/api/v0/product/4056489180968?fields=product_name,nutriscore_data,nutriments,nutrition_grades

//https://pl.openfoodfacts.org/api/v0/product/4056489180968.json