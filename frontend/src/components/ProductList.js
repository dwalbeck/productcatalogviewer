import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import productApi from '../services/api';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('name');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productApi.getAllProducts();
      setProducts(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch products. Please try again later.');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      fetchProducts();
      return;
    }

    try {
      setLoading(true);
      const params = {};
      params[searchType] = searchTerm;
      
      const response = await productApi.searchProducts(params);
      setProducts(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to search products. Please try again.');
      console.error('Error searching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
    fetchProducts();
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  if (loading) {
    return <div className="loading">Loading products...</div>;
  }

  if (error) {
    return (
      <div className="card">
        <div className="error">{error}</div>
        <button className="btn" onClick={fetchProducts}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="card">
        <h2>Product Catalog</h2>
        <p>Total products: {products.length}</p>
        
        <form onSubmit={handleSearch} style={{ marginBottom: '1rem' }}>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'end' }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label htmlFor="searchTerm">Search Products:</label>
              <input
                type="text"
                id="searchTerm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Enter search term..."
              />
            </div>
            <div className="form-group">
              <label htmlFor="searchType">Search by:</label>
              <select
                id="searchType"
                value={searchType}
                onChange={(e) => setSearchType(e.target.value)}
                style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ddd' }}
              >
                <option value="name">Product Name</option>
                <option value="brand">Brand</option>
              </select>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button type="submit" className="btn">
                Search
              </button>
              <button type="button" className="btn" onClick={clearSearch}>
                Clear
              </button>
            </div>
          </div>
        </form>
      </div>

      {products.length === 0 ? (
        <div className="card">
          <p>No products found.</p>
          <Link to="/add" className="btn">
            Add First Product
          </Link>
        </div>
      ) : (
        <div className="product-grid">
          {products.map((product) => (
            <div key={product.productKey} className="product-card">
              <div className="product-title">{product.productName}</div>
              <div className="product-brand">{product.brand}</div>
              <div className="product-price">
                {product.price ? formatPrice(product.price) : 'Price not available'}
              </div>
              <div style={{ marginBottom: '0.5rem' }}>
                <strong>Model:</strong> {product.model || 'N/A'}
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <strong>Retailer:</strong> {product.retailer || 'N/A'}
              </div>
              <Link 
                to={`/product/${product.productKey}`} 
                className="btn"
                style={{ width: '100%', textAlign: 'center' }}
              >
                View Details
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductList;