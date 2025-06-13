# Express Starter Code

A production-ready Express.js starter template with comprehensive security, performance optimization, and scalability features.

## 🚀 Features

- **Security First**: Comprehensive security middleware stack
- **Performance Optimized**: Response compression and request optimization
- **Scalable Architecture**: Redis integration with consistent hashing
- **File Upload Support**: Cloudinary integration with Multer
- **Authentication Ready**: JWT-based authentication system
- **Input Validation**: Joi validation with sanitization
- **Error Handling**: Global error handler with Winston logging
- **Rate Limiting**: Redis-backed rate limiting
- **Docker Ready**: Complete containerization setup
- **Health Monitoring**: Built-in health check endpoints

## 📋 Prerequisites

- Node.js 18+ (LTS recommended)
- MongoDB database
- Redis server
- Cloudinary account (for file uploads)

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd express-starter-code
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the root directory:
   ```env
   # Server Configuration
   PORT=3000
   NODE_ENV=development
   BASE_URL=http://localhost:3000

   # Database
   MONGO_URI=mongodb://localhost:27017/your-database-name

   # Redis Configuration
   REDIS_HOST=localhost
   REDIS_PORT=6379
   REDIS_PASSWORD=your-redis-password

   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key
   JWT_EXPIRES_IN=7d

   # Cloudinary Configuration
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret

   # CORS Configuration
   CORS_ORIGIN=http://localhost:3000
   ```

4. **Start the application**
   ```bash
   npm start
   ```

## 🐳 Docker Deployment

1. **Using Docker Compose (Recommended)**
   ```bash
   docker-compose up -d
   ```

2. **Using Docker only**
   ```bash
   docker build -t express-starter .
   docker run -p 3000:3000 express-starter
   ```

## 🏗️ Project Structure

```
├── src/
│   ├── app.js                 # Main application entry point
│   ├── config/                # Configuration files
│   │   ├── cloudinary.js      # Cloudinary setup
│   │   ├── multer.js          # File upload configuration
│   │   ├── rate-limiter.js    # Rate limiting configuration
│   │   └── redis.js           # Redis connection setup
│   ├── controllers/           # Route controllers
│   │   └── authController.js  # Authentication logic
│   ├── middleware/            # Custom middleware
│   │   ├── authMiddleware.js  # JWT authentication & validation
│   │   ├── compressionMiddleware.js # Response compression
│   │   ├── corsMiddleware.js  # CORS configuration
│   │   ├── requestMiddleware.js # Request timeout & size limits
│   │   ├── sanitizationMiddleware.js # Input sanitization
│   │   └── securityMiddleware.js # Security headers
│   ├── models/                # Database models
│   │   └── User.js            # User model schema
│   ├── routes/                # API routes
│   │   ├── authRoutes.js      # Authentication endpoints
│   │   └── uploadRoutes.js    # File upload endpoints
│   └── utils/                 # Utility functions
│       ├── consistentHash.js  # Redis consistent hashing
│       ├── errorHandler.js    # Global error handling
│       └── logger.js          # Winston logging setup
├── benchmark/                 # Performance benchmarking
├── docker-compose.yml         # Docker Compose configuration
├── Dockerfile                 # Docker container setup
└── package.json              # Project dependencies
```

## 🛡️ Security Middleware Stack

### 1. **Security Headers** (`securityMiddleware.js`)
- **Purpose**: Sets essential HTTP security headers
- **Features**:
  - Content Security Policy (CSP)
  - X-Frame-Options protection
  - X-Content-Type-Options
  - Referrer Policy
  - Cross-Origin Embedder Policy
- **Protection Against**: Clickjacking, MIME sniffing, XSS attacks

### 2. **Input Sanitization** (`sanitizationMiddleware.js`)
- **NoSQL Injection Protection**: 
  - Sanitizes MongoDB query operators (`$`, `.`)
  - Replaces malicious characters with `_`
- **XSS Protection**:
  - Cleans HTML/JavaScript from user input
  - Prevents script injection attacks

### 3. **Request Protection** (`requestMiddleware.js`)
- **Timeout Middleware**: 
  - 30-second request timeout
  - Prevents hanging connections
- **Body Size Limiting**:
  - 10MB limit for JSON/URL-encoded payloads
  - DoS attack prevention

### 4. **CORS Configuration** (`corsMiddleware.js`)
- **Cross-Origin Resource Sharing**
- **Configurable Origins**: Environment-based origin control
- **Allowed Methods**: GET, POST, PUT, DELETE, OPTIONS
- **Headers**: Content-Type, Authorization

### 5. **Rate Limiting** (`rate-limiter.js`)
- **Redis-Backed**: Distributed rate limiting
- **Configurable Limits**: Requests per time window
- **IP-Based Tracking**: Per-client rate limiting

