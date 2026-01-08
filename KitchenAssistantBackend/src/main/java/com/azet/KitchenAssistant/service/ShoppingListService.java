package com.azet.KitchenAssistant.service;

import com.azet.KitchenAssistant.Entity.ShoppingList;
import com.azet.KitchenAssistant.dao.ProductRepository;
import com.azet.KitchenAssistant.dao.ShoppingListItemRepository;
import com.azet.KitchenAssistant.dao.ShoppingListRepository;
import com.azet.KitchenAssistant.dto.shoppingList.RecurrencePattern;
import com.azet.KitchenAssistant.dto.shoppingList.ShoppingListDto;
import com.azet.KitchenAssistant.dto.shoppingList.ShoppingListResponse;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDate;

@Service
public class ShoppingListService {

    @Autowired
    private ShoppingListRepository shoppingListRepository;

    @Autowired
    private ShoppingListItemRepository shoppingListItemRepository;

    @Autowired
    private ProductRepository productRepository;

    /**
     * tworzenie nowego zbioru listy zakupów bez listy produktów
     * @param newList nowy zbiór listy zakupów
     * @return id, listTitle, nextOccurrenceDate
     */
    public ShoppingListResponse createShoppingList(ShoppingListDto newList){
        ShoppingList request = mapRequestShoppingListEntity(newList, null);
        ShoppingList savedList = shoppingListRepository.save(request);
        return getShoppingListResponse(savedList);
    }

    public ShoppingListResponse editShoppingList(int id, ShoppingListDto listToEdit){

        ShoppingList oldList = shoppingListRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("shopping list not found"));

        ShoppingList request = mapRequestShoppingListEntity(listToEdit, oldList);
        ShoppingList savedList = shoppingListRepository.save(request);
        return getShoppingListResponse(savedList);
    }

    private static ShoppingListResponse getShoppingListResponse(final ShoppingList savedList) {
        ShoppingListResponse response = new ShoppingListResponse();
        response.setId(savedList.getId());
        response.setListTitle(savedList.getTitle());
        response.setNextOccurrenceDate(savedList.getNextOccurrenceDate());
        return response;
    }

    /**
     *
     * @param listToMap mapuje z ShoppingListDto na encję ShoppingList
     * @return ujednolicone dane z dodanymi wartościami isRecurring i nextOccurrenceDate
     */
    private ShoppingList mapRequestShoppingListEntity(ShoppingListDto listToMap, ShoppingList oldList) {
        ShoppingList list = oldList == null ? new ShoppingList() : oldList;

        list.setTitle(listToMap.getListTitle());
        list.setRecurrencePattern(listToMap.getRecurrencePattern());

        RecurrencePattern recurrencePattern = list.getRecurrencePattern();

        LocalDate startOccurrenceDate = listToMap.getStartOccurrenceDate();

        if (recurrencePattern != null) {
            list.setIsRecurring(true);
            setNextOccurrenceDateToShoppingList(startOccurrenceDate,recurrencePattern, list);
        } else {
            list.setIsRecurring(false);
            list.setRecurrencePattern(null);
            list.setNextOccurrenceDate(null);
        }
        return list;
    }

    private static void setNextOccurrenceDateToShoppingList(final LocalDate startOccurrenceDate, final RecurrencePattern recurrencePattern, final ShoppingList request) {
        switch (recurrencePattern) {
            case DAILY -> request.setNextOccurrenceDate(LocalDate.now().plusDays(1));
            case MONTHLY -> request.setNextOccurrenceDate(startOccurrenceDate.plusMonths(1));
            case WEEKLY -> request.setNextOccurrenceDate(startOccurrenceDate.plusWeeks(1));
            case YEARLY -> request.setNextOccurrenceDate(startOccurrenceDate.plusYears(1));
        }
    }

    public ShoppingListResponse deleteShoppingList(final int id) {
        ShoppingList list = shoppingListRepository.findById(id).orElseThrow(() -> new
        EntityNotFoundException("shopping list not found"));
        return getShoppingListResponse(list);
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
