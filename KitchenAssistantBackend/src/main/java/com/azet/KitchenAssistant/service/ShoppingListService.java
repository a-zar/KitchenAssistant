package com.azet.KitchenAssistant.service;

import com.azet.KitchenAssistant.Entity.ShoppingList;
import com.azet.KitchenAssistant.Entity.ShoppingListItem;
import com.azet.KitchenAssistant.dao.ProductRepository;
import com.azet.KitchenAssistant.dao.ShoppingListItemRepository;
import com.azet.KitchenAssistant.dao.ShoppingListRepository;
import com.azet.KitchenAssistant.dto.ShoppingListDto;
import com.azet.KitchenAssistant.dto.ShoppingListResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
class ShoppingListService {

    @Autowired
    private ShoppingListRepository shoppingListRepository;

    @Autowired
    private ShoppingListItemRepository shoppingListItemRepository;

    @Autowired
    private ProductRepository productRepository;

    /**
     * tworzenie tylko nowego zbioru listy zakupów bez listy produktów
     * @param newList nowy zbiór listy zakupów
     * @return id, listTitle
     */
    public ShoppingListResponse createShoppingList(ShoppingListDto newList){

        ShoppingList request = mapRequestShoppingListEntity(newList);
        ShoppingList savedList = shoppingListRepository.save(request);
        ShoppingListResponse response = new ShoppingListResponse();
        response.setId(savedList.getId());
        response.setListTitle(savedList.getTitle());
        return response;
    }

    private ShoppingList mapRequestShoppingListEntity(ShoppingListDto newList) {
        ShoppingList request = new ShoppingList();
        request.setTitle(newList.getListTitle());
        request.setIsRecurring(newList.getIsRecurring());
        request.setRecurrencePattern(newList.getRecurrencePattern());
        request.setNextOccurrenceDate(newList.getNextOccurrenceDate());
        return request;
    }

//    private Set<ShoppingListItem> getShoppingListItems(final ShoppingListDto newList) {
//        Set<ShoppingListItem> items = newList.getShoppingListItems().stream().map(dto -> {
//            ShoppingListItem item = new ShoppingListItem();
//            item.setNote(dto.getNote());
//            item.setQuantity(dto.getQuantity());
//            item.setIsPurchased(dto.getIsPurchased());
//            item.setProduct(productRepository.findById(dto.getProductId()).orElseThrow(() -> new EntityNotFoundException("Product not found")));
//            return item;
//        }).collect(Collectors.toSet());
//        return items;
//    }
}
