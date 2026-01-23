package com.azet.KitchenAssistant.controller;

import com.azet.KitchenAssistant.Entity.Recipe;
import com.azet.KitchenAssistant.dao.RecipeRepository;
import com.azet.KitchenAssistant.dto.recipe.RecipeDto;
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

    private static final Logger recipeLogger = LoggerFactory.getLogger(RecipeService.class);

    RecipeController(RecipeService recipeService, RecipeRepository recipeRepository) {
        this.recipeService = recipeService;
        this.recipeRepository = recipeRepository;
    }

    RecipeResponse recipeResponse = null;

    @RequestMapping(method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    ResponseEntity<List<Recipe>> readAllRecipes(){
        recipeLogger.info("read all recipes");
        return ResponseEntity.ok(recipeRepository.findAll());
    }

    //recipe --->

    @PostMapping(value = "/new")
    public ResponseEntity<RecipeResponse> saveRecipe(@Valid @RequestBody RecipeDto req){
        // Delegacja logiki do Serwisu
        RecipeResponse response = recipeService.createRecipe(req);
        recipeLogger.info("new recipe created: " + req.getTitle());
        //201 Created
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PutMapping(value = "/edit/recipeId/{recipeId}")
    public ResponseEntity<RecipeResponse> editRecipe(@PathVariable int recipeId, @Valid @RequestBody RecipeDto req){
        recipeLogger.info("preparing to edit id: "+ recipeId);

        if(verifyIfExist(recipeId)){
            RecipeResponse response = recipeService.editRecipe(recipeId, req);
            recipeLogger.info("edited recipe id: "+ recipeId + ", titled: "+ req.getTitle());
            //201
            return new ResponseEntity<>(response,HttpStatus.OK);
        }
        //400
        return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }

    @DeleteMapping(value = "/delete/recipeId/{recipeId}")
    public ResponseEntity<RecipeResponse> deleteRecipe(@PathVariable int recipeId){
        recipeLogger.info("preparing to delete id: "+ recipeId);
        if (verifyIfExist(recipeId)) {
            RecipeResponse response = recipeService.deleteRecipe(recipeId);
            recipeLogger.info("deleted recipe id: " + recipeId);
            //201
            return new ResponseEntity<>(response, HttpStatus.OK);
        }
        //400
        return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }

    private Boolean verifyIfExist(final int recipeId) {
        boolean result = recipeRepository.findById(recipeId).isPresent();
        if(!result){
            recipeLogger.info("recipe not exist, id: "+ recipeId);
        }
        return result;
    }

}
