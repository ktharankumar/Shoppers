package com.example.carts.mapper;

import com.example.carts.dto.CartItemResponseDTO;
import com.example.carts.dto.CartResponseDTO;
import com.example.carts.entity.Cart;
import com.example.carts.entity.CartItems;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface CartMapper{
    @Mapping(source="cartItems", target= "items")
    CartResponseDTO toCartResponseDTO(Cart cart);

    CartItemResponseDTO toCartItemDTO(CartItems cartItems);
}
