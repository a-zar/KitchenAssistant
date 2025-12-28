package com.azet.KitchenAssistant.dto.shoppingList;

import com.fasterxml.jackson.annotation.JsonCreator;

public enum RecurrencePattern {
    DAILY,
    WEEKLY,
    MONTHLY,
    YEARLY;

    /**
     *
     * @param value w jason mogą być napisane małymi literami
     * @return zawsze duze litery tak jak w enumie
     */
    @JsonCreator
    public static RecurrencePattern fromString(String value) {
        return value == null ? null : RecurrencePattern.valueOf(value.toUpperCase());
    }
}


