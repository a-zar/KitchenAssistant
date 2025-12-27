package com.azet.KitchenAssistant.dao;
import com.azet.KitchenAssistant.Entity.ShoppingList;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.web.bind.annotation.CrossOrigin;

@CrossOrigin(origins = "http://localhost:4200")
@RepositoryRestResource(collectionResourceRel = "shoppingList", path = "shoppingList")
public interface ShoppingListRepository extends JpaRepository<ShoppingList, Integer> {

}
