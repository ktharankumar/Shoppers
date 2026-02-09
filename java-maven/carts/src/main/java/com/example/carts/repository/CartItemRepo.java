package com.example.carts.repository;

import com.example.carts.entity.CartItems;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CartItemRepo extends JpaRepository<CartItems, Long> {

}
