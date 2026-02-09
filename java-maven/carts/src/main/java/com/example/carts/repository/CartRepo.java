package com.example.carts.repository;

import com.example.carts.entity.Cart;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CartRepo extends JpaRepository<Cart, Long> {
    public Optional<Cart> findByUserId(Long userId);
}
