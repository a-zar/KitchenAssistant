package com.azet.KitchenAssistant.dao;
import com.azet.KitchenAssistant.Entity.Recipe;
import com.azet.KitchenAssistant.dto.recipe.RecipeDto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.web.bind.annotation.CrossOrigin;

@CrossOrigin(origins = "http://localhost:4200")
@RepositoryRestResource(collectionResourceRel = "recipe", path = "recipe")
public interface RecipeRepository extends JpaRepository<Recipe, Integer> {

}
