package com.azet.KitchenAssistant.service;

import com.azet.KitchenAssistant.Entity.ShoppingList;
import com.azet.KitchenAssistant.Entity.ShoppingListItem;
import com.azet.KitchenAssistant.dao.ProductRepository;
import com.azet.KitchenAssistant.dao.ShoppingListItemRepository;
import com.azet.KitchenAssistant.dao.ShoppingListRepository;
import com.azet.KitchenAssistant.dto.shoppingList.ShoppingListItemDto;
import com.azet.KitchenAssistant.dto.shoppingList.ShoppingListItemResponse;
import com.azet.KitchenAssistant.dto.shoppingList.ShoppingListResponse;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ShoppingListItemService {
    @Autowired
    private ShoppingListItemRepository shoppingListItemRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ShoppingListRepository shoppingListRepository;

    public ShoppingListItemResponse createListItem(ShoppingListItemDto newListItem){
        ShoppingListItemResponse response= new ShoppingListItemResponse();

        ShoppingListItem request = new ShoppingListItem();
        request.setQuantity(newListItem.getQuantity());
        request.setIsPurchased(newListItem.getIsPurchased());
        request.setProduct(productRepository.findById(newListItem.getProductId()).orElseThrow(() -> new EntityNotFoundException("product not found with id: "+ newListItem.getProductId())));
        request.setShoppingList(shoppingListRepository.findById(newListItem.getListId()).orElseThrow(()-> new EntityNotFoundException("shopping list not found")));

        shoppingListItemRepository.save(request);

        response.setId(request.getId());
        response.setShoppingListName(request.getShoppingList().getTitle());
        response.setProductName(request.getProduct().getName());
        return response;
    }

    public ShoppingListItemResponse deleteShoppingListItem(final int id) {
        ShoppingListItem item = shoppingListItemRepository.findById(id).orElseThrow(() -> new
                EntityNotFoundException("item not found id: "+id));
        shoppingListItemRepository.deleteById(id);
        return getShoppingListItemResponse(item);
    }

    private static ShoppingListItemResponse getShoppingListItemResponse(final ShoppingListItem savedItem) {
        ShoppingListItemResponse response = new ShoppingListItemResponse();
        response.setId(savedItem.getId());
        response.setProductName(savedItem.getProduct().getName());
        response.setShoppingListName(savedItem.getShoppingList().getTitle());
        return response;
    }
}
