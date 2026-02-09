package com.example.carts.integration.product;

import java.math.BigDecimal;

public record ProductSnapshotDTO(
    Long id,
    String productName,
    BigDecimal price,
    Double discountPercentage,
    BigDecimal finalPrice,
    Boolean isAvailable
) {}
