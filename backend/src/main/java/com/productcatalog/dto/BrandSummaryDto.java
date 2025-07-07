package com.productcatalog.dto;

public class BrandSummaryDto {
    private String brand;
    private Long count;

    public BrandSummaryDto() {}

    public BrandSummaryDto(String brand, Long count) {
        this.brand = brand;
        this.count = count;
    }

    public String getBrand() {
        return brand;
    }

    public void setBrand(String brand) {
        this.brand = brand;
    }

    public Long getCount() {
        return count;
    }

    public void setCount(Long count) {
        this.count = count;
    }

    @Override
    public String toString() {
        return "BrandSummaryDto{" +
                "brand='" + brand + '\'' +
                ", count=" + count +
                '}';
    }
}