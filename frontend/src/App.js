import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ProductList from './components/ProductList';
import ProductDetails from './components/ProductDetails';
import AddProduct from './components/AddProduct';
import BrandSummary from './components/BrandSummary';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="header">
          <div className="container">
            <h1>Product Catalog Viewer</h1>
          </div>
        </header>
        
        <nav className="nav">
          <div className="container">
            <ul>
              <li>
                <Link to="/">All Products</Link>
              </li>
              <li>
                <Link to="/add">Add Product</Link>
              </li>
              <li>
                <Link to="/brands">Brand Summary</Link>
              </li>
            </ul>
          </div>
        </nav>

        <main className="container">
          <Routes>
            <Route path="/" element={<ProductList />} />
            <Route path="/product/:productKey" element={<ProductDetails />} />
            <Route path="/add" element={<AddProduct />} />
            <Route path="/brands" element={<BrandSummary />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;