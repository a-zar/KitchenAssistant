//package com.azet.KitchenAssistant.controller;
//
//import com.azet.KitchenAssistant.Entity.Category;
//import com.azet.KitchenAssistant.dao.CategoryRepository;
//import jakarta.validation.Valid;
//import org.slf4j.Logger;
//import org.slf4j.LoggerFactory;
//import org.springframework.http.MediaType;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//
//import java.net.URI;
//import java.util.List;
//import java.util.Optional;
//
////@CrossOrigin(origins = "http://localhost:4200")
////@RestController
////@RequestMapping(value = "/api/categories")
//class CategoryController {
//
//    Logger logger = LoggerFactory.getLogger(CategoryController.class);
//    CategoryRepository categoryRepository;
//
//    CategoryController(final CategoryRepository categoryRepository) {
//        this.categoryRepository = categoryRepository;
//    }
//
//    @RequestMapping(method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
//    ResponseEntity<List<Category>> readCategories(){
//        logger.info("all categories on one page");
//        return ResponseEntity.ok(categoryRepository.findAll());
//    }
//
//    @RequestMapping(method = RequestMethod.GET, value = "/{id}",produces = MediaType.APPLICATION_JSON_VALUE)
//    ResponseEntity<Category> readOneCategory(@PathVariable int id){
//        logger.info("selected category is presented");
//        Optional<Category> opt = categoryRepository.findById(id);
//
//        return opt.map(category -> ResponseEntity.ok(category)).orElse(ResponseEntity.notFound().build());
//    }
//
//    @RequestMapping(method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
//    ResponseEntity<Category> addNewCategory(@RequestBody @Valid Category newCategory){
//
//        Category result = categoryRepository.save(newCategory);
//        logger.info("saved new category");
//
//        return ResponseEntity.created(URI.create("/"+result.getId())).body(newCategory);
//    }
//
//    @RequestMapping(method = RequestMethod.PUT, value="/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
//    ResponseEntity<?> editCategory(@PathVariable int id ,@RequestBody @Valid Category categoryToEdit){
//        logger.info("updated category id: " + id);
//
//        if(!categoryRepository.existsById(id)){
//            return ResponseEntity.notFound().build();
//        }
//
//        categoryToEdit.setId(id);
//        categoryRepository.save(categoryToEdit);
//
//        return ResponseEntity.noContent().build();
//    }
//
//    //todo searching by name
//    //todo delete category
//}
