package com.example.carts.dto;

import java.math.BigDecimal;

public record CheckoutItemDTO(
        Long productId,
        String productName,
        Integer quantity,
        BigDecimal unitPrice,
        BigDecimal lineTotal,
        Boolean available
) {}
