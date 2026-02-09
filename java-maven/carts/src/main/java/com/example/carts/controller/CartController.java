package com.example.carts.controller;

import com.example.carts.dto.AddItemRequestDTO;
import com.example.carts.dto.CartResponseDTO;
import com.example.carts.dto.CheckoutSummaryDTO;
import com.example.carts.service.CartService;
import com.example.carts.service.CheckoutService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/carts")
public class CartController {

    private final CartService cartService;

    private final CheckoutService checkoutService;

    // Constructor DI
    public CartController(CartService cartService,  CheckoutService checkoutService) {
        this.cartService = cartService;
        this.checkoutService = checkoutService;
    }

    @GetMapping("/{userId}")
    public ResponseEntity<CheckoutSummaryDTO> getCart(@PathVariable Long userId) {
        return ResponseEntity.ok(checkoutService.buildCheckoutSummary(userId));
       // return ResponseEntity.ok(cartService.getCartByUserId(userId));
    }

    @PostMapping("/{userId}/items")
    public void addItemToCart(@PathVariable Long userId, @RequestBody AddItemRequestDTO addItemRequestDTO) {
        cartService.addToCart(userId, addItemRequestDTO);
    }

    @PatchMapping("{userId}/items/{productId}")
    public void reduceCount(@PathVariable Long userId, @PathVariable Long productId, @RequestParam(defaultValue = "1") int amount) {
        cartService.reduceFromCart(userId, productId, amount);
    }

    @DeleteMapping("/{userId}/items/{productId}")
    public void removeProduct(@PathVariable Long userId, @PathVariable Long productId) {
        cartService.removeFromCart(userId, productId);
    }

    // Checkout
    @GetMapping("/{userId}/checkout-summary")
    public ResponseEntity<CheckoutSummaryDTO> checkoutSummary(@PathVariable Long userId) {
        return ResponseEntity.ok(checkoutService.buildCheckoutSummary(userId));
    }

}
