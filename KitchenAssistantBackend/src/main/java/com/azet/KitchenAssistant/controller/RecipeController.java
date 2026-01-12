package com.azet.KitchenAssistant.controller;

import com.azet.KitchenAssistant.Entity.Recipe;
import com.azet.KitchenAssistant.Entity.ShoppingList;
import com.azet.KitchenAssistant.Entity.ShoppingListItem;
import com.azet.KitchenAssistant.dao.RecipeRepository;
import com.azet.KitchenAssistant.dto.recipe.RecipeDto;
import com.azet.KitchenAssistant.dto.recipe.RecipeResponse;
import com.azet.KitchenAssistant.dto.shoppingList.ShoppingListDto;
import com.azet.KitchenAssistant.dto.shoppingList.ShoppingListResponse;
import com.azet.KitchenAssistant.service.RecipeService;
import com.azet.KitchenAssistant.service.ShoppingListService;
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

    private static final Logger recipeLogger = LoggerFactory.getLogger(RecipeService.class);

    RecipeController(RecipeService recipeService, RecipeRepository recipeRepository) {
        this.recipeService = recipeService;
        this.recipeRepository = recipeRepository;
    }

    RecipeResponse recipeResponse = null;

    @RequestMapping(method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    ResponseEntity<List<Recipe>> readAllRecipes(){
        recipeLogger.info("all recipes");
        return ResponseEntity.ok(recipeRepository.findAll());
    }

    @PostMapping(value = "/new")
    public ResponseEntity<RecipeResponse> saveRecipe(@Valid @RequestBody RecipeDto req){

        // Delegacja logiki do Serwisu
        RecipeResponse response = recipeService.createRecipe(req);
        recipeLogger.info("new shopping list created: " + req.getTitle());

        //201 Created
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }


}
