package com.azet.KitchenAssistant.controller;

import com.azet.KitchenAssistant.Entity.Product;
import com.azet.KitchenAssistant.Exception.ResourceNotFoundException;
import com.azet.KitchenAssistant.dao.ProductRepository;
import com.azet.KitchenAssistant.dto.productCreation.ProductCreationRequest;
import com.azet.KitchenAssistant.dto.productCreation.ProductCreationResponse;
import com.azet.KitchenAssistant.service.ProductCreationService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/productCreation")
public class ProductCreationController {

    @Autowired
    private final ProductCreationService productCreationService;
    @Autowired
    private final ProductRepository productRepository;

    private static final Logger logger = LoggerFactory.getLogger(ProductCreationResponse.class);
    ProductCreationResponse response = null;

    public ProductCreationController(ProductCreationService productCreationService, ProductRepository productRepository){
        this.productCreationService = productCreationService;
        this.productRepository = productRepository;
    }

    @PostMapping(value = "/new")
    public ResponseEntity<ProductCreationResponse> saveProduct(@Valid @RequestBody ProductCreationRequest req){

        // Delegacja logiki do Serwisu
        ProductCreationResponse response = productCreationService.createProduct(req);
        logger.info("new product created: " + req.getProductName());

        // Zwracamy status 201 Created
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PutMapping(value = "/edit/{id}")
    public ResponseEntity<ProductCreationResponse> editProduct(@PathVariable int id, @RequestBody ProductCreationRequest toEdit) {

        Product oldProduct = productRepository.findById(id)
                        .orElseThrow(() -> new ResourceNotFoundException("Product not found id: " + id));
        logger.info("edited product: id= " + id + ", old name = " + oldProduct.getName() +", new name= " + toEdit.getProductName());

        ProductCreationResponse response = productCreationService.editProduct(id, toEdit);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }
}
