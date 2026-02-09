package com.example.products.service;

import com.example.products.dto.ProductCreateRequestDTO;
import com.example.products.dto.ProductResponseDTO;
import com.example.products.entity.Category;
import com.example.products.mapper.ProductMapper;
import jakarta.persistence.EntityNotFoundException;
import com.example.products.entity.Product;
import com.example.products.repository.ProductRepo;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ProductService {

    private final ProductRepo productRepo;

    private final ProductMapper productMapper;

    public ProductService(ProductRepo productRepo, ProductMapper productMapper) {
        this.productRepo = productRepo;
        this.productMapper = productMapper;
    }

    public List<ProductResponseDTO> getAllProducts(Category category) {
        List<Product> products = category != null? productRepo.findByCategory(category) : productRepo.findAll();

        return products.stream()
                .map(this::mapToResponseDTO)
                .toList();
    }

    public ProductResponseDTO getProductById(Long id) {
        Product product = productRepo.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Product not found with id: " + id));
        return mapToResponseDTO(product);
    }

    @Transactional // Ensures the database save is atomic
    public ProductResponseDTO createProduct(ProductCreateRequestDTO requestDTO) {
        Product product = productMapper.toProduct(requestDTO);
        Product savedProduct = productRepo.save(product);
        return mapToResponseDTO(savedProduct);
    }

    @Transactional
    public ProductResponseDTO updateProduct(Long id, ProductCreateRequestDTO requestDTO) {
        Product existingProduct = productRepo.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Product not found with id: " + id));

        // Update fields
        existingProduct.setProductName(requestDTO.productName());
        existingProduct.setPrice(requestDTO.price());
        existingProduct.setDiscountPercentage(requestDTO.discountPercentage());
        existingProduct.setCategory(requestDTO.category());
        existingProduct.setAvailableQuantity(requestDTO.availableQuantity());

        Product updatedProduct = productRepo.save(existingProduct);
        return mapToResponseDTO(updatedProduct);
    }

    public void deleteProduct(Long id) {
        if (!productRepo.existsById(id)) {
            throw new EntityNotFoundException("Cannot delete. Product not found with id: " + id);
        }
        productRepo.deleteById(id);
    }

    private ProductResponseDTO mapToResponseDTO(Product product) {
        product.calculate_final_price();
        return productMapper.toProductResponseDTO(product);
    }

    // product-service
    @Transactional(readOnly = true)
    public List<ProductResponseDTO> getProductsByIds(List<Long> ids) {
        return productRepo.findAllById(ids)
                .stream()
                .map(productMapper::toProductResponseDTO)
                .toList();
    }

}