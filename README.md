# Express Starter Code

A production-ready Express.js starter template with comprehensive security, performance optimization, and scalability features including dual Redis setup with consistent hashing.

## 🚀 Features

- **Security First**: Comprehensive security middleware stack with Helmet, XSS protection, and NoSQL injection prevention
- **Performance Optimized**: Response compression and request optimization
- **Scalable Architecture**: Dual Redis integration with consistent hashing for load distribution
- **File Upload Support**: Cloudinary integration with Multer for profile image uploads
- **Authentication Ready**: JWT-based authentication system with bcrypt password hashing
- **Input Validation**: Joi validation with comprehensive sanitization
- **Error Handling**: Global error handler with Winston logging
- **Rate Limiting**: Express rate limiting (IP-based)
- **Docker Ready**: Complete containerization setup with health checks
- **Health Monitoring**: Built-in health check endpoints

## 📋 Prerequisites

- Node.js 18+ (LTS recommended)
- MongoDB database
- Redis servers (dual setup supported)
- Cloudinary account (for file uploads)

## 🛠️ Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/MonarchRyuzaki/Express-Starter-Code
   cd express-starter-code
   ```
2. **Install dependencies**

   ```bash
   npm install
   ```
3. **Environment Configuration**
   Create a `.env` file in the `src/` directory based on `.env.sample`:

   ```env
   # Database
   MONGO_URI=mongodb://localhost:27017/your-database-name

   # Server Configuration
   PORT=3000

   # Dual Redis Configuration
   REDIS_PASSWORD1=your-redis-password-1
   REDIS_HOST1=your-redis-host-1
   REDIS_PORT1=your-redis-port-1
   REDIS_PASSWORD2=your-redis-password-2
   REDIS_HOST2=your-redis-host-2
   REDIS_PORT2=your-redis-port-2

   # Cloudinary Configuration
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret
   CLOUDINARY_CLOUD_NAME=your-cloud-name

   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key
   ```
4. **Start the application**

   ```bash
   npm start
   ```

## 🐳 Docker Deployment

The project includes a multi-server Docker setup:

1. **Using Docker Compose (Recommended)**

   ```bash
   docker-compose up -d
   ```

   This starts two server instances:

   - Server 1: http://localhost:3001
   - Server 2: http://localhost:3002
2. **Using Docker only**

   ```bash
   docker build -t express-starter .
   docker run -p 3000:3000 express-starter
   ```

## 🏗️ Project Structure

```
├── src/
│   ├── app.js                 # Main application entry point
│   ├── .env                   # Environment variables
│   ├── config/                # Configuration files
│   │   ├── cloudinary.js      # Cloudinary setup with upload utilities
│   │   ├── multer.js          # File upload configuration
│   │   ├── rate-limiter.js    # Rate limiting configuration
│   │   └── redis.js           # Dual Redis connection setup
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
│   │   └── authRoutes.js      # Authentication endpoints
│   └── utils/                 # Utility functions
│       ├── consistentHash.js  # Redis consistent hashing
│       ├── errorHandler.js    # Global error handling
│       └── logger.js          # Winston logging setup
├── benchmark/                 # Performance benchmarking (empty)
├── docker-compose.yml         # Docker Compose configuration
├── Dockerfile                 # Docker container setup
├── .env.sample                # Environment template
└── package.json              # Project dependencies
```

## 🛡️ Security Middleware Stack

### 1. **Security Headers** (`securityMiddleware.js`)

- **Helmet Integration**: Essential HTTP security headers
- **Features**:
  - Content Security Policy (CSP)
  - Cross-Origin Embedder Policy disabled for external resources
  - Default security headers for production readiness
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

- **Express Rate Limit**: IP-based rate limiting
- **Default**: 100 requests per 15 minutes
- **Configurable**: Headers included for client information

## ⚡ Performance Middleware

### 1. **Compression** (`compressionMiddleware.js`)

- **Gzip Compression**: Reduces response size
- **Smart Filtering**: Only compresses responses > 1KB
- **Cache-Control Aware**: Respects no-transform directives
- **Performance Gain**: 60-80% bandwidth reduction

### 2. **Dual Redis with Consistent Hashing** (`consistentHash.js`)

- **Dual Redis Setup**: Two Redis instances for redundancy
- **Consistent Hashing**: MD5-based key distribution
- **Load Balancing**: Even distribution across Redis instances
- **Fault Tolerance**: Automatic failover capability
- **Virtual Nodes**: 10 replicas per server for better distribution

## 🔐 Authentication System

### JWT Implementation

- **Token-Based**: Stateless authentication with 24-hour expiry
- **bcrypt Hashing**: Secure password storage with salt rounds
- **Middleware Protection**: Route-level authentication
- **Validation**: Comprehensive input validation with Joi
- **Security**: Strong password requirements (8+ chars, mixed case, numbers, special chars)

### Available Endpoints

```
POST /api/v1/auth/register              # User registration
POST /api/v1/auth/login                 # User login
PUT  /api/v1/auth/update-profile-image  # Upload profile image (protected)
POST /api/v1/auth/logout                # User logout (protected)
```

### User Model Features

- **Required Fields**: name, username, email, password
- **Validation**: Built-in Mongoose validation
- **Security**: Password field excluded by default from queries
- **Roles**: User/Admin role system
- **Verification**: Email verification status tracking
- **Timestamps**: Automatic creation and update tracking

## 📁 File Upload System

### Cloudinary Integration

- **Multiple Upload Types**: Profile images, post images, thumbnails
- **Smart Configuration**: Different settings per upload type
- **Profile Images**: 500x500px, fill crop, 2MB limit
- **Post Images**: 1200x800px, limit crop, 10MB limit
- **Thumbnails**: 300x200px, fill crop, 1MB limit
- **File Validation**: JPEG, PNG, JPG, WebP support
- **Memory Storage**: Direct upload to Cloudinary via buffer

### Upload Features

- **Automatic Replacement**: Profile images replace previous versions
- **Public ID Management**: User-specific naming convention
- **Error Handling**: Comprehensive upload error management
- **Multiple Deletion**: Batch deletion support
- **Image Optimization**: Automatic quality and format optimization

## 📊 Monitoring & Logging

### Health Check

- **Endpoint**: `GET /health`
- **Provides**: Server status, uptime, timestamp
- **Docker**: Integrated health checks with retry logic

### Logging System

- **Winston Logger**: Structured logging with timestamps
- **Morgan Integration**: HTTP request logging in JSON format
- **Log Levels**: Error, warn, info, debug, http
- **Environment Aware**: Different formats for dev/production
- **Exception Handling**: Automatic logging of unhandled exceptions

## 🚦 Middleware Execution Order

The middleware stack executes in this critical order:

1. **Security Headers** (`helmet`) - First line of defense
2. **Request Timeout** - Prevents hanging requests
3. **Compression** - Response optimization
4. **Body Parsing** - With size limits (10MB)
5. **Input Sanitization** - Clean malicious input
6. **CORS** - Cross-origin configuration
7. **HTTP Logging** - Request tracking with Morgan
8. **Rate Limiting** - Traffic control (100 req/15min)
9. **Health Check** - Server status endpoint
10. **Application Routes** - Business logic
11. **404 Handler** - Unmatched routes
12. **Global Error Handler** - Error catching and logging

## 🔧 Configuration

### Environment Variables

| Variable                  | Description                    | Required           |
| ------------------------- | ------------------------------ | ------------------ |
| `MONGO_URI`             | MongoDB connection string      | Yes                |
| `PORT`                  | Server port                    | No (default: 3000) |
| `REDIS_PASSWORD1`       | First Redis instance password  | Yes                |
| `REDIS_HOST1`           | First Redis instance host      | Yes                |
| `REDIS_PORT1`           | First Redis instance port      | Yes                |
| `REDIS_PASSWORD2`       | Second Redis instance password | Yes                |
| `REDIS_HOST2`           | Second Redis instance host     | Yes                |
| `REDIS_PORT2`           | Second Redis instance port     | Yes                |
| `CLOUDINARY_API_KEY`    | Cloudinary API key             | Yes                |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret          | Yes                |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name          | Yes                |
| `JWT_SECRET`            | JWT signing secret             | Yes                |
| `CORS_ORIGIN`           | Allowed CORS origins           | No (default: *)    |

### Database Configuration

- **MongoDB**: Connection pooling with 10,000 max connections
- **User Schema**: Comprehensive validation and indexing
- **Timestamps**: Automatic createdAt/updatedAt fields

## 🧪 Development

### Available Scripts

```bash
npm start          # Start the application
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
- [ ] Set up MongoDB connection with proper credentials
- [ ] Configure dual Redis instances
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

