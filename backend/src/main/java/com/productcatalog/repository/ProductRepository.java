package com.productcatalog.repository;

import com.productcatalog.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    /**
     * Find products by brand (case-insensitive)
     */
    List<Product> findByBrandIgnoreCase(String brand);

    /**
     * Find products by product name containing the given text (case-insensitive)
     */
    List<Product> findByProductNameContainingIgnoreCase(String productName);

    /**
     * Get brand summary with count of products grouped by brand using JPQL
     */
    @Query("SELECT p.brand as brand, COUNT(p) as count FROM Product p WHERE p.brand IS NOT NULL GROUP BY p.brand ORDER BY COUNT(p) DESC")
    List<Object[]> getBrandSummary();

    /**
     * Alternative native SQL query for brand summary
     */
    @Query(value = "SELECT brand, COUNT(*) as count FROM product WHERE brand IS NOT NULL GROUP BY brand ORDER BY count DESC", nativeQuery = true)
    List<Object[]> getBrandSummaryNative();
}