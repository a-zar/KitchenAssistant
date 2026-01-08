package com.azet.KitchenAssistant.service;

import com.azet.KitchenAssistant.Entity.ShoppingListItem;
import com.azet.KitchenAssistant.dao.ProductRepository;
import com.azet.KitchenAssistant.dao.ShoppingListItemRepository;
import com.azet.KitchenAssistant.dao.ShoppingListRepository;
import com.azet.KitchenAssistant.dto.shoppingList.ShoppingListItemDto;
import com.azet.KitchenAssistant.dto.shoppingList.ShoppingListItemResponse;
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
}
