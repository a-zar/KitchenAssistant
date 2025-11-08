package com.azet.KitchenAssistant.controller;

import com.azet.KitchenAssistant.dao.ProductRepository;
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
    private final ProductCreationService productCreationService;
    private final ProductRepository productRepository;

    ProductCreationResponse response = null;

    public ProductCreationController(ProductCreationService productCreationService, ProductRepository productRepository){
        this.productCreationService = productCreationService;
        this.productRepository = productRepository;
    }

    @PostMapping(value = "/new")
    public ResponseEntity<ProductCreationResponse> saveProduct(@Valid @RequestBody ProductCreationRequest req){

        // Delegacja logiki do Serwisu
        ProductCreationResponse response = productCreationService.createProduct(req);

        // Zwracamy status 201 Created
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PutMapping(value = "/edit/{id}")
    public ResponseEntity<ProductCreationResponse> editProduct(@PathVariable int id, @RequestBody ProductCreationRequest toEdit) {

        if (!productRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

//        productRepository.findById(id).ifPresent(prod ->
//                productCreationService.editProduct(id, toEdit));

        if (productRepository.findById(id).isPresent()) {
            response = productCreationService.editProduct(id, toEdit);
        }
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }
}
