package com.example.carts.dto;

public record RemoveItemRequestDTO(
        Long cartId,
        Long productId,
        Integer quantity
){}