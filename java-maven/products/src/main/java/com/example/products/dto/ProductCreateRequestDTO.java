package com.example.products.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import com.example.products.entity.Category;


import java.math.BigDecimal;

public record ProductCreateRequestDTO(
        @Schema(example = "Gaming Laptop", description = "The full name of the product")
        @NotNull(message = "Product Name is required is required")
        String productName,

        @Schema(example = "300", description = "Exact price of the product without discountPercentage")
        @NotNull(message = "price is required")
        BigDecimal price,
        
        Category category,

        @Schema(example = "10", description = "Discount %")
        double discountPercentage,

        @Schema(example = "4th Gen, i5", description = "Basic Specifications of the product")
        String specifications,

        @Min(value = 1, message = "Minimum 1 quantity is required")
        @NotNull(message = "Available Quantity is required")
        @Schema(example = "100", description = "Available quantities for sale")
        int availableQuantity){}