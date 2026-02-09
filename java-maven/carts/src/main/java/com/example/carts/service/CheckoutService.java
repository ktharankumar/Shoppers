package com.example.carts.service;

import com.example.carts.dto.CheckoutItemDTO;
import com.example.carts.dto.CheckoutSummaryDTO;
import com.example.carts.entity.Cart;
import com.example.carts.entity.CartItems;
import com.example.carts.repository.CartRepo;
import com.example.carts.integration.product.ProductClient;
import com.example.carts.integration.product.ProductSnapshotDTO;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class CheckoutService {

    private final CartRepo cartRepo;

    private final ProductClient productClient;

    public CheckoutService(CartRepo cartRepo, ProductClient productClient) {
        this.cartRepo = cartRepo;
        this.productClient = productClient;
    }

    @Transactional(readOnly = true)
    public CheckoutSummaryDTO buildCheckoutSummary(Long userId) {
        Cart cart = cartRepo.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        List<CartItems> cartItems = cart.getCartItems();
        List<Long> productIds = cartItems.stream()
                .map(CartItems::getProductId)
                .distinct()
                .toList();

        List<ProductSnapshotDTO> products = productClient.getProductsBatch(productIds);
        Map<Long, ProductSnapshotDTO> byId = products.stream()
                .collect(Collectors.toMap(ProductSnapshotDTO::id, p -> p));

        BigDecimal total = BigDecimal.ZERO;
        boolean allAvailable = true;

        List<CheckoutItemDTO> items = new ArrayList<>();

        for (CartItems ci : cartItems) {
            ProductSnapshotDTO p = byId.get(ci.getProductId());

            if (p == null) {
                allAvailable = false;
                items.add(new CheckoutItemDTO(ci.getProductId(), "UNKNOWN",
                        ci.getQuantity(), BigDecimal.ZERO, BigDecimal.ZERO, false));
                continue;
            }

            boolean available = Boolean.TRUE.equals(p.isAvailable());
            allAvailable = allAvailable && available;

            BigDecimal unit = (p.finalPrice() != null ? p.finalPrice() : p.price());
            BigDecimal line = unit.multiply(BigDecimal.valueOf(ci.getQuantity()));
            total = total.add(line);

            items.add(new CheckoutItemDTO(
                    ci.getProductId(),
                    p.productName(),
                    ci.getQuantity(),
                    unit,
                    line,
                    available
            ));
        }

        return new CheckoutSummaryDTO(cart.getUserId(), cart.getId(), total, items, allAvailable);
    }
}
