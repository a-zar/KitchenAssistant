package com.azet.KitchenAssistant.service;

import com.azet.KitchenAssistant.Entity.Category;
import com.azet.KitchenAssistant.Entity.Nutrient;
import com.azet.KitchenAssistant.Entity.Product;
import com.azet.KitchenAssistant.dao.CategoryRepository;
import com.azet.KitchenAssistant.dao.ProductRepository;
import com.azet.KitchenAssistant.dto.NutrientData;
import com.azet.KitchenAssistant.dto.ProductCreationRequest;
import com.azet.KitchenAssistant.dto.ProductCreationResponse;
import lombok.ToString;
import org.springframework.beans.factory.annotation.Autowired;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class ProductCreationService {

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private ProductRepository productRepository;

    public ProductCreationResponse createProduct(ProductCreationRequest request){

        Category category = categoryRepository.findByName(request.getCategoryName())
                .orElseThrow(() -> new EntityNotFoundException("Kategoria nie znaleziona: " + request.getCategoryName()));

        //tworzenie głownej encji produktu
        Product newProduct = mapRequestToProductEntity(request, category);

        //save to DB
        Product savedProduct = productRepository.save(newProduct);

        System.out.println("savedProduct: " +
                savedProduct + " " + savedProduct.getCategory() + " " + savedProduct.getNutrients() );

        return mapProductEntityToResponse(savedProduct );
    }

    private ProductCreationResponse mapProductEntityToResponse(Product savedProduct){
        ProductCreationResponse response = new ProductCreationResponse();

        response.setId(savedProduct.getId());
        response.setProductName(savedProduct.getName());
        response.setCategoryName(savedProduct.getCategory().getName());

        return response;
    }

    private Product mapRequestToProductEntity(ProductCreationRequest request, Category category) {
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

        Nutrient newNutrient = mapNutrientDataToEntity(request.getNutrient());

        //ustawienie relacji nutrient dwustronnej
        newProduct.setNutrients(newNutrient);
        newNutrient.setProduct(newProduct);

        return newProduct;
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
