package com.azet.KitchenAssistant.service;

import com.azet.KitchenAssistant.Entity.ShoppingList;
import com.azet.KitchenAssistant.dao.ProductRepository;
import com.azet.KitchenAssistant.dao.ShoppingListItemRepository;
import com.azet.KitchenAssistant.dao.ShoppingListRepository;
import com.azet.KitchenAssistant.dto.shoppingList.RecurrencePattern;
import com.azet.KitchenAssistant.dto.shoppingList.ShoppingListDto;
import com.azet.KitchenAssistant.dto.shoppingList.ShoppingListResponse;
import jakarta.validation.constraints.NotNull;
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
        ShoppingList request = mapRequestShoppingListEntity(newList);
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
     * @param newList mapuje z ShoppingListDto na encję ShoppingList
     * @return ujednolicone dane z dodanymi wartościami isRecurring i nextOccurrenceDate
     */
    private ShoppingList mapRequestShoppingListEntity(ShoppingListDto newList) {
        ShoppingList request = new ShoppingList();
        request.setTitle(newList.getListTitle());
        request.setRecurrencePattern(newList.getRecurrencePattern());

        RecurrencePattern recurrencePattern = request.getRecurrencePattern();
        if(recurrencePattern != null) {
            request.setIsRecurring(true);
            setNextOccurrenceDateToShoppingList(recurrencePattern, request);
        }else {
            request.setIsRecurring(false);
        }
        return request;
    }

    private static void setNextOccurrenceDateToShoppingList(@NotNull final RecurrencePattern recurrencePattern, final ShoppingList request) {
        switch (recurrencePattern) {
            case DAILY -> request.setNextOccurrenceDate(LocalDate.now().plusDays(1));
            case MONTHLY -> request.setNextOccurrenceDate(LocalDate.now().plusMonths(1));
            case WEEKLY -> request.setNextOccurrenceDate(LocalDate.now().plusWeeks(1));
            case YEARLY -> request.setNextOccurrenceDate(LocalDate.now().plusYears(1));
        }
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
