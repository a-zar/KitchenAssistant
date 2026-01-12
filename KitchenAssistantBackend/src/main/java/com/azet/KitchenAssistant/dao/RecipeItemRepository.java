package com.azet.KitchenAssistant.dao;
import com.azet.KitchenAssistant.Entity.RecipeItem;
import com.azet.KitchenAssistant.dto.recipe.RecipeItemDto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.web.bind.annotation.CrossOrigin;

@CrossOrigin(origins = "http://localhost:4200")
@RepositoryRestResource(collectionResourceRel = "recipeItem", path = "recipeItem")
public interface RecipeItemRepository extends JpaRepository<RecipeItem, Integer> {

}