### Docker Compose Production

The included `docker-compose.yml` sets up:

- Two server instances for load balancing
- Proper environment variable injection
- Restart policies for high availability
- Port mapping for external access

## 📈 Performance Considerations

- **Response Compression**: 60-80% bandwidth reduction
- **Dual Redis**: Distributed caching with consistent hashing
- **Connection Pooling**: MongoDB connection optimization (10K max)
- **Request Timeouts**: 30-second timeout prevents resource exhaustion
- **Body Size Limits**: 10MB limit for DoS protection
- **Consistent Hashing**: Efficient Redis load distribution
- **Memory Storage**: Direct buffer uploads to Cloudinary

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection**: Check `MONGO_URI` format and credentials
2. **Redis Connection**: Verify both Redis instances are accessible
3. **JWT Errors**: Ensure `JWT_SECRET` is set and consistent
4. **CORS Issues**: Check `CORS_ORIGIN` configuration
5. **File Upload Fails**: Verify all Cloudinary credentials
6. **Environment Variables**: Ensure `.env` is in `src/` directory

### Health Check

Visit `http://localhost:3000/health` to verify server status and uptime.

### Docker Health Check

The Dockerfile includes automatic health checks that verify server responsiveness every 30 seconds.

## 📦 Dependencies

### Core Dependencies

- **express**: Web framework
- **mongoose**: MongoDB ODM
- **redis**: Redis client for dual instance setup
- **jsonwebtoken**: JWT authentication
- **bcrypt**: Password hashing
- **joi**: Input validation
- **multer**: File upload handling
- **cloudinary**: Cloud storage service

### Security Dependencies

- **helmet**: Security headers
- **express-mongo-sanitize**: NoSQL injection prevention
- **xss-clean**: XSS attack prevention
- **express-rate-limit**: Rate limiting
- **cors**: Cross-origin resource sharing

### Utility Dependencies

- **winston**: Logging framework
- **morgan**: HTTP request logger
- **compression**: Response compression
- **dotenv**: Environment variable management

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
