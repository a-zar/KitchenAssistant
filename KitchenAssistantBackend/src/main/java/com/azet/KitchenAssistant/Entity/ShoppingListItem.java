package com.azet.KitchenAssistant.Entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(name="shopping_list_item")
@Getter
@Setter
@ToString
public class ShoppingListItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private int quantity;
    private Boolean isPurchased;
    private String note;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name= "product_id")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Product product;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name= "list_id")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private ShoppingList shoppingList;
}
