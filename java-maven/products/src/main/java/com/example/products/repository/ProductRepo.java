package com.example.products.repository;

import com.example.products.entity.Category;
import com.example.products.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductRepo extends JpaRepository<Product, Long> {
    public List<Product> findByCategory(Category category);
}
