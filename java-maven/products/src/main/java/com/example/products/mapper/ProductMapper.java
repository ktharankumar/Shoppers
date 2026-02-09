package com.example.products.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.example.products.dto.ProductCreateRequestDTO;
import com.example.products.dto.ProductResponseDTO;
import com.example.products.entity.Product;

import jakarta.validation.constraints.NotNull;


@Mapper(componentModel = "spring")
public interface ProductMapper {
    ProductResponseDTO toProductResponseDTO(Product product);

    @NotNull
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "finalPrice", ignore = true)
    @Mapping(target = "isAvailable", ignore = true)
    Product toProduct(ProductCreateRequestDTO productCreateRequestDTO);
}
