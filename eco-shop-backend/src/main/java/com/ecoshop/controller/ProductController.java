package com.ecoshop.controller;

import com.ecoshop.dto.ProductRequest;
import com.ecoshop.model.Product;
import com.ecoshop.model.User;
import com.ecoshop.repository.UserRepository;
import com.ecoshop.service.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;
    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<List<Product>> getAllProducts(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Boolean ecoFriendly,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) Long sellerId) {

        List<Product> products;
        if (sellerId != null) {
            products = productService.getSellerProducts(sellerId);
        } else if (search != null && !search.isBlank()) {
            products = productService.searchProducts(search);
        } else if (Boolean.TRUE.equals(ecoFriendly)) {
            products = productService.getEcoFriendlyProducts();
        } else if (category != null && !category.isBlank()) {
            products = productService.getProductsByCategory(category);
        } else {
            products = productService.getAllProducts();
        }
        return ResponseEntity.ok(products);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        return ResponseEntity.ok(productService.getProductById(id));
    }

    @GetMapping("/{id}/alternatives")
    public ResponseEntity<List<Product>> getAlternatives(@PathVariable Long id) {
        return ResponseEntity.ok(productService.getGreenerAlternatives(id));
    }

    @PostMapping
    public ResponseEntity<Product> createProduct(
            @Valid @RequestBody ProductRequest request,
            Authentication authentication) {
        User user = userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(productService.createProduct(request, user.getId()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Product> updateProduct(
            @PathVariable Long id,
            @Valid @RequestBody ProductRequest request,
            Authentication authentication) {
        User user = userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(productService.updateProduct(id, request, user.getId(), user.getRole().name()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(
            @PathVariable Long id,
            Authentication authentication) {
        User user = userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        productService.deleteProduct(id, user.getId(), user.getRole().name());
        return ResponseEntity.noContent().build();
    }
}
