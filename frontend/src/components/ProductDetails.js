import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import productApi from '../services/api';

const ProductDetails = () => {
  const { productKey } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [productKey]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await productApi.getProductById(productKey);
      setProduct(response.data);
      setEditForm(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch product details. Please try again later.');
      console.error('Error fetching product:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditForm(product);
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    try {
      const response = await productApi.updateProduct(editForm);
      setProduct(response.data);
      setIsEditing(false);
      setError(null);
    } catch (err) {
      setError('Failed to update product. Please try again.');
      console.error('Error updating product:', err);
    }
  };

  const handleDelete = async () => {
    try {
      await productApi.deleteProduct(productKey);
      navigate('/');
    } catch (err) {
      setError('Failed to delete product. Please try again.');
      console.error('Error deleting product:', err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  if (loading) {
    return <div className="loading">Loading product details...</div>;
  }

  if (error) {
    return (
      <div className="card">
        <div className="error">{error}</div>
        <Link to="/" className="btn">
          Back to Products
        </Link>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="card">
        <h2>Product Not Found</h2>
        <p>The product you're looking for doesn't exist.</p>
        <Link to="/" className="btn">
          Back to Products
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2>Product Details</h2>
          <Link to="/" className="btn">
            ← Back to Products
          </Link>
        </div>

        {isEditing ? (
          <form onSubmit={handleSaveEdit}>
            <div className="form-group">
              <label htmlFor="productKey">Product Key:</label>
              <input
                type="number"
                id="productKey"
                name="productKey"
                value={editForm.productKey || ''}
                onChange={handleInputChange}
                required
                disabled
              />
            </div>

            <div className="form-group">
              <label htmlFor="productName">Product Name:</label>
              <input
                type="text"
                id="productName"
                name="productName"
                value={editForm.productName || ''}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="brand">Brand:</label>
              <input
                type="text"
                id="brand"
                name="brand"
                value={editForm.brand || ''}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="model">Model:</label>
              <input
                type="text"
                id="model"
                name="model"
                value={editForm.model || ''}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="retailer">Retailer:</label>
              <input
                type="text"
                id="retailer"
                name="retailer"
                value={editForm.retailer || ''}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="price">Price:</label>
              <input
                type="number"
                step="0.01"
                id="price"
                name="price"
                value={editForm.price || ''}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="productDescription">Description:</label>
              <textarea
                id="productDescription"
                name="productDescription"
                value={editForm.productDescription || ''}
                onChange={handleInputChange}
                rows="4"
              />
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button type="submit" className="btn">
                Save Changes
              </button>
              <button type="button" className="btn" onClick={handleCancelEdit}>
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
              <div>
                <h3>{product.productName}</h3>
                <p><strong>Product Key:</strong> {product.productKey}</p>
                <p><strong>Brand:</strong> {product.brand || 'N/A'}</p>
                <p><strong>Model:</strong> {product.model || 'N/A'}</p>
                <p><strong>Retailer:</strong> {product.retailer || 'N/A'}</p>
                <p><strong>Price:</strong> {product.price ? formatPrice(product.price) : 'N/A'}</p>
              </div>
              <div>
                <h4>Description</h4>
                <p style={{ lineHeight: '1.6' }}>
                  {product.productDescription || 'No description available.'}
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button className="btn" onClick={handleEdit}>
                Edit Product
              </button>
              <button 
                className="btn btn-danger" 
                onClick={() => setDeleteConfirm(true)}
              >
                Delete Product
              </button>
            </div>
          </div>
        )}

        {deleteConfirm && (
          <div style={{ 
            marginTop: '2rem', 
            padding: '1rem', 
            backgroundColor: '#f8f9fa', 
            border: '1px solid #dee2e6',
            borderRadius: '4px'
          }}>
            <h4>Confirm Delete</h4>
            <p>Are you sure you want to delete this product? This action cannot be undone.</p>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button className="btn btn-danger" onClick={handleDelete}>
                Yes, Delete
              </button>
              <button className="btn" onClick={() => setDeleteConfirm(false)}>
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;