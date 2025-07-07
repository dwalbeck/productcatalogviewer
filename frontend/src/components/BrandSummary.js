import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import productApi from '../services/api';

const BrandSummary = () => {
  const [brandSummary, setBrandSummary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalProducts, setTotalProducts] = useState(0);

  useEffect(() => {
    fetchBrandSummary();
  }, []);

  const fetchBrandSummary = async () => {
    try {
      setLoading(true);
      const response = await productApi.getBrandSummary();
      setBrandSummary(response.data);
      
      // Calculate total products
      const total = response.data.reduce((sum, brand) => sum + brand.count, 0);
      setTotalProducts(total);
      
      setError(null);
    } catch (err) {
      setError('Failed to fetch brand summary. Please try again later.');
      console.error('Error fetching brand summary:', err);
    } finally {
      setLoading(false);
    }
  };

  const getPercentage = (count) => {
    if (totalProducts === 0) return 0;
    return ((count / totalProducts) * 100).toFixed(1);
  };

  const getBarWidth = (count) => {
    if (totalProducts === 0) return 0;
    const maxCount = Math.max(...brandSummary.map(brand => brand.count));
    return (count / maxCount) * 100;
  };

  if (loading) {
    return <div className="loading">Loading brand summary...</div>;
  }

  if (error) {
    return (
      <div className="card">
        <div className="error">{error}</div>
        <button className="btn" onClick={fetchBrandSummary}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2>Brand Summary</h2>
          <Link to="/" className="btn">
            ← Back to Products
          </Link>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <p><strong>Total Products:</strong> {totalProducts}</p>
          <p><strong>Total Brands:</strong> {brandSummary.length}</p>
        </div>

        {brandSummary.length === 0 ? (
          <div>
            <p>No brand data available.</p>
            <Link to="/add" className="btn">
              Add First Product
            </Link>
          </div>
        ) : (
          <div>
            <h3>Products by Brand</h3>
            <div style={{ marginTop: '1rem' }}>
              {brandSummary.map((brand, index) => (
                <div 
                  key={brand.brand || `unknown-${index}`} 
                  style={{ 
                    marginBottom: '1rem', 
                    padding: '1rem', 
                    backgroundColor: '#f8f9fa', 
                    borderRadius: '4px',
                    border: '1px solid #dee2e6'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <h4 style={{ margin: 0, color: '#2c3e50' }}>
                      {brand.brand || 'Unknown Brand'}
                    </h4>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <span style={{ fontWeight: 'bold', color: '#27ae60' }}>
                        {brand.count} products
                      </span>
                      <span style={{ color: '#7f8c8d' }}>
                        ({getPercentage(brand.count)}%)
                      </span>
                    </div>
                  </div>
                  
                  {/* Progress bar */}
                  <div style={{ 
                    width: '100%', 
                    height: '8px', 
                    backgroundColor: '#e9ecef', 
                    borderRadius: '4px',
                    overflow: 'hidden'
                  }}>
                    <div style={{ 
                      width: `${getBarWidth(brand.count)}%`, 
                      height: '100%', 
                      backgroundColor: '#3498db',
                      transition: 'width 0.3s ease'
                    }} />
                  </div>
                </div>
              ))}
            </div>

            {/* Summary statistics */}
            <div style={{ 
              marginTop: '2rem', 
              padding: '1rem', 
              backgroundColor: '#e8f4f8', 
              borderRadius: '4px',
              border: '1px solid #bee5eb'
            }}>
              <h4>Statistics</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                <div>
                  <strong>Most Popular Brand:</strong><br />
                  {brandSummary.length > 0 ? brandSummary[0].brand || 'Unknown' : 'N/A'}
                  {brandSummary.length > 0 && ` (${brandSummary[0].count} products)`}
                </div>
                <div>
                  <strong>Average Products per Brand:</strong><br />
                  {brandSummary.length > 0 ? (totalProducts / brandSummary.length).toFixed(1) : '0'}
                </div>
                <div>
                  <strong>Brands with Single Product:</strong><br />
                  {brandSummary.filter(brand => brand.count === 1).length}
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.5rem' }}>
              <button className="btn" onClick={fetchBrandSummary}>
                Refresh Data
              </button>
              <Link to="/add" className="btn">
                Add New Product
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BrandSummary;