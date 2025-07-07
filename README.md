# Product Catalog Viewer

A full-stack web application for managing and viewing product catalogs. Built with React frontend, Spring Boot backend, and PostgreSQL database, all containerized with Docker Compose.

## Features

- **Product Management**: View, add, edit, and delete products
- **Search & Filter**: Search products by name or brand
- **Brand Analytics**: View product count summary grouped by brand
- **Responsive UI**: Clean, modern interface with grid layout
- **RESTful API**: Well-documented REST endpoints
- **Containerized**: Complete Docker setup for easy deployment

## Technology Stack

### Frontend
- **React 18** - Modern UI library
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls
- **CSS Grid/Flexbox** - Responsive layout

### Backend
- **Spring Boot 3.2** - Java framework
- **Spring Data JPA** - Data persistence
- **Hibernate** - ORM framework
- **PostgreSQL** - Database
- **Maven** - Build tool

### DevOps
- **Docker & Docker Compose** - Containerization
- **PostgreSQL 15** - Database container

## Quick Start

### Prerequisites
- Docker and Docker Compose installed
- Git
- Java 17 
- Maven

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd productcatalogviewer
   ```

2. **Start the application**
   ```bash
   docker-compose up --build
   ```

3. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8080
   - Database: localhost:5432

The application will automatically:
- Create the PostgreSQL database
- Run database migrations
- Populate with sample data
- Start all services

### Manual Setup (Development)

#### Backend Setup
```bash
cd backend
./mvnw spring-boot:run
```

#### Frontend Setup
```bash
cd frontend
npm install
npm start
```

#### Database Setup
```bash
# Start PostgreSQL
docker run --name postgres -e POSTGRES_DB=productcatalog -e POSTGRES_USER=dbuser -e POSTGRES_PASSWORD=supersecret -p 5432:5432 -d postgres:15-alpine

