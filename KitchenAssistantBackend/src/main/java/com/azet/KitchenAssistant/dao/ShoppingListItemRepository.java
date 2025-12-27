package com.azet.KitchenAssistant.dao;
import com.azet.KitchenAssistant.Entity.ShoppingListItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.web.bind.annotation.CrossOrigin;

@CrossOrigin(origins = "http://localhost:4200")
@RepositoryRestResource(collectionResourceRel = "shoppingListItem", path = "shopping-list-item")
public interface ShoppingListItemRepository extends JpaRepository<ShoppingListItem, Integer> {
}
