package com.azet.KitchenAssistant.dao;

import com.azet.KitchenAssistant.Entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.data.rest.core.annotation.RestResource;
import org.springframework.lang.NonNullApi;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;
import java.util.Optional;

// URL: http://localhost:8080/api/products
@CrossOrigin(origins = "http://localhost:4200")
@RepositoryRestResource(collectionResourceRel = "products", path = "products")
public interface ProductRepository extends JpaRepository<Product, Integer> {

    // URL: http://localhost:8080/api/products/search/by-category?id=1
    @RestResource(path = "by-category")
    Page<Product> findByCategoryId(@Param("id") Long id, Pageable page);

    // URL: http://localhost:8080/api/products/search/by-name?search=mleko
    @RestResource(path = "by-name")
    Page<Product> findByNameContainingIgnoreCase(@Param("search") String text, Pageable pageable);


}
