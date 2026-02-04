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
import java.util.stream.Collectors;

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
    ResponseEntity<List<ShoppingListItemDto>> readAllListItems(@PathVariable int listId){
        itemLogger.info("all list items");

        List<ShoppingListItem> items = shoppingListItemRepository.findByShoppingListId(listId);

        List<ShoppingListItemDto> dtos = items.stream().map(item -> {
            ShoppingListItemDto dto = new ShoppingListItemDto();
            dto.setProductId(item.getProduct().getId());
            dto.setListId(item.getShoppingList().getId());
            dto.setQuantity(item.getQuantity());
            dto.setIsPurchased(item.getIsPurchased());
            dto.setNote(item.getNote());
            return dto;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(dtos);
    }

    @PostMapping(value = "/items/new")
    public ResponseEntity<ShoppingListItemResponse> saveList(@Valid @RequestBody ShoppingListItemDto req){
        ShoppingListItemResponse response = shoppingListItemService.createListItem(req);
        itemLogger.info("New item added id: " + req.getProductId()+ " to list id: " + req.getListId());
        return new ResponseEntity<>(response, HttpStatus.CREATED); //code 201
    }

    @DeleteMapping(value = "/listId/{listId}/delete/itemId/{itemId}")
    public ResponseEntity<Void> deleteItem(@PathVariable int listId,@PathVariable int itemId){
        listLogger.info("Attempting to delete item id: " + itemId + " from shopping list: " + listId);
        ShoppingListItemResponse response = shoppingListItemService.deleteShoppingListItem(itemId); //if not found code 404
        listLogger.info("Deleted item id: " +itemId);
        return  ResponseEntity.noContent().build(); //code 204
    }

    //list ---->
    //http://localhost:8080/api/shoppingList
    @RequestMapping(method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    ResponseEntity<List<ShoppingListDto>> readAllShoppingLists(){
        listLogger.info("Read all shopping lists");

        List<ShoppingList> list = shoppingListRepository.findAll();

        List<ShoppingListDto> dtos = list.stream().map(entity ->{
            ShoppingListDto dto = new ShoppingListDto();
            dto.setId(entity.getId());
            dto.setListTitle(entity.getTitle());
            dto.setRecurrencePattern(entity.getRecurrencePattern());
            dto.setNextOccurrenceDate(entity.getNextOccurrenceDate());
            dto.setStartOccurrenceDate(entity.getStartOccurrenceDate());
            return dto;
        }).toList();
        
        return ResponseEntity.ok(dtos);
    }

    @PostMapping(value = "/new")
    public ResponseEntity<ShoppingListResponse> saveList(@Valid @RequestBody ShoppingListDto req){
        ShoppingListResponse response = shoppingListService.createShoppingList(req);
        listLogger.info("Created new shopping list id: {}",req.getListTitle());
        return new ResponseEntity<>(response, HttpStatus.CREATED); //201
    }

    @PutMapping(value = "/edit/listId/{listId}")
    public ResponseEntity<ShoppingListResponse> editList(@PathVariable int listId, @Valid @RequestBody ShoppingListDto req){
        listLogger.info("Attempting to edit list id: {}", listId);
        ShoppingListResponse response = shoppingListService.editShoppingList(listId, req); //if not found code 404
        listLogger.info("Edited shopping list: " + req.getListTitle() + ", id: " +  listId );
        return new ResponseEntity<>(response, HttpStatus.CREATED); //201
    }

    @DeleteMapping(value = "/delete/listId/{listId}")
    public ResponseEntity<Void> deleteList(@PathVariable int listId){
        listLogger.info("Attempting to delete list id: {}", listId);
        ShoppingListResponse response = shoppingListService.deleteShoppingList(listId);
        listLogger.info("deleted shopping list id: " +  listId );
        return ResponseEntity.noContent().build(); //204
    }
}
