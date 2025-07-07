package com.productcatalog.controller;

import com.productcatalog.dto.BrandSummaryDto;
import com.productcatalog.entity.Product;
import com.productcatalog.service.ProductService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/products")
@CrossOrigin(origins = "http://localhost:3000") // Allow React frontend
public class ProductController {

    private final ProductService productService;

    @Autowired
    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    /**
     * GET /products - List all products
     */
    @GetMapping
    public ResponseEntity<List<Product>> getAllProducts() {
        List<Product> products = productService.getAllProducts();
        return ResponseEntity.ok(products);
    }

    /**
     * GET /products/{productKey} - Get full product details
     */
    @GetMapping("/{productKey}")
    public ResponseEntity<Product> getProductById(@PathVariable Long productKey) {
        Optional<Product> product = productService.getProductById(productKey);
        return product.map(ResponseEntity::ok)
                     .orElse(ResponseEntity.notFound().build());
    }

    /**
     * POST /products - Add a new product
     */
    @PostMapping
    public ResponseEntity<Product> createProduct(@Valid @RequestBody Product product) {
        try {
            Product createdProduct = productService.createProduct(product);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdProduct);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * PUT /products - Update a product
     */
    @PutMapping
    public ResponseEntity<Product> updateProduct(@Valid @RequestBody Product product) {
        try {
            Product updatedProduct = productService.updateProduct(product);
            return ResponseEntity.ok(updatedProduct);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * DELETE /products/{productKey} - Remove a product
     */
    @DeleteMapping("/{productKey}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long productKey) {
        try {
            productService.deleteProduct(productKey);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * GET /products/brand-summary - Returns a summary count of products grouped by brand
     */
    @GetMapping("/brand-summary")
    public ResponseEntity<List<BrandSummaryDto>> getBrandSummary() {
        List<BrandSummaryDto> brandSummary = productService.getBrandSummary();
        return ResponseEntity.ok(brandSummary);
    }

    /**
     * GET /products/search?name={name} - Search products by name
     */
    @GetMapping("/search")
    public ResponseEntity<List<Product>> searchProducts(@RequestParam(required = false) String name,
                                                       @RequestParam(required = false) String brand) {
        List<Product> products;
        
        if (name != null && !name.trim().isEmpty()) {
            products = productService.searchProductsByName(name);
        } else if (brand != null && !brand.trim().isEmpty()) {
            products = productService.getProductsByBrand(brand);
        } else {
            products = productService.getAllProducts();
        }
        
        return ResponseEntity.ok(products);
    }

    /**
     * GET /products/count - Get total product count
     */
    @GetMapping("/count")
    public ResponseEntity<Long> getProductCount() {
        long count = productService.getTotalProductCount();
        return ResponseEntity.ok(count);
    }
}