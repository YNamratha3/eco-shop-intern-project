package com.ecoshop.service;

import com.ecoshop.dto.ProductRequest;
import com.ecoshop.model.Product;
import com.ecoshop.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public Product getProductById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
    }

    public List<Product> searchProducts(String query) {
        return productRepository.search(query);
    }

    public List<Product> getEcoFriendlyProducts() {
        return productRepository.findByIsEcoFriendlyTrue();
    }

    public List<Product> getProductsByCategory(String category) {
        return productRepository.findByCategory(category);
    }

    public List<Product> getGreenerAlternatives(Long productId) {
        Product product = getProductById(productId);
        List<Product> alternatives = productRepository.findGreenerAlternatives(
                product.getCategory(), productId, product.getCarbonFootprintKg());
        // Return top 4 alternatives
        return alternatives.stream().limit(4).toList();
    }

    public Product createProduct(ProductRequest request, Long sellerId) {
        Product product = Product.builder()
                .name(request.getName())
                .description(request.getDescription())
                .price(request.getPrice())
                .imageUrl(request.getImageUrl())
                .category(request.getCategory())
                .ecoRating(request.getEcoRating())
                .carbonFootprintKg(request.getCarbonFootprintKg())
                .isEcoFriendly(request.getIsEcoFriendly() != null ? request.getIsEcoFriendly() : request.getEcoRating() >= 4)
                .sellerId(sellerId)
                .stock(request.getStock())
                .build();
        return productRepository.save(product);
    }

    public Product updateProduct(Long id, ProductRequest request, Long sellerId, String role) {
        Product product = getProductById(id);
        if (!"ADMIN".equals(role) && !product.getSellerId().equals(sellerId)) {
            throw new AccessDeniedException("You can only update your own products");
        }
        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setImageUrl(request.getImageUrl());
        product.setCategory(request.getCategory());
        product.setEcoRating(request.getEcoRating());
        product.setCarbonFootprintKg(request.getCarbonFootprintKg());
        product.setIsEcoFriendly(request.getIsEcoFriendly() != null ? request.getIsEcoFriendly() : request.getEcoRating() >= 4);
        product.setStock(request.getStock());
        return productRepository.save(product);
    }

    public void deleteProduct(Long id, Long sellerId, String role) {
        Product product = getProductById(id);
        if (!"ADMIN".equals(role) && !product.getSellerId().equals(sellerId)) {
            throw new AccessDeniedException("You can only delete your own products");
        }
        productRepository.deleteById(id);
    }

    public List<Product> getSellerProducts(Long sellerId) {
        return productRepository.findBySellerId(sellerId);
    }
}