## ⚡ Performance Middleware

### 1. **Compression** (`compressionMiddleware.js`)
- **Gzip Compression**: Reduces response size
- **Smart Filtering**: Only compresses responses > 1KB
- **Cache-Control Aware**: Respects no-transform directives
- **Performance Gain**: 60-80% bandwidth reduction

### 2. **Consistent Hashing** (`consistentHash.js`)
- **Redis Distribution**: Efficient Redis server selection
- **Load Balancing**: Even distribution across Redis instances
- **Fault Tolerance**: Handles server failures gracefully

## 🔐 Authentication System

### JWT Implementation
- **Token-Based**: Stateless authentication
- **Middleware Protection**: Route-level authentication
- **Validation**: Comprehensive input validation with Joi
- **Security**: Strong password requirements

### Available Endpoints
```
POST /api/v1/auth/register  # User registration
POST /api/v1/auth/login     # User login
GET  /api/v1/auth/profile   # Get user profile (protected)
```

## 📁 File Upload System

### Cloudinary Integration
- **Cloud Storage**: Secure file storage
- **Image Optimization**: Automatic image processing
- **File Validation**: Type and size restrictions
- **Upload Endpoint**: `POST /api/v1/upload`

## 📊 Monitoring & Logging

### Health Check
- **Endpoint**: `GET /health`
- **Provides**: Server status, uptime, timestamp
- **Docker**: Integrated health checks

### Logging System
- **Winston Logger**: Structured logging
- **Morgan Integration**: HTTP request logging
- **Log Levels**: Error, warn, info, debug
- **File Rotation**: Automatic log management

## 🚦 Middleware Execution Order

The middleware stack executes in this critical order:

1. **Security Headers** (`helmet`) - First line of defense
2. **Request Timeout** - Prevents hanging requests
3. **Compression** - Response optimization
4. **Body Parsing** - With size limits
5. **Input Sanitization** - Clean malicious input
6. **CORS** - Cross-origin configuration
7. **Logging** - Request tracking
8. **Rate Limiting** - Traffic control
9. **Application Routes** - Business logic
10. **404 Handler** - Unmatched routes
11. **Error Handler** - Global error catching

## 🔧 Configuration

### Environment Variables
| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 3000 |
| `NODE_ENV` | Environment | development |
| `MONGO_URI` | MongoDB connection string | Required |
| `REDIS_HOST` | Redis server host | localhost |
| `JWT_SECRET` | JWT signing secret | Required |
| `CORS_ORIGIN` | Allowed CORS origins | * |

### Rate Limiting
- **Default**: 100 requests per 15 minutes
- **Configurable**: Via environment variables
- **Redis Backed**: Distributed across instances

## 🧪 Development

### Available Scripts
```bash
npm start          # Start the application
npm run dev        # Development with nodemon (if configured)
npm run benchmark  # Run performance benchmarks
```

### Adding New Routes
1. Create controller in `src/controllers/`
2. Define routes in `src/routes/`
3. Add route to `src/app.js`
4. Apply appropriate middleware

### Adding New Middleware
1. Create middleware file in `src/middleware/`
2. Export middleware function
3. Import and use in `src/app.js`
4. Ensure proper execution order

## 🚀 Production Deployment

### Pre-deployment Checklist
- [ ] Set `NODE_ENV=production`
- [ ] Configure secure `JWT_SECRET`
- [ ] Set up MongoDB connection
- [ ] Configure Redis cluster
- [ ] Set appropriate `CORS_ORIGIN`
- [ ] Configure Cloudinary credentials
- [ ] Set up SSL/TLS certificates
- [ ] Configure reverse proxy (Nginx)
- [ ] Set up monitoring and alerts

### Docker Production
```bash
# Build production image
docker build -t express-starter:prod .

# Run with production environment
docker run -d \
  --name express-starter-prod \
  -p 3000:3000 \
  --env-file .env.production \
  express-starter:prod
```

## 📈 Performance Considerations

- **Response Compression**: 60-80% bandwidth reduction
- **Redis Caching**: Fast session and data storage
- **Connection Pooling**: MongoDB connection optimization
- **Request Timeouts**: Prevents resource exhaustion
- **Body Size Limits**: DoS protection
- **Consistent Hashing**: Efficient Redis distribution

## 🐛 Troubleshooting

### Common Issues
1. **MongoDB Connection**: Check `MONGO_URI` format
2. **Redis Connection**: Verify Redis server status
3. **JWT Errors**: Ensure `JWT_SECRET` is set
4. **CORS Issues**: Check `CORS_ORIGIN` configuration
5. **File Upload Fails**: Verify Cloudinary credentials

### Health Check
Visit `http://localhost:3000/health` to verify server status.

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

---

**Built with ❤️ for production-ready Express.js applications**