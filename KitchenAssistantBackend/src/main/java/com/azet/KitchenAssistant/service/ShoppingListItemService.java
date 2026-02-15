package com.azet.KitchenAssistant.service;

import com.azet.KitchenAssistant.Entity.ShoppingList;
import com.azet.KitchenAssistant.Entity.ShoppingListItem;
import com.azet.KitchenAssistant.Exception.ResourceNotFoundException;
import com.azet.KitchenAssistant.dao.ProductRepository;
import com.azet.KitchenAssistant.dao.ShoppingListItemRepository;
import com.azet.KitchenAssistant.dao.ShoppingListRepository;
import com.azet.KitchenAssistant.dto.shoppingList.ShoppingListItemDto;
import com.azet.KitchenAssistant.dto.shoppingList.ShoppingListItemResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ShoppingListItemService {
    @Autowired
    private ShoppingListItemRepository shoppingListItemRepository;
    @Autowired
    private ProductRepository productRepository;
    @Autowired
    private ShoppingListRepository shoppingListRepository;

    public ShoppingListItemResponse createListItem(ShoppingListItemDto newListItemDto){
        final ShoppingListItem itemToCreate = mapShoppingListItemToEntity(newListItemDto, null);
        shoppingListItemRepository.save(itemToCreate);
        return getShoppingListItemResponse(itemToCreate);
    }

    public ShoppingListItemResponse updateShoppingListItem(final int itemId, ShoppingListItemDto listItemDtoToUpdate) {
        ShoppingListItem oldItem = getListItemIfExistOrThrowException(itemId);
        final ShoppingListItem itemToUpdate = mapShoppingListItemToEntity(listItemDtoToUpdate, oldItem);
        shoppingListItemRepository.save(itemToUpdate);
        return getShoppingListItemResponse(itemToUpdate);
    }

    public void deleteShoppingListItem(final int id) {
        ShoppingListItem item = shoppingListItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Item not found id: "+id));
        shoppingListItemRepository.deleteById(id);
        getShoppingListItemResponse(item);
    }

    public List<ShoppingListItemDto> getShoppingListItemDtos(final List<ShoppingListItem> items) {
        return items.stream().map(item -> {
            ShoppingListItemDto dto = new ShoppingListItemDto();
            dto.setProductId(item.getProduct().getId());
            dto.setListId(item.getShoppingList().getId());
            dto.setQuantity(item.getQuantity());
            dto.setIsPurchased(item.getIsPurchased());
            dto.setNote(item.getNote());
            dto.setId(item.getId());
            return dto;
        }).collect(Collectors.toList());
    }

    public List<ShoppingListItem> findItemByShoppingListId(final int listId){
        verifyIfListExistOrThrowException(listId);
        return shoppingListItemRepository.findByShoppingListId(listId);
    }

    private void verifyIfListExistOrThrowException(final int listId) {
        if (!shoppingListRepository.existsById(listId)) {
            throw new ResourceNotFoundException("Shopping List not found with id: " + listId);
        }
    }

    private ShoppingListItem getListItemIfExistOrThrowException(final int listIdUrl) {
        return shoppingListItemRepository.findById(listIdUrl).orElseThrow(
                () -> new ResourceNotFoundException("Shopping List item not found with id: " + listIdUrl));
    }

    private ShoppingListItemResponse getShoppingListItemResponse(final ShoppingListItem savedItem) {
        ShoppingListItemResponse response = new ShoppingListItemResponse();
        response.setId(savedItem.getId());
        response.setProductName(savedItem.getProduct().getName());
        response.setShoppingListName(savedItem.getShoppingList().getTitle());
        return response;
    }

    private ShoppingListItem mapShoppingListItemToEntity(ShoppingListItemDto toMap, ShoppingListItem dataInDb) {
        ShoppingListItem item = dataInDb == null ? new ShoppingListItem() : dataInDb;
        item.setQuantity(toMap.getQuantity());
        item.setIsPurchased(toMap.getIsPurchased());
        item.setNote(toMap.getNote());
        item.setProduct(productRepository.findById(toMap.getProductId()).orElseThrow(() -> new ResourceNotFoundException("product not found with id: "+ toMap.getProductId())));
        item.setShoppingList(shoppingListRepository.findById(toMap.getListId()).orElseThrow(()-> new ResourceNotFoundException("shopping list not found")));
        return item;
    }
}
