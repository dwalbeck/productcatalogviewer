package com.productcatalog.service;

import com.productcatalog.dto.BrandSummaryDto;
import com.productcatalog.entity.Product;
import com.productcatalog.repository.ProductRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProductServiceTest {

    @Mock
    private ProductRepository productRepository;

    @InjectMocks
    private ProductService productService;

    private Product testProduct;

    @BeforeEach
    void setUp() {
        testProduct = new Product(
                1L,
                "Test Retailer",
                "Test Brand",
                "Test Model",
                "Test Product",
                new BigDecimal("99.99"),
                "Test Description"
        );
    }

    @Test
    void getAllProducts_ShouldReturnAllProducts() {
        // Given
        List<Product> expectedProducts = Arrays.asList(testProduct);
        when(productRepository.findAll()).thenReturn(expectedProducts);

        // When
        List<Product> actualProducts = productService.getAllProducts();

        // Then
        assertEquals(expectedProducts, actualProducts);
        verify(productRepository).findAll();
    }

    @Test
    void getProductById_WhenProductExists_ShouldReturnProduct() {
        // Given
        when(productRepository.findById(1L)).thenReturn(Optional.of(testProduct));

        // When
        Optional<Product> result = productService.getProductById(1L);

        // Then
        assertTrue(result.isPresent());
        assertEquals(testProduct, result.get());
        verify(productRepository).findById(1L);
    }

    @Test
    void getProductById_WhenProductDoesNotExist_ShouldReturnEmpty() {
        // Given
        when(productRepository.findById(1L)).thenReturn(Optional.empty());

        // When
        Optional<Product> result = productService.getProductById(1L);

        // Then
        assertFalse(result.isPresent());
        verify(productRepository).findById(1L);
    }

    @Test
    void createProduct_ShouldSaveAndReturnProduct() {
        // Given
        when(productRepository.save(any(Product.class))).thenReturn(testProduct);

        // When
        Product result = productService.createProduct(testProduct);

        // Then
        assertEquals(testProduct, result);
        verify(productRepository).save(testProduct);
    }

    @Test
    void updateProduct_WhenProductExists_ShouldUpdateAndReturnProduct() {
        // Given
        when(productRepository.existsById(1L)).thenReturn(true);
        when(productRepository.save(any(Product.class))).thenReturn(testProduct);

        // When
        Product result = productService.updateProduct(testProduct);

        // Then
        assertEquals(testProduct, result);
        verify(productRepository).existsById(1L);
        verify(productRepository).save(testProduct);
    }

    @Test
    void updateProduct_WhenProductDoesNotExist_ShouldThrowException() {
        // Given
        when(productRepository.existsById(1L)).thenReturn(false);

        // When & Then
        RuntimeException exception = assertThrows(RuntimeException.class, 
            () -> productService.updateProduct(testProduct));
        
        assertEquals("Product not found with id: 1", exception.getMessage());
        verify(productRepository).existsById(1L);
        verify(productRepository, never()).save(any());
    }

    @Test
    void deleteProduct_WhenProductExists_ShouldDeleteProduct() {
        // Given
        when(productRepository.existsById(1L)).thenReturn(true);

        // When
        productService.deleteProduct(1L);

        // Then
        verify(productRepository).existsById(1L);
        verify(productRepository).deleteById(1L);
    }

    @Test
    void deleteProduct_WhenProductDoesNotExist_ShouldThrowException() {
        // Given
        when(productRepository.existsById(1L)).thenReturn(false);

        // When & Then
        RuntimeException exception = assertThrows(RuntimeException.class, 
            () -> productService.deleteProduct(1L));
        
        assertEquals("Product not found with id: 1", exception.getMessage());
        verify(productRepository).existsById(1L);
        verify(productRepository, never()).deleteById(anyLong());
    }

    @Test
    void getBrandSummary_ShouldReturnBrandSummaryList() {
        // Given
        Object[] brandData1 = {"Brand A", 5L};
        Object[] brandData2 = {"Brand B", 3L};
        List<Object[]> mockResults = Arrays.asList(brandData1, brandData2);
        when(productRepository.getBrandSummary()).thenReturn(mockResults);

        // When
        List<BrandSummaryDto> result = productService.getBrandSummary();

        // Then
        assertEquals(2, result.size());
        assertEquals("Brand A", result.get(0).getBrand());
        assertEquals(5L, result.get(0).getCount());
        assertEquals("Brand B", result.get(1).getBrand());
        assertEquals(3L, result.get(1).getCount());
        verify(productRepository).getBrandSummary();
    }

    @Test
    void productExists_WhenProductExists_ShouldReturnTrue() {
        // Given
        when(productRepository.existsById(1L)).thenReturn(true);

        // When
        boolean result = productService.productExists(1L);

        // Then
        assertTrue(result);
        verify(productRepository).existsById(1L);
    }

    @Test
    void getTotalProductCount_ShouldReturnCount() {
        // Given
        when(productRepository.count()).thenReturn(10L);

        // When
        long result = productService.getTotalProductCount();

        // Then
        assertEquals(10L, result);
        verify(productRepository).count();
    }
}