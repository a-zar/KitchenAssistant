package com.azet.KitchenAssistant.controller;

import com.azet.KitchenAssistant.Entity.Recipe;
import com.azet.KitchenAssistant.Entity.RecipeItem;
import com.azet.KitchenAssistant.dao.RecipeItemRepository;
import com.azet.KitchenAssistant.dao.RecipeRepository;
import com.azet.KitchenAssistant.dto.recipe.RecipeDto;
import com.azet.KitchenAssistant.dto.recipe.RecipeItemDto;
import com.azet.KitchenAssistant.dto.recipe.RecipeResponse;
import com.azet.KitchenAssistant.service.RecipeService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/recipe")
class RecipeController {

    @Autowired
    private final RecipeService recipeService;

    @Autowired
    private final RecipeRepository recipeRepository;

    @Autowired
    private final RecipeItemRepository recipeItemRepository;

    private static final Logger recipeLogger = LoggerFactory.getLogger(RecipeService.class);

    RecipeController(RecipeService recipeService, RecipeRepository recipeRepository, RecipeItemRepository recipeItemRepository) {
        this.recipeService = recipeService;
        this.recipeRepository = recipeRepository;
        this.recipeItemRepository = recipeItemRepository;
    }

    RecipeResponse recipeResponse = null;
    String responseMessage ="";

    //recipe --->

    @RequestMapping(method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<Recipe>> readAllRecipes(){
        recipeLogger.info("Read all recipes");
        return ResponseEntity.ok(recipeRepository.findAll());
    }

    @PostMapping(value = "/new")
    public ResponseEntity<RecipeResponse> saveRecipe(@Valid @RequestBody RecipeDto req){
        // Delegacja logiki do Serwisu
        RecipeResponse response = recipeService.createRecipe(req);
        recipeLogger.info("New recipe created: {}", req.getTitle());
        //201 Created
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PutMapping(value = "/edit/recipeId/{recipeId}")
    public ResponseEntity<RecipeResponse> editRecipe(@PathVariable int recipeId, @Valid @RequestBody RecipeDto req){
        recipeLogger.info("Attempting to edit recipe id: {}", recipeId);
            RecipeResponse response = recipeService.editRecipe(recipeId, req);
            recipeLogger.info("Edited recipe id: "+ recipeId + ", titled: "+ req.getTitle());
            //201
            return new ResponseEntity<>(response,HttpStatus.OK);
    }

    @DeleteMapping(value = "/delete/recipeId/{recipeId}")
    public ResponseEntity<Void> deleteRecipe(@PathVariable int recipeId) {
        recipeLogger.info("Attempting to delete recipe id: {}", recipeId);
        RecipeResponse response = recipeService.deleteRecipe(recipeId);
        recipeLogger.info("Deleted recipe id: {}", recipeId);
        //201
        return ResponseEntity.noContent().build();
    }

    // recipeItem data --->
    @GetMapping(value = "/recipeId/{recipeId}/recipeItems")
    public ResponseEntity<List<RecipeItemDto>> readAllItemsForRecipe(@PathVariable int recipeId){
        recipeLogger.info("Read all items for selected recipes");
        List<RecipeItemDto> recipeItemsDtos = recipeService.findByRecipeId(recipeId);
        return ResponseEntity.ok(recipeItemsDtos);
    }

    @PostMapping(value = "/recipeItem/new")
    public ResponseEntity<HttpStatus> saveRecipeItem(@Valid @RequestBody RecipeItemDto req){
        recipeService.createRecipeItem(req);
        recipeLogger.info("Added new recipe item id: {} with productId: {}, recipeId: {}", req.getId(), req.getProductId(), req.getRecipeId());
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @DeleteMapping(value = "/delete/recipeItemId/{recipeItemId}")
    public ResponseEntity<Void>deleteRecipeItem(@PathVariable int recipeItemId){
        recipeLogger.info("Attempting to delete recipeItem id: {}", recipeItemId);
            recipeService.deleteRecipeItem(recipeItemId);
            recipeLogger.info("Deleted recipe item id: {}", recipeItemId);
            return ResponseEntity.noContent().build(); //code 204
    }

    @PutMapping(value = "/edit/recipeItemId/{recipeItemId}")
    public ResponseEntity<String> editRecipeItem(@PathVariable int recipeItemId, @Valid @RequestBody RecipeItemDto req){
        recipeLogger.info("Attempting recipe item to edit id: "+ recipeItemId);
            recipeService.editRecipeItem(recipeItemId, req);
            recipeLogger.info("Edited recipe item id: {}", recipeItemId);
            responseMessage = "Edited recipe item id: "+ recipeItemId + " with product id: "+req.getProductId();
            //201
            return new ResponseEntity<>(responseMessage,HttpStatus.OK);
    }
}
