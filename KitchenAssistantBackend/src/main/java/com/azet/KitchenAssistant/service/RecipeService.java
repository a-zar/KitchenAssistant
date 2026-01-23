package com.azet.KitchenAssistant.service;

import com.azet.KitchenAssistant.Entity.Recipe;
import com.azet.KitchenAssistant.dao.RecipeItemRepository;
import com.azet.KitchenAssistant.dao.RecipeRepository;
import com.azet.KitchenAssistant.dto.recipe.RecipeDto;
import com.azet.KitchenAssistant.dto.recipe.RecipeResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class RecipeService {

    @Autowired
    private RecipeRepository recipeRepository;

    @Autowired
    private RecipeItemRepository recipeItemRepository;


    public RecipeResponse createRecipe(RecipeDto newRecipe){
        RecipeResponse response = new RecipeResponse();

        Recipe recipe = new Recipe();

        recipe.setTitle(newRecipe.getTitle());
        recipe.setInstruction(newRecipe.getInstruction());
        recipeRepository.save(recipe);

        response.setId(recipe.getId());
        response.setRecipeTitle(recipe.getTitle());
        return response;
    }

    public RecipeResponse editRecipe(int id, RecipeDto recipeToEdit){

        //verify if recipe exist in db
        Recipe oldRecipe = recipeRepository.findById(id).orElseThrow(()-> new RuntimeException("recipe not found id: "+ id));


        RecipeResponse response = new RecipeResponse();
        return response;
    }

    public RecipeResponse deleteRecipe(int id){

        RecipeResponse response = new RecipeResponse();
        return response;
    }

}
