package com.productcatalog.service;

import com.productcatalog.dto.BrandSummaryDto;
import com.productcatalog.entity.Product;
import com.productcatalog.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ProductService {

    private final ProductRepository productRepository;

    @Autowired
    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    /**
     * Get all products
     */
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    /**
     * Get product by ID
     */
    public Optional<Product> getProductById(Long productKey) {
        return productRepository.findById(productKey);
    }

    /**
     * Create a new product
     */
    public Product createProduct(Product product) {
        return productRepository.save(product);
    }

    /**
     * Update an existing product
     */
    public Product updateProduct(Product product) {
        if (!productRepository.existsById(product.getProductKey())) {
            throw new RuntimeException("Product not found with id: " + product.getProductKey());
        }
        return productRepository.save(product);
    }

    /**
     * Delete a product by ID
     */
    public void deleteProduct(Long productKey) {
        if (!productRepository.existsById(productKey)) {
            throw new RuntimeException("Product not found with id: " + productKey);
        }
        productRepository.deleteById(productKey);
    }

    /**
     * Search products by brand
     */
    public List<Product> getProductsByBrand(String brand) {
        return productRepository.findByBrandIgnoreCase(brand);
    }

    /**
     * Search products by product name
     */
    public List<Product> searchProductsByName(String productName) {
        return productRepository.findByProductNameContainingIgnoreCase(productName);
    }

    /**
     * Get brand summary with product count grouped by brand
     */
    public List<BrandSummaryDto> getBrandSummary() {
        List<Object[]> results = productRepository.getBrandSummary();
        return results.stream()
                .map(result -> new BrandSummaryDto(
                        (String) result[0],
                        ((Number) result[1]).longValue()
                ))
                .collect(Collectors.toList());
    }

    /**
     * Check if product exists
     */
    public boolean productExists(Long productKey) {
        return productRepository.existsById(productKey);
    }

    /**
     * Get total product count
     */
    public long getTotalProductCount() {
        return productRepository.count();
    }
}