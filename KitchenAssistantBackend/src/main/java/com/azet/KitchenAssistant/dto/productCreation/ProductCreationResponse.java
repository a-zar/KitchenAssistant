package com.azet.KitchenAssistant.dto.productCreation;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProductCreationResponse {
    private int id;
    private String productName;
    private String categoryName;
}
