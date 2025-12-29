package com.azet.KitchenAssistant.controller;

import com.azet.KitchenAssistant.dao.ShoppingListRepository;
import com.azet.KitchenAssistant.dto.shoppingList.ShoppingListDto;
import com.azet.KitchenAssistant.dto.shoppingList.ShoppingListResponse;
import com.azet.KitchenAssistant.service.ShoppingListService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/shoppingList")
class ShoppingListController {

    @Autowired
    private final ShoppingListRepository shoppingListRepository;

    @Autowired
    private final ShoppingListService shoppingListService;

    private static final Logger logger = LoggerFactory.getLogger(ShoppingListService.class);
    ShoppingListResponse response = null;

    ShoppingListController(ShoppingListRepository shoppingListRepository, ShoppingListService shoppingListService) {
        this.shoppingListRepository = shoppingListRepository;
        this.shoppingListService = shoppingListService;
    }

    //TODO GetMapping

    @PostMapping(value = "/new")
    public ResponseEntity<ShoppingListResponse> saveList(@Valid @RequestBody ShoppingListDto req){

        // Delegacja logiki do Serwisu
        ShoppingListResponse response = shoppingListService.createShoppingList(req);
        logger.info("new shopping list created: " + req.getListTitle());

        //201 Created
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PutMapping(value = "/edit/{id}")
    public ResponseEntity<ShoppingListResponse> editList(@PathVariable int id, @Valid @RequestBody ShoppingListDto req){

        // Delegacja logiki do Serwisu
        ShoppingListResponse response = shoppingListService.editShoppingList(id, req);
        logger.info("edited shopping list created: " + req.getListTitle() + ", id: " +  id );

        //201 Created
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }
}
