package com.azet.KitchenAssistant.service;

import com.azet.KitchenAssistant.Entity.Category;
import com.azet.KitchenAssistant.Entity.Nutrient;
import com.azet.KitchenAssistant.Entity.Product;
import com.azet.KitchenAssistant.Exception.ResourceNotFoundException;
import com.azet.KitchenAssistant.dao.CategoryRepository;
import com.azet.KitchenAssistant.dao.NutrientsRepository;
import com.azet.KitchenAssistant.dao.ProductRepository;
import com.azet.KitchenAssistant.dto.productCreation.NutrientData;
import com.azet.KitchenAssistant.dto.productCreation.ProductCreationRequest;
import com.azet.KitchenAssistant.dto.productCreation.ProductCreationResponse;
import org.springframework.beans.factory.annotation.Autowired;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class ProductCreationService {

    @Autowired
    private CategoryRepository categoryRepository;
    @Autowired
    private ProductRepository productRepository;
    @Autowired
    private NutrientsRepository nutrientsRepository;

    public ProductCreationResponse createProduct(ProductCreationRequest request){
        //tworzenie głownej encji produktu
        Product newProduct = mapRequestToProductEntity(request);
        //save to DB
        return saveProductWithResponse(newProduct);
    }

    public ProductCreationResponse editProduct(int id, ProductCreationRequest request) {
        Product editedProduct = null;
        Category newCategory = getCategory(request);
        NutrientData newNutrient = request.getNutrient();

        if (productRepository.findById(id).isPresent()){
            editedProduct = productRepository.findById(id).get();

            Nutrient nutrient = editedProduct.getNutrients();

            nutrient.setEnergy(newNutrient.getEnergy());
            nutrient.setCarbohydrate(newNutrient.getCarbohydrate());
            nutrient.setSugar(newNutrient.getSugar());
            nutrient.setFat(newNutrient.getFat());
            nutrient.setSaturatedFat(newNutrient.getSaturatedFat());
            nutrient.setFiber(newNutrient.getFiber());
            nutrient.setProtein(newNutrient.getProtein());
            nutrient.setNutritionGrade(newNutrient.getNutritionGrade());

            editedProduct.setName(request.getProductName());
            editedProduct.setCodeBar(request.getCodeBar());
            editedProduct.setCategory(newCategory);
            if(request.getProductImage().isBlank()){
                editedProduct.setImage("image/placeholder.png");
            }
            else{
                editedProduct.setImage(request.getProductImage());
            }


            //ustawienie relacji nutrient dwustronnej
            editedProduct.setNutrients(nutrient);
            nutrient.setProduct(editedProduct);
        }
        return saveProductWithResponse(editedProduct);
    }

    private ProductCreationResponse saveProductWithResponse(final Product newProduct) {
        Product savedProduct = productRepository.save(newProduct);
        return mapProductEntityToResponse(savedProduct);
    }

    private ProductCreationResponse mapProductEntityToResponse(Product savedProduct){
        ProductCreationResponse response = new ProductCreationResponse();
        response.setId(savedProduct.getId());
        response.setProductName(savedProduct.getName());
        response.setCategoryName(savedProduct.getCategory().getName());
        return response;
    }

    private Product mapRequestToProductEntity(ProductCreationRequest request) {
        Nutrient nutrient = mapNutrientDataToEntity(request.getNutrient());
        Category category = getCategory(request);

        Product newProduct = new Product();
        newProduct.setName(request.getProductName());
        newProduct.setCodeBar(request.getCodeBar());
        newProduct.setCategory(category);
        if(request.getProductImage().isBlank()){
            newProduct.setImage("image/placeholder.png");
        }
        else{
            newProduct.setImage(request.getProductImage());
        }
        //ustawienie relacji nutrient dwustronnej
        newProduct.setNutrients(nutrient);
        nutrient.setProduct(newProduct);
        return newProduct;
    }

    private Category getCategory(final ProductCreationRequest request) {
        return categoryRepository.findByName(request.getCategoryName())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found: " + request.getCategoryName()));
    }

    private Nutrient mapNutrientDataToEntity(NutrientData data){
        Nutrient nutrient = new Nutrient();
        nutrient.setEnergy(data.getEnergy());
        nutrient.setCarbohydrate(data.getCarbohydrate());
        nutrient.setSugar(data.getSugar());
        nutrient.setFat(data.getFat());
        nutrient.setSaturatedFat(data.getSaturatedFat());
        nutrient.setFiber(data.getFiber());
        nutrient.setProtein(data.getProtein());
        nutrient.setNutritionGrade(data.getNutritionGrade());
        return nutrient;
    }
}