# Run schema and data scripts
psql -h localhost -U dbuser -d productcatalog -f schema.sql
psql -h localhost -U dbuser -d productcatalog -f init-data.sql
```

## API Documentation

### Base URL
```
http://localhost:8080
```

### Endpoints

#### 1. Get All Products
- **GET** `/products`
- **Description**: Retrieve all products
- **Response**: Array of product objects

**Sample Response:**
```json
[
  {
    "productKey": 12952635,
    "retailer": "XYZ Retail",
    "brand": "Bosch",
    "model": "WTZSB30UC",
    "productName": "Dryer Wall Mounting Bracket (Silver)",
    "price": 29.99,
    "productDescription": "1: Bracket Style | 2: Stainless Steel | 3: Hardware Included"
  }
]
```

#### 2. Get Product by ID
- **GET** `/products/{productKey}`
- **Description**: Retrieve a specific product
- **Parameters**: 
  - `productKey` (path) - Product ID

**Sample Response:**
```json
{
  "productKey": 12952635,
  "retailer": "XYZ Retail",
  "brand": "Bosch",
  "model": "WTZSB30UC",
  "productName": "Dryer Wall Mounting Bracket (Silver)",
  "price": 29.99,
  "productDescription": "1: Bracket Style | 2: Stainless Steel | 3: Hardware Included"
}
```

#### 3. Create Product
- **POST** `/products`
- **Description**: Add a new product
- **Content-Type**: `application/json`

**Sample Request:**
```json
{
  "productKey": 99999999,
  "retailer": "ABC Store",
  "brand": "TestBrand",
  "model": "TB001",
  "productName": "Test Product",
  "price": 19.99,
  "productDescription": "A test product for demonstration"
}
```

**Sample Response:**
```json
{
  "productKey": 99999999,
  "retailer": "ABC Store",
  "brand": "TestBrand",
  "model": "TB001",
  "productName": "Test Product",
  "price": 19.99,
  "productDescription": "A test product for demonstration"
}
```

#### 4. Update Product
- **PUT** `/products`
- **Description**: Update an existing product
- **Content-Type**: `application/json`

**Sample Request:**
```json
{
  "productKey": 99999999,
  "retailer": "ABC Store",
  "brand": "TestBrand",
  "model": "TB001-V2",
  "productName": "Updated Test Product",
  "price": 24.99,
  "productDescription": "An updated test product"
}
```

#### 5. Delete Product
- **DELETE** `/products/{productKey}`
- **Description**: Remove a product
- **Parameters**: 
  - `productKey` (path) - Product ID
- **Response**: 204 No Content

#### 6. Brand Summary
- **GET** `/products/brand-summary`
- **Description**: Get product count grouped by brand

**Sample Response:**
```json
[
  {
    "brand": "GIANT ART",
    "count": 8
  },
  {
    "brand": "Savoy House",
    "count": 3
  },
  {
    "brand": "Tommy Docks",
    "count": 2
  }
]
```

#### 7. Search Products
- **GET** `/products/search`
- **Description**: Search products by name or brand
- **Parameters**: 
  - `name` (query, optional) - Search by product name
  - `brand` (query, optional) - Search by brand

**Sample Request:**
```
GET /products/search?name=canvas
GET /products/search?brand=Bosch
```

#### 8. Get Product Count
- **GET** `/products/count`
- **Description**: Get total number of products
- **Response**: Number

## Database Schema

### Product Table
```sql
CREATE TABLE IF NOT EXISTS product (
    product_key             bigint NOT NULL,
    retailer                varchar(64),
    brand                   varchar(64),
    model                   varchar(32),
    product_name            varchar(96) NOT NULL,
    product_price           numeric(32,2) NOT NULL DEFAULT 0.00,
    product_description     text,
    PRIMARY KEY (product_key)
);
```

## Project Structure

```
productcatalogviewer/
├── backend/                    # Spring Boot application
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/productcatalog/
│   │   │   │   ├── ProductCatalogApplication.java
│   │   │   │   ├── controller/
│   │   │   │   │   └── ProductController.java
│   │   │   │   ├── service/
│   │   │   │   │   └── ProductService.java
│   │   │   │   ├── repository/
│   │   │   │   │   └── ProductRepository.java
│   │   │   │   ├── entity/
│   │   │   │   │   └── Product.java
│   │   │   │   └── dto/
│   │   │   │       └── BrandSummaryDto.java
│   │   │   └── resources/
│   │   │       └── application.properties
│   │   └── test/                # Unit tests
│   ├── pom.xml
│   └── Dockerfile
├── frontend/                   # React application
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── ProductList.js
│   │   │   ├── ProductDetails.js
│   │   │   ├── AddProduct.js
│   │   │   └── BrandSummary.js
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.js
│   │   └── index.js
│   ├── package.json
│   └── Dockerfile
├── docker-compose.yml          # Container orchestration
├── schema.sql                  # Database schema
├── init-data.sql              # Sample data
├── products.json              # Original sample data
└── README.md
```

## Testing

### Backend Tests
```bash
cd backend
./mvnw test
```

### Frontend Tests
```bash
cd frontend
npm test
```

### API Testing with curl

**Get all products:**
```bash
curl -X GET http://localhost:8080/products
```

**Create a product:**
```bash
curl -X POST http://localhost:8080/products \
  -H "Content-Type: application/json" \
  -d '{
    "productKey": 99999999,
    "retailer": "Test Store",
    "brand": "TestBrand",
    "model": "TB001",
    "productName": "Test Product",
    "price": 19.99,
    "productDescription": "A test product"
  }'
```

**Get brand summary:**
```bash
curl -X GET http://localhost:8080/products/brand-summary
```

## Development

### Code Quality
- **Backend**: Follows Spring Boot best practices with clean architecture
- **Frontend**: Uses React functional components with hooks
- **Testing**: Comprehensive unit tests for services and controllers
- **Validation**: Form validation on frontend and backend
- **Error Handling**: Proper error responses and user feedback

### Key Features Implemented
- ✅ Clean architecture with separation of concerns
- ✅ RESTful API design
- ✅ Hibernate/JPA for database operations
- ✅ JPQL queries for brand summary
- ✅ React components with proper state management
- ✅ Form validation and error handling
- ✅ Responsive design
- ✅ Docker containerization
- ✅ Unit tests
- ✅ Comprehensive documentation

## Troubleshooting

### Common Issues

1. **Port conflicts**: Ensure ports 3000, 8080, and 5432 are available
2. **Docker issues**: Run `docker-compose down` and `docker-compose up --build`
3. **Database connection**: Check PostgreSQL container is running
4. **CORS issues**: Backend is configured to allow frontend origin

### Logs
```bash
# View all logs
docker-compose logs

# View specific service logs
docker-compose logs backend
docker-compose logs frontend
docker-compose logs postgres
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make changes with tests
4. Submit a pull request

## License

This project is for demonstration purposes.
