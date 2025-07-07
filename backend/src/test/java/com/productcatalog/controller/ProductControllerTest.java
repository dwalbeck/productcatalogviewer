package com.productcatalog.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.productcatalog.dto.BrandSummaryDto;
import com.productcatalog.entity.Product;
import com.productcatalog.service.ProductService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ProductController.class)
class ProductControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ProductService productService;

    @Autowired
    private ObjectMapper objectMapper;

    private Product testProduct;
    private List<Product> testProducts;

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
        testProducts = Arrays.asList(testProduct);
    }

    @Test
    void getAllProducts_ShouldReturnProductList() throws Exception {
        // Given
        when(productService.getAllProducts()).thenReturn(testProducts);

        // When & Then
        mockMvc.perform(get("/products"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$[0].productKey").value(1))
                .andExpect(jsonPath("$[0].productName").value("Test Product"))
                .andExpect(jsonPath("$[0].brand").value("Test Brand"))
                .andExpect(jsonPath("$[0].price").value(99.99));

        verify(productService).getAllProducts();
    }

    @Test
    void getProductById_WhenProductExists_ShouldReturnProduct() throws Exception {
        // Given
        when(productService.getProductById(1L)).thenReturn(Optional.of(testProduct));

        // When & Then
        mockMvc.perform(get("/products/1"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.productKey").value(1))
                .andExpect(jsonPath("$.productName").value("Test Product"));

        verify(productService).getProductById(1L);
    }

    @Test
    void getProductById_WhenProductDoesNotExist_ShouldReturnNotFound() throws Exception {
        // Given
        when(productService.getProductById(1L)).thenReturn(Optional.empty());

        // When & Then
        mockMvc.perform(get("/products/1"))
                .andExpect(status().isNotFound());

        verify(productService).getProductById(1L);
    }

    @Test
    void createProduct_WithValidProduct_ShouldReturnCreatedProduct() throws Exception {
        // Given
        when(productService.createProduct(any(Product.class))).thenReturn(testProduct);

        // When & Then
        mockMvc.perform(post("/products")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(testProduct)))
                .andExpect(status().isCreated())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.productKey").value(1))
                .andExpect(jsonPath("$.productName").value("Test Product"));

        verify(productService).createProduct(any(Product.class));
    }

    @Test
    void createProduct_WithInvalidProduct_ShouldReturnBadRequest() throws Exception {
        // Given
        Product invalidProduct = new Product();
        invalidProduct.setProductKey(1L);
        // Missing required fields

        // When & Then
        mockMvc.perform(post("/products")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(invalidProduct)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void updateProduct_WithValidProduct_ShouldReturnUpdatedProduct() throws Exception {
        // Given
        when(productService.updateProduct(any(Product.class))).thenReturn(testProduct);

        // When & Then
        mockMvc.perform(put("/products")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(testProduct)))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.productKey").value(1))
                .andExpect(jsonPath("$.productName").value("Test Product"));

        verify(productService).updateProduct(any(Product.class));
    }

    @Test
    void updateProduct_WhenProductNotFound_ShouldReturnNotFound() throws Exception {
        // Given
        when(productService.updateProduct(any(Product.class)))
                .thenThrow(new RuntimeException("Product not found"));

        // When & Then
        mockMvc.perform(put("/products")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(testProduct)))
                .andExpect(status().isNotFound());

        verify(productService).updateProduct(any(Product.class));
    }

    @Test
    void deleteProduct_WhenProductExists_ShouldReturnNoContent() throws Exception {
        // Given
        doNothing().when(productService).deleteProduct(1L);

        // When & Then
        mockMvc.perform(delete("/products/1"))
                .andExpect(status().isNoContent());

        verify(productService).deleteProduct(1L);
    }

    @Test
    void deleteProduct_WhenProductNotFound_ShouldReturnNotFound() throws Exception {
        // Given
        doThrow(new RuntimeException("Product not found")).when(productService).deleteProduct(1L);

        // When & Then
        mockMvc.perform(delete("/products/1"))
                .andExpect(status().isNotFound());

        verify(productService).deleteProduct(1L);
    }

    @Test
    void getBrandSummary_ShouldReturnBrandSummaryList() throws Exception {
        // Given
        List<BrandSummaryDto> brandSummary = Arrays.asList(
                new BrandSummaryDto("Brand A", 5L),
                new BrandSummaryDto("Brand B", 3L)
        );
        when(productService.getBrandSummary()).thenReturn(brandSummary);

        // When & Then
        mockMvc.perform(get("/products/brand-summary"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$[0].brand").value("Brand A"))
                .andExpect(jsonPath("$[0].count").value(5))
                .andExpect(jsonPath("$[1].brand").value("Brand B"))
                .andExpect(jsonPath("$[1].count").value(3));

        verify(productService).getBrandSummary();
    }

    @Test
    void searchProducts_WithNameParameter_ShouldReturnFilteredProducts() throws Exception {
        // Given
        when(productService.searchProductsByName("Test")).thenReturn(testProducts);

        // When & Then
        mockMvc.perform(get("/products/search").param("name", "Test"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$[0].productName").value("Test Product"));

        verify(productService).searchProductsByName("Test");
    }

    @Test
    void searchProducts_WithBrandParameter_ShouldReturnFilteredProducts() throws Exception {
        // Given
        when(productService.getProductsByBrand("Test Brand")).thenReturn(testProducts);

        // When & Then
        mockMvc.perform(get("/products/search").param("brand", "Test Brand"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$[0].brand").value("Test Brand"));

        verify(productService).getProductsByBrand("Test Brand");
    }

    @Test
    void getProductCount_ShouldReturnCount() throws Exception {
        // Given
        when(productService.getTotalProductCount()).thenReturn(10L);

        // When & Then
        mockMvc.perform(get("/products/count"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(content().string("10"));

        verify(productService).getTotalProductCount();
    }
}
