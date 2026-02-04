package com.azet.KitchenAssistant.service;

import com.azet.KitchenAssistant.Entity.ShoppingList;
import com.azet.KitchenAssistant.Exception.ResourceNotFoundException;
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

import static com.azet.KitchenAssistant.dto.shoppingList.RecurrencePattern.BRAK;

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

    public ShoppingListResponse editShoppingList(final int id, ShoppingListDto listToEdit){

        ShoppingList oldList = shoppingListRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Shopping list not found id: "+ id));

        ShoppingList request = mapRequestShoppingListEntity(listToEdit, oldList);
        ShoppingList savedList = shoppingListRepository.save(request);
        return getShoppingListResponse(savedList);
    }

    public ShoppingListResponse deleteShoppingList(final int id) {
        ShoppingList list = shoppingListRepository.findById(id).orElseThrow(() -> new
                ResourceNotFoundException("Shopping list not found id: "+ id));
        shoppingListRepository.deleteById(id);
        return getShoppingListResponse(list);
    }

    private static ShoppingListResponse getShoppingListResponse(final ShoppingList savedList) {
        ShoppingListResponse response = new ShoppingListResponse();
        response.setId(savedList.getId());
        response.setListTitle(savedList.getTitle());
        response.setNextOccurrenceDate(savedList.getNextOccurrenceDate());
        response.setStartOccurrenceDate(savedList.getStartOccurrenceDate());
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

        LocalDate startOccurrenceDate = listToMap.getStartOccurrenceDate() == null ? LocalDate.now() : listToMap.getStartOccurrenceDate();

        if (recurrencePattern != BRAK) {
            list.setIsRecurring(true);

            list.setStartOccurrenceDate(startOccurrenceDate);

            setNextOccurrenceDateToShoppingList(startOccurrenceDate,recurrencePattern, list);
        } else {
            list.setIsRecurring(false);
            list.setRecurrencePattern(BRAK);
            list.setNextOccurrenceDate(null);
            list.setStartOccurrenceDate(null);
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
}
