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
        recipeLogger.info("read all recipes");
        return ResponseEntity.ok(recipeRepository.findAll());
    }

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
        recipeLogger.info("preparing recipe to edit id: "+ recipeId);

        if(verifyIfExistRecipe(recipeId)){
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
        recipeLogger.info("preparing recipe to delete recipe id: "+ recipeId);
        if (verifyIfExistRecipe(recipeId)) {
            RecipeResponse response = recipeService.deleteRecipe(recipeId);
            recipeLogger.info("deleted recipe id: " + recipeId);
            //201
            return new ResponseEntity<>(response, HttpStatus.OK);
        }
        //400
        return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }

    private Boolean verifyIfExistRecipe(final int recipeId) {
        boolean result = recipeRepository.findById(recipeId).isPresent();
        if(!result){
            recipeLogger.info("recipe not exist, id: "+ recipeId);
        }
        return result;
    }

    // recipeItem data --->
    @GetMapping(value = "/recipeId/{recipeId}/recipeItems")
    public ResponseEntity<List<RecipeItemDto>> readAllItemsForRecipe(@PathVariable int recipeId){
        recipeLogger.info("read all items for selected recipes");
        List<RecipeItem> recipeItems = recipeItemRepository.findByRecipeId(recipeId);

        List<RecipeItemDto> recipeItemDtos = recipeItems.stream().map(item ->{
            RecipeItemDto itemDto = new RecipeItemDto();
            itemDto.setId(item.getId());
            itemDto.setRecipeId(item.getRecipe().getId());
            itemDto.setProductId(item.getProduct().getId());
            itemDto.setWeightGrams(item.getWeightGrams());
            return itemDto;
        }).toList();
        return ResponseEntity.ok(recipeItemDtos);
    }

    @PostMapping(value = "/recipeItem/new")
    public ResponseEntity<HttpStatus> saveRecipeItem(@Valid @RequestBody RecipeItemDto req){
        recipeService.createRecipeItem(req);
        recipeLogger.info("added new recipe item, productId: " + req.getProductId() + " recipeId: "+ req.getRecipeId());
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @DeleteMapping(value = "/delete/recipeItemId/{recipeItemId}")
    public ResponseEntity<String>deleteRecipeItem(@PathVariable int recipeItemId){
        recipeLogger.info("preparing recipe item to delete recipeItem id: " + recipeItemId);
        if(verifyIfExistRecipeItem(recipeItemId)){
            recipeService.deleteRecipeItem(recipeItemId);
            recipeLogger.info("deleted recipe item id: " + recipeItemId);
            responseMessage= "deleted recipe item id: " + recipeItemId;
            return new ResponseEntity<>(responseMessage,HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }

    @PutMapping(value = "/edit/recipeItemId/{recipeItemId}")
    public ResponseEntity<String> editRecipeItem(@PathVariable int recipeItemId, @Valid @RequestBody RecipeItemDto req){
        recipeLogger.info("preparing recipe item to edit id: "+ recipeItemId);
        if(verifyIfExistRecipeItem(recipeItemId)){
            recipeService.editRecipeItem(recipeItemId, req);
            recipeLogger.info("edited recipe item id: "+ recipeItemId);
            responseMessage = "edited recipe item id: "+ recipeItemId + " with product id: "+req.getProductId();
            //201
            return new ResponseEntity<>(responseMessage,HttpStatus.OK);
        }
        //400
        return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }

    private Boolean verifyIfExistRecipeItem(final int recipeItemId) {
        boolean result = recipeItemRepository.findById(recipeItemId).isPresent();
        if(!result){
            recipeLogger.info("recipe item not exist, id: "+ recipeItemId);
        }
        return result;
    }
}
