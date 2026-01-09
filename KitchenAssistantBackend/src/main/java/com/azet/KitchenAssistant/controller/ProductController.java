//package com.azet.KitchenAssistant.controller;
//
//import com.azet.KitchenAssistant.Entity.Nutrient;
//import com.azet.KitchenAssistant.Entity.Product;
//import com.azet.KitchenAssistant.dao.NutrientsRepository;
//import com.azet.KitchenAssistant.dao.ProductRepository;
//import jakarta.validation.Valid;
//import org.slf4j.Logger;
//import org.slf4j.LoggerFactory;
//import org.springframework.data.domain.Pageable;
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
////@RequestMapping(value = "/products")
//class ProductController {
//
//    private static final Logger logger = LoggerFactory.getLogger(ProductController.class);
//    private final ProductRepository productRepository;
//    private final NutrientsRepository nutrientsRepository;
//
//    ProductController(final ProductRepository productRepository, NutrientsRepository nutrientsRepository) {
//        this.productRepository = productRepository;
//        this.nutrientsRepository = nutrientsRepository;
//    }
//
//    @RequestMapping(method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
//    ResponseEntity<List<Product>> readAllProducts(Pageable page){
//
//        logger.info("custom pageable for all products");
//        return ResponseEntity.ok(productRepository.findAll(page).getContent());
//        //http://localhost:8080/api/products?page=0&size=10
//    }
//
//    @RequestMapping(method = RequestMethod.GET, params="categoryId" ,produces = MediaType.APPLICATION_JSON_VALUE)
//    ResponseEntity<List<Product>> readProductsByCategory(@RequestParam("categoryId") Long id, Pageable page){
//
//        logger.info("custom pageable for products in selected category");
//
//
//        return ResponseEntity.ok(productRepository.findByCategoryId(id, page).getContent());
//        //http://localhost:8080/api/products?categoryId=5&page=0&size=10
//    }
//
//    @RequestMapping(method = RequestMethod.GET, params = "search", produces = MediaType.APPLICATION_JSON_VALUE)
//    ResponseEntity<List<Product>> readProductsByName(@RequestParam("search") String textToSearch, Pageable page){
//
//        logger.info("searching by name of product");
//
//        return ResponseEntity.ok(productRepository.findByNameContaining(textToSearch, page).getContent());
//        //http://localhost:8080/api/products?search=ml&page=0&size=10
//    }
//
//    @RequestMapping(method = RequestMethod.GET, value="/{id}")
//    ResponseEntity<Product> readOneProduct(@PathVariable int id){
//        logger.info("searching by product id");
//
//        Optional<Product> opt = productRepository.findById(id);
//
//        return opt.map(product -> ResponseEntity.ok(product)).orElse(ResponseEntity.notFound().build());
//    }
//
//    @RequestMapping(method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
//    ResponseEntity<Product> addNewProduct(@RequestBody @Valid Product newProduct){
//
//        Product result =productRepository.save(newProduct);
//        Nutrient nutrients = newProduct.getNutrients();
//        nutrients.setProduct(result);
//
//        nutrientsRepository.save(nutrients);
//
//        logger.info("saved new Product");
//        return ResponseEntity.created(URI.create("/" + result.getId())).body(newProduct);
//    }
//
//    @RequestMapping(method = RequestMethod.PUT, value="/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
//    ResponseEntity<?>editProduct(@PathVariable int id, @RequestBody @Valid Product productToEdit){
//
//        logger.info("updated product id: " + id);
//
//        if(!productRepository.existsById(id)){
//            return ResponseEntity.notFound().build();
//        }
//
//        productToEdit.setId(id);
//        Product result =productRepository.save(productToEdit);
//
//        return ResponseEntity.noContent().build();
//    }
//
//}
