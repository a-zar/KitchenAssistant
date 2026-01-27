package com.azet.KitchenAssistant.dao;
import com.azet.KitchenAssistant.Entity.RecipeItem;
import com.azet.KitchenAssistant.Entity.ShoppingListItem;
import com.azet.KitchenAssistant.dto.recipe.RecipeItemDto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.List;

@CrossOrigin(origins = "http://localhost:4200")
@RepositoryRestResource(collectionResourceRel = "recipeItem", path = "recipeItem")
public interface RecipeItemRepository extends JpaRepository<RecipeItem, Integer> {

    // Wyszukiwanie po ID obiektu powiązanego (recipe.id)
    List<RecipeItem> findByRecipeId(@Param("id") Integer id);
}
