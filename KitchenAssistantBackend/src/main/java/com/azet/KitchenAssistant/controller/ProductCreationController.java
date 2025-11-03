package com.azet.KitchenAssistant.controller;

import com.azet.KitchenAssistant.dto.ProductCreationRequest;
import com.azet.KitchenAssistant.dto.ProductCreationResponse;
import com.azet.KitchenAssistant.service.ProductCreationService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/productCreation")
public class ProductCreationController {

    @Autowired
    private ProductCreationService productCreationService;

    public ProductCreationController(ProductCreationService productCreationService){
        this.productCreationService = productCreationService;
    }

    @PostMapping("/new")
    public ResponseEntity<ProductCreationResponse> saveProduct(@Valid @RequestBody ProductCreationRequest req){

        // Delegacja logiki do Serwisu
        ProductCreationResponse response = productCreationService.createProduct(req);

        // Zwracamy status 201 Created
        return new ResponseEntity<>(response, HttpStatus.CREATED);

    }

}
