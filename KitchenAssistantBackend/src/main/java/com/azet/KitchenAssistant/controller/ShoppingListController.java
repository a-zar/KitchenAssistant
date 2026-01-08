package com.azet.KitchenAssistant.controller;

import com.azet.KitchenAssistant.Entity.ShoppingList;
import com.azet.KitchenAssistant.Entity.ShoppingListItem;
import com.azet.KitchenAssistant.dao.ShoppingListItemRepository;
import com.azet.KitchenAssistant.dao.ShoppingListRepository;
import com.azet.KitchenAssistant.dto.shoppingList.ShoppingListDto;
import com.azet.KitchenAssistant.dto.shoppingList.ShoppingListItemDto;
import com.azet.KitchenAssistant.dto.shoppingList.ShoppingListItemResponse;
import com.azet.KitchenAssistant.dto.shoppingList.ShoppingListResponse;
import com.azet.KitchenAssistant.service.ShoppingListItemService;
import com.azet.KitchenAssistant.service.ShoppingListService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/shoppingList")
class ShoppingListController {

    @Autowired
    private final ShoppingListRepository shoppingListRepository;

    @Autowired
    private final ShoppingListService shoppingListService;

    @Autowired
    private final ShoppingListItemRepository shoppingListItemRepository;

    @Autowired
    private final ShoppingListItemService shoppingListItemService;


    private static final Logger listLogger = LoggerFactory.getLogger(ShoppingListService.class);

    private static final Logger itemLogger = LoggerFactory.getLogger(ShoppingListItemService.class);


    ShoppingListResponse listResponse = null;
    ShoppingListItemResponse itemResponse = null;

    ShoppingListController(ShoppingListRepository shoppingListRepository, ShoppingListService shoppingListService, ShoppingListItemRepository shoppingListItemRepository, ShoppingListItemService shoppingListItemService) {
        this.shoppingListRepository = shoppingListRepository;
        this.shoppingListService = shoppingListService;
        this.shoppingListItemRepository = shoppingListItemRepository;
        this.shoppingListItemService = shoppingListItemService;
    }

//item ---->
    @RequestMapping(method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE, value = "/{id}/items")
    ResponseEntity<List<ShoppingListItem>> readAllListItems(@PathVariable int id){
        itemLogger.info("all list items");
        return ResponseEntity.ok(shoppingListItemRepository.findByShoppingListId(id));
    }

    @PostMapping(value = "/items/new")
    public ResponseEntity<ShoppingListItemResponse> saveList(@Valid @RequestBody ShoppingListItemDto req){

        // Delegacja logiki do Serwisu
        ShoppingListItemResponse response = shoppingListItemService.createListItem(req);
        itemLogger.info("new list item added id: " + req.getProductId()+ " to list id: " + req.getListId());

        //201 Created
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }


    //list ---->
    @RequestMapping(method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    ResponseEntity<List<ShoppingList>> readAllShoppingLists(){
        listLogger.info("all shopping lists");
        return ResponseEntity.ok(shoppingListRepository.findAll());
    }

    @PostMapping(value = "/new")
    public ResponseEntity<ShoppingListResponse> saveList(@Valid @RequestBody ShoppingListDto req){

        // Delegacja logiki do Serwisu
        ShoppingListResponse response = shoppingListService.createShoppingList(req);
        listLogger.info("new shopping list created: " + req.getListTitle());

        //201 Created
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PutMapping(value = "/edit/{id}")
    public ResponseEntity<ShoppingListResponse> editList(@PathVariable int id, @Valid @RequestBody ShoppingListDto req){

        // Delegacja logiki do Serwisu
        ShoppingListResponse response = shoppingListService.editShoppingList(id, req);
        listLogger.info("edited shopping list created: " + req.getListTitle() + ", id: " +  id );

        //201 Created
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @DeleteMapping(value = "/delete/{id}")
    public ResponseEntity<ShoppingListResponse> deleteList(@PathVariable int id){

        // Delegacja logiki do Serwisu
        listLogger.info("all shopping lists");
        ShoppingList list = shoppingListRepository.findById(id).orElseThrow(()-> new EntityNotFoundException("shopping list not found"));

        shoppingListRepository.deleteById(id);
        listLogger.info("deleted shopping list: " + list.getTitle() + ", id: " +  id );

        ShoppingListResponse response = shoppingListService.deleteShoppingList(id);
        //201 Created
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

}
