package com.example.carts.dto;

import java.math.BigDecimal;
import java.util.List;

public record CheckoutSummaryDTO(
        Long userId,
        Long cartId,
        BigDecimal cartTotal,
        List<CheckoutItemDTO> items,
        Boolean allAvailable
) {
    @Override
    public Boolean allAvailable() {
        return true;
    }
}
