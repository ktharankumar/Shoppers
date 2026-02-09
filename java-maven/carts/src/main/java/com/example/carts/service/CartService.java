package com.example.carts.service;

import com.example.carts.dto.*;

import com.example.carts.entity.Cart;
import com.example.carts.mapper.CartMapper;
import com.example.carts.repository.CartRepo;
import com.example.carts.entity.CartItems;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class CartService {

    private final CartRepo cartRepo;

    private final CartMapper cartMapper;

    public CartService(CartRepo cartRepo, CartMapper cartMapper) {
        this.cartRepo = cartRepo;
        this.cartMapper = cartMapper;
    }

    public CartResponseDTO getCartByUserId(Long userId) {
        Cart cart = cartRepo.findByUserId(userId).orElseThrow(() ->
                new RuntimeException("user not found"));
        return cartMapper.toCartResponseDTO(cart);
    }

    public void addToCart(Long userId, AddItemRequestDTO request) {
        Long productId = request.productId();
        Cart cart = getCartOrCreateNewCart(userId);

        Optional<CartItems> existingItemOpt = getOptCartItem(cart, productId);

        int quantity = request.quantity();
        existingItemOpt.ifPresentOrElse(cartItems -> cartItems.increaseQuantity(quantity),
                () -> {addProductToCartItem(cart, productId, quantity);});
        cartMapper.toCartResponseDTO(cartRepo.save(cart));
    }

    public void removeFromCart(Long userId,Long productId) {
        Cart cart = getCartOrThrow(userId);

        Optional<CartItems> targetCartItemsOpt = getOptCartItem(cart, productId);

        targetCartItemsOpt.ifPresent(cart::removeCartItem);
        cartMapper.toCartResponseDTO(cartRepo.save(cart));
    }

    public void reduceFromCart(Long userId, Long productId, Integer amount) {
        Cart cart = getCartOrThrow(userId);

        Optional<CartItems> targetCartItemsOpt = getOptCartItem(cart, productId);

        targetCartItemsOpt.ifPresent(cartItems -> {
            cartItems.decreaseQuantity(amount);
            if(cartItems.getQuantity() <= 0) {
                cart.removeCartItem(cartItems);
            }
        });

        cartMapper.toCartResponseDTO(cartRepo.save(cart));
    }

    // Helper functions

    private Cart getCartOrThrow(Long userId){
        return cartRepo.findByUserId(userId).
                orElseThrow(() -> new RuntimeException("carts not found"));
    }

    private Cart getCartOrCreateNewCart(Long userId){
        return cartRepo.findByUserId(userId)
                .orElseGet(() -> {
                    Cart newCart = new Cart();
                    newCart.setUserId(userId);
                    return cartRepo.save(newCart);
                });
    }

    private Optional<CartItems> getOptCartItem(Cart cart, Long productId) {
        return cart.getCartItems()
                .stream().
                filter(item -> item.
                        getProductId().
                        equals(productId)).
                findFirst();
    }

    private void addProductToCartItem(Cart cart, Long productId, Integer quantity) {
        CartItems newItem = new CartItems(productId, quantity);
        cart.addCartItem(newItem);
    }

}
