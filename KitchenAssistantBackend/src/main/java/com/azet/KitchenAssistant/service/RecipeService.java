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
        Recipe request = new Recipe();
        Recipe requestToSave= mapRecipeDtoToEntity(newRecipe, request);
        recipeRepository.save(requestToSave);
        return getRecipeResponse(requestToSave);
    }

    public RecipeResponse editRecipe(int id, RecipeDto recipeToEdit){
        //verify if recipe exist in db
        Recipe request = getRequestOrElseThrow(id);
        Recipe requestToSave = mapRecipeDtoToEntity(recipeToEdit, request);
        recipeRepository.save(requestToSave);
        return getRecipeResponse(requestToSave);
    }

    public RecipeResponse deleteRecipe(int id){
        Recipe request = getRequestOrElseThrow(id);
        recipeRepository.deleteById(id);
        return getRecipeResponse(request);
    }

    private Recipe getRequestOrElseThrow(final int id) {
        return recipeRepository.findById(id).orElseThrow(() -> new RuntimeException("recipe not found id: " + id));
    }

    private static Recipe mapRecipeDtoToEntity(final RecipeDto newRecipe, final Recipe request) {
        request.setTitle(newRecipe.getTitle());
        request.setInstruction(newRecipe.getInstruction());
        return request;
    }

    private static RecipeResponse getRecipeResponse(final Recipe request) {
        RecipeResponse response = new RecipeResponse();
        response.setRecipeTitle(request.getTitle());
        response.setId(request.getId());
        return response;
    }

}
