package com.azet.KitchenAssistant.dao;

import com.azet.KitchenAssistant.Entity.Nutrient;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.Optional;

// URL: http://localhost:8080/api/nutrients
@CrossOrigin(origins = "http://localhost:4200")
@RepositoryRestResource(collectionResourceRel = "nutrients", path = "nutrients")
public interface NutrientsRepository extends JpaRepository<Nutrient,Integer> {
    Optional<Nutrient> findByProductId(Integer productId);
}
