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
    @RequestMapping(method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE, value = "/listId/{listId}/items")
    ResponseEntity<List<ShoppingListItem>> readAllListItems(@PathVariable int listId){
        itemLogger.info("all list items");
        return ResponseEntity.ok(shoppingListItemRepository.findByShoppingListId(listId));
    }

    @PostMapping(value = "/items/new")
    public ResponseEntity<ShoppingListItemResponse> saveList(@Valid @RequestBody ShoppingListItemDto req){

        // Delegacja logiki do Serwisu
        ShoppingListItemResponse response = shoppingListItemService.createListItem(req);
        itemLogger.info("new item added id: " + req.getProductId()+ " to list id: " + req.getListId());

        //201 Created
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @DeleteMapping(value = "/listId/{listId}/delete/itemId/{itemId}")
    public ResponseEntity<ShoppingListItemResponse> deleteItem(@PathVariable int listId,@PathVariable int itemId){
        listLogger.info("delete item id: " + itemId + " from shopping list: " + listId);
        ShoppingListItem item = shoppingListItemRepository.findById(itemId).orElseThrow(()-> new EntityNotFoundException("item not found id: "+ itemId));

        if (item.getShoppingList().getId() == listId){
        listLogger.info("deleted item id: " +itemId);
        ShoppingListItemResponse response = shoppingListItemService.deleteShoppingListItem(itemId);
        //201 Created
        return new ResponseEntity<>(response, HttpStatus.OK);
        }
        else {
            listLogger.info("selected item id: " +itemId+ "is not on that list id: "+ listId);
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
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

    @PutMapping(value = "/edit/listId/{listId}")
    public ResponseEntity<ShoppingListResponse> editList(@PathVariable int listId, @Valid @RequestBody ShoppingListDto req){

        // Delegacja logiki do Serwisu
        ShoppingListResponse response = shoppingListService.editShoppingList(listId, req);
        listLogger.info("edited shopping list created: " + req.getListTitle() + ", id: " +  listId );

        //201 Created
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @DeleteMapping(value = "/delete/listId/{listId}")
    public ResponseEntity<ShoppingListResponse> deleteList(@PathVariable int listId){

        // Delegacja logiki do Serwisu
        listLogger.info("delete shopping list id: " + listId);

//        shoppingListRepository.deleteById(listId);
        ShoppingListResponse response = shoppingListService.deleteShoppingList(listId);
        listLogger.info("deleted shopping list id: " +  listId );

        //201 Created
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    //TODO add HttpStatus.BAD_REQUEST
}
