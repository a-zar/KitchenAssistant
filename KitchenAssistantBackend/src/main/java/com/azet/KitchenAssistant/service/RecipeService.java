package com.azet.KitchenAssistant.service;

import com.azet.KitchenAssistant.Entity.Recipe;
import com.azet.KitchenAssistant.Entity.RecipeItem;
import com.azet.KitchenAssistant.Exception.ResourceNotFoundException;
import com.azet.KitchenAssistant.dao.ProductRepository;
import com.azet.KitchenAssistant.dao.RecipeItemRepository;
import com.azet.KitchenAssistant.dao.RecipeRepository;
import com.azet.KitchenAssistant.dto.recipe.RecipeDto;
import com.azet.KitchenAssistant.dto.recipe.RecipeItemDto;
import com.azet.KitchenAssistant.dto.recipe.RecipeResponse;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RecipeService {

    @Autowired
    private RecipeRepository recipeRepository;

    @Autowired
    private RecipeItemRepository recipeItemRepository;

    @Autowired
    private ProductRepository productRepository;


    //recipe data --->

    public RecipeResponse createRecipe(RecipeDto newRecipe){
        Recipe request = new Recipe();
        Recipe requestToSave= mapRecipeDtoToEntity(newRecipe, request);
        recipeRepository.save(requestToSave);
        return getRecipeResponse(requestToSave);
    }

    public RecipeResponse editRecipe(int id, RecipeDto recipeToEdit){
        //verify if recipe exist in db
        Recipe request = recipeRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Recipe not found id: " + id));
        Recipe requestToSave = mapRecipeDtoToEntity(recipeToEdit, request);
        recipeRepository.save(requestToSave);
        return getRecipeResponse(requestToSave);
    }

    public RecipeResponse deleteRecipe(int id){
        Recipe request = recipeRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Recipe not found id: " + id));
        recipeRepository.deleteById(id);
        return getRecipeResponse(request);
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

    //recipeItem data --->

    public void createRecipeItem(RecipeItemDto newRecipeItem){
        RecipeItem request = new RecipeItem();
        RecipeItem requestToSave= mapRecipeItemDtoToEntity(newRecipeItem, request);
        recipeItemRepository.save(requestToSave);
    }

    public void editRecipeItem(int id, RecipeItemDto recipeItemToEdit){
        //verify if recipe exist in db
        RecipeItem request = recipeItemRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Recipe item not found with id:"+ id));
        RecipeItem requestToSave = mapRecipeItemDtoToEntity(recipeItemToEdit, request);
        recipeItemRepository.save(requestToSave);
    }

    public void deleteRecipeItem(int id){
//        RecipeItem request = getRecipeItemOrElseThrow(id);
        recipeItemRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Recipe item not found with id:"+ id));
        recipeItemRepository.deleteById(id);
    }

    private RecipeItem mapRecipeItemDtoToEntity(final RecipeItemDto newRecipeItem, final RecipeItem request) {

        int productId = newRecipeItem.getProductId();
        int recipeId = newRecipeItem.getRecipeId();

        request.setProduct(productRepository.findById(productId).orElseThrow(()-> new ResourceNotFoundException("Product not found with id: "+ productId)));
        request.setWeightGrams(newRecipeItem.getWeightGrams());
        request.setRecipe(recipeRepository.findById(recipeId).orElseThrow(()-> new ResourceNotFoundException("recipe not found with id: "+ recipeId)));
        return request;
    }

    private RecipeItemDto mapToRecipeItemDto(RecipeItem item){
        RecipeItemDto dto = new RecipeItemDto();
        dto.setId(item.getId());
        dto.setRecipeId(item.getRecipe().getId());
        dto.setProductId(item.getProduct().getId());
        dto.setWeightGrams(item.getWeightGrams());
        return dto;
    }

    public List<RecipeItemDto> findByRecipeId (int id) {
        return recipeItemRepository.findByRecipeId(id)
                .stream()
                .map(this::mapToRecipeItemDto).toList();
    }
}
