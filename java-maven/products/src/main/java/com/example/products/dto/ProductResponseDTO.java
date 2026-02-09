package com.example.products.dto;

import com.example.products.entity.Category;
import io.swagger.v3.oas.annotations.media.Schema;

import java.math.BigDecimal;

@Schema(description = "Product response data")
public record ProductResponseDTO(
                @Schema(description = "Unique product identifier", example = "1") Long id,

                @Schema(description = "Product name", example = "Gaming Laptop") String productName,

                @Schema(description = "Original price before discount", example = "1299.99") BigDecimal price,

                @Schema(description = "Discount percentage applied", example = "15.0") Double discountPercentage,

                @Schema(description = "Product specifications", example = "Intel i7, 16GB RAM, RTX 4060") String specifications,

                @Schema(description = "Whether the product is in stock", example = "true") Boolean isAvailable,

                @Schema(description = "Product category", example = "ELECTRONICS") Category category,

                @Schema(description = "Final price after discount", example = "1104.49") BigDecimal finalPrice) {
}
