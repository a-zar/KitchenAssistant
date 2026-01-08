package com.azet.KitchenAssistant.dao;
import com.azet.KitchenAssistant.Entity.ShoppingListItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.List;

@CrossOrigin(origins = "http://localhost:4200")
@RepositoryRestResource(collectionResourceRel = "shoppingListItem", path = "shoppingListItem")
public interface ShoppingListItemRepository extends JpaRepository<ShoppingListItem, Integer> {
    // Wyszukiwanie po ID obiektu powiązanego (shoppingList.id)
    List<ShoppingListItem> findByShoppingListId(@Param("id") Integer id);
}
