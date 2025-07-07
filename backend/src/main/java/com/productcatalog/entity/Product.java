package com.productcatalog.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.DecimalMin;
import java.math.BigDecimal;

@Entity
@Table(name = "product")
public class Product {

    @Id
    @Column(name = "product_key")
    private Long productKey;

    @Column(name = "retailer", length = 64)
    private String retailer;

    @Column(name = "brand", length = 64)
    private String brand;

    @Column(name = "model", length = 32)
    private String model;

    @NotBlank(message = "Product name is required")
    @Column(name = "product_name", length = 96, nullable = false)
    private String productName;

    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.0", inclusive = true, message = "Price must be non-negative")
    @Column(name = "product_price", nullable = false, precision = 32, scale = 2)
    private BigDecimal price;

    @Column(name = "product_description", columnDefinition = "TEXT")
    private String productDescription;

    // Default constructor
    public Product() {}

    // Constructor with all fields
    public Product(Long productKey, String retailer, String brand, String model, 
                   String productName, BigDecimal price, String productDescription) {
        this.productKey = productKey;
        this.retailer = retailer;
        this.brand = brand;
        this.model = model;
        this.productName = productName;
        this.price = price;
        this.productDescription = productDescription;
    }

    // Getters and Setters
    public Long getProductKey() {
        return productKey;
    }

    public void setProductKey(Long productKey) {
        this.productKey = productKey;
    }

    public String getRetailer() {
        return retailer;
    }

    public void setRetailer(String retailer) {
        this.retailer = retailer;
    }

    public String getBrand() {
        return brand;
    }

    public void setBrand(String brand) {
        this.brand = brand;
    }

    public String getModel() {
        return model;
    }

    public void setModel(String model) {
        this.model = model;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public String getProductDescription() {
        return productDescription;
    }

    public void setProductDescription(String productDescription) {
        this.productDescription = productDescription;
    }

    @Override
    public String toString() {
        return "Product{" +
                "productKey=" + productKey +
                ", retailer='" + retailer + '\'' +
                ", brand='" + brand + '\'' +
                ", model='" + model + '\'' +
                ", productName='" + productName + '\'' +
                ", price=" + price +
                ", productDescription='" + productDescription + '\'' +
                '}';
    }
}