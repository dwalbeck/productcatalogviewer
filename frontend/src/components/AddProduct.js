import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import productApi from '../services/api';

const AddProduct = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    productKey: '',
    productName: '',
    brand: '',
    model: '',
    retailer: '',
    price: '',
    productDescription: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const validateForm = () => {
    const newErrors = {};

    // Product Key validation
    if (!formData.productKey) {
      newErrors.productKey = 'Product Key is required';
    } else if (isNaN(formData.productKey) || formData.productKey <= 0) {
      newErrors.productKey = 'Product Key must be a positive number';
    }

    // Product Name validation
    if (!formData.productName.trim()) {
      newErrors.productName = 'Product Name is required';
    } else if (formData.productName.length > 96) {
      newErrors.productName = 'Product Name must be 96 characters or less';
    }

    // Brand validation
    if (formData.brand && formData.brand.length > 64) {
      newErrors.brand = 'Brand must be 64 characters or less';
    }

    // Model validation
    if (formData.model && formData.model.length > 32) {
      newErrors.model = 'Model must be 32 characters or less';
    }

    // Retailer validation
    if (formData.retailer && formData.retailer.length > 64) {
      newErrors.retailer = 'Retailer must be 64 characters or less';
    }

    // Price validation
    if (!formData.price) {
      newErrors.price = 'Price is required';
    } else if (isNaN(formData.price) || parseFloat(formData.price) < 0) {
      newErrors.price = 'Price must be a non-negative number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setSubmitError(null);

    try {
      // Convert productKey and price to appropriate types
      const productData = {
        ...formData,
        productKey: parseInt(formData.productKey),
        price: parseFloat(formData.price)
      };

      await productApi.createProduct(productData);
      navigate('/');
    } catch (err) {
      console.error('Error creating product:', err);
      if (err.response && err.response.status === 400) {
        setSubmitError('Invalid product data. Please check your inputs and try again.');
      } else if (err.response && err.response.status === 409) {
        setSubmitError('A product with this Product Key already exists.');
      } else {
        setSubmitError('Failed to create product. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      productKey: '',
      productName: '',
      brand: '',
      model: '',
      retailer: '',
      price: '',
      productDescription: ''
    });
    setErrors({});
    setSubmitError(null);
  };

  return (
    <div>
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2>Add New Product</h2>
          <Link to="/" className="btn">
            ← Back to Products
          </Link>
        </div>

        {submitError && (
          <div className="error" style={{ marginBottom: '1rem', padding: '0.5rem', backgroundColor: '#f8d7da', border: '1px solid #f5c6cb', borderRadius: '4px' }}>
            {submitError}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="productKey">Product Key *</label>
            <input
              type="number"
              id="productKey"
              name="productKey"
              value={formData.productKey}
              onChange={handleInputChange}
              placeholder="Enter unique product key"
              disabled={loading}
            />
            {errors.productKey && <div className="error">{errors.productKey}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="productName">Product Name *</label>
            <input
              type="text"
              id="productName"
              name="productName"
              value={formData.productName}
              onChange={handleInputChange}
              placeholder="Enter product name"
              maxLength="96"
              disabled={loading}
            />
            {errors.productName && <div className="error">{errors.productName}</div>}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label htmlFor="brand">Brand</label>
              <input
                type="text"
                id="brand"
                name="brand"
                value={formData.brand}
                onChange={handleInputChange}
                placeholder="Enter brand name"
                maxLength="64"
                disabled={loading}
              />
              {errors.brand && <div className="error">{errors.brand}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="model">Model</label>
              <input
                type="text"
                id="model"
                name="model"
                value={formData.model}
                onChange={handleInputChange}
                placeholder="Enter model"
                maxLength="32"
                disabled={loading}
              />
              {errors.model && <div className="error">{errors.model}</div>}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label htmlFor="retailer">Retailer</label>
              <input
                type="text"
                id="retailer"
                name="retailer"
                value={formData.retailer}
                onChange={handleInputChange}
                placeholder="Enter retailer name"
                maxLength="64"
                disabled={loading}
              />
              {errors.retailer && <div className="error">{errors.retailer}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="price">Price *</label>
              <input
                type="number"
                step="0.01"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="0.00"
                disabled={loading}
              />
              {errors.price && <div className="error">{errors.price}</div>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="productDescription">Description</label>
            <textarea
              id="productDescription"
              name="productDescription"
              value={formData.productDescription}
              onChange={handleInputChange}
              placeholder="Enter product description"
              rows="4"
              disabled={loading}
            />
            {errors.productDescription && <div className="error">{errors.productDescription}</div>}
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.5rem' }}>
            <button 
              type="submit" 
              className="btn" 
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Product'}
            </button>
            <button 
              type="button" 
              className="btn" 
              onClick={handleReset}
              disabled={loading}
            >
              Reset Form
            </button>
          </div>
        </form>

        <div style={{ marginTop: '1.5rem', padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
          <h4>Form Guidelines:</h4>
          <ul style={{ margin: '0.5rem 0', paddingLeft: '1.5rem' }}>
            <li>Fields marked with * are required</li>
            <li>Product Key must be unique and positive</li>
            <li>Product Name is limited to 96 characters</li>
            <li>Brand and Retailer are limited to 64 characters</li>
            <li>Model is limited to 32 characters</li>
            <li>Price must be a non-negative number</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;