//package com.azet.KitchenAssistant.controller;
//
//import com.azet.KitchenAssistant.Entity.Nutrient;
//import com.azet.KitchenAssistant.Entity.Product;
//import com.azet.KitchenAssistant.dao.NutrientsRepository;
//import jakarta.validation.Valid;
//import org.slf4j.Logger;
//import org.slf4j.LoggerFactory;
//import org.springframework.data.domain.Pageable;
//import org.springframework.http.MediaType;
//import org.springframework.http.ResponseEntity;
//import org.springframework.stereotype.Controller;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.List;
//import java.util.Optional;
//
////@CrossOrigin(origins = "http://localhost:4200")
////@Controller
////@RequestMapping(value = "/api/nutrients")
//class NutrientsController {
//
//    private static final Logger logger = LoggerFactory.getLogger(ProductController.class);
//    public final NutrientsRepository nutrientsRepository;
//
//    NutrientsController(final NutrientsRepository nutrientsRepository) {
//        this.nutrientsRepository = nutrientsRepository;
//    }
//
//    @RequestMapping(method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
//    ResponseEntity<List<Nutrient>> readAllNutrients(Pageable page){
//
//        logger.info("custom pageable for all nutrients");
//        return ResponseEntity.ok(nutrientsRepository.findAll(page).getContent());
//        //http://localhost:8080/nutrients?page=0&size=10
//    }
//
//    @RequestMapping(method = RequestMethod.GET, params="productId", produces = MediaType.APPLICATION_JSON_VALUE)
//    ResponseEntity<Nutrient> readNutrientsForProduct(@RequestParam("productId") int productId){
//        logger.info("read nutrients for product");
//
//        Optional<Nutrient> opt = nutrientsRepository.findByProduct_Id(productId);
//
//        return opt.map(nutrients -> ResponseEntity.ok(nutrients)).orElse(ResponseEntity.notFound().build());
//    }
//
//    @RequestMapping(method = RequestMethod.PUT, value="/{id}",params = "productId", produces = MediaType.APPLICATION_JSON_VALUE)
//    ResponseEntity<?>editNutrients(@PathVariable int id, @RequestParam("productId") int productId, @RequestBody @Valid Nutrient nutrientsToEdit){
//
//        logger.info("updated nutrients");
//
//        if(!nutrientsRepository.existsById(id)){
//            return ResponseEntity.notFound().build();
//        }
//
//        Optional<Nutrient> opt = nutrientsRepository.findByProduct_Id(productId);
//        Product product = opt.map(res -> res.getProduct()).orElseThrow();
//
//
//        nutrientsToEdit.setId(id);
//        nutrientsToEdit.setProduct(product);
//        nutrientsRepository.save(nutrientsToEdit);
//
//        return ResponseEntity.noContent().build();
//    }
//}
