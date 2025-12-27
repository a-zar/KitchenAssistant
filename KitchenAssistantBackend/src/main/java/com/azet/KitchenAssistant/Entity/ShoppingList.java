package com.azet.KitchenAssistant.Entity;

import com.azet.KitchenAssistant.dto.RecurrencePattern;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDate;
import java.util.Set;

@Entity
@Table(name="shopping_list")
@Getter
@Setter
@ToString(exclude = "shoppingListItems")
public class ShoppingList {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String title;

    @Column(name = "is_recurring")
    private Boolean isRecurring;

    @Column(name = "recurrence_pattern", columnDefinition = "VARCHAR(50)")
    @Enumerated(EnumType.STRING)
    private RecurrencePattern recurrencePattern;

    @Column(name = "next_occurrence_date")
    private LocalDate nextOccurrenceDate;

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "shoppingList")
    @JsonIgnore
    private Set<ShoppingListItem> shoppingListItems;
}
