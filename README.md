<div align="center">

# Dancely Backend System

### The robust RESTful API powering the next-generation social video platform for dancers.

</div>

<br />

## Introduction
This document provides a comprehensive overview of the Dancely backend system, a RESTful API server for a video streaming platform with social networking capabilities. Dancely enables users to upload, manage, and share dance videos while engaging through **likes**, **comments**, **follows**, and **community posts**. The platform implements a complete authentication system, media storage integration, and real-time social interaction features.

## Project Resources

| Resource | URL |
| :--- | :--- |
| **Live Application** | https://www.dancely.in |
| **Documentation** | https://docs.dancely.in |
| **System Status** | https://stats.uptimerobot.com/cmOjvPimbc |
| **Swagger API Reference** | https://api.dancely.in/api/v1/docs |
| **Frontend Repository** | https://github.com/sourav6563/dancely-frontend |
| **Database ERD** | https://app.eraser.io/workspace/HiohxqmgH1LXubmwzeWW?diagram=pvt-YmUzuW7YbJOMwJOUg |

## Demo Credentials
Use the following credentials to access the demo account:

**Email**
```
dancelydemo@gmail.com
```

**Password**
```
Dancely@3900
```

---

## System Capabilities

Dancely provides a comprehensive suite of features organized into distinct functional domains:

| Domain | Capabilities | Primary Routes |
| :--- | :--- | :--- |
| **Authentication** | User registration, email verification, login/logout, password reset, token refresh | `/api/v1/auth/*` |
| **User Management** | Profile management, bio updates, avatar/cover image, user search, watch history | `/api/v1/user/*` |
| **Video Platform** | Video upload (MP4), thumbnail management, CRUD operations, view tracking, publishing control | `/api/v1/video/*` |
| **Social Engagement** | Like/unlike videos/comments/posts, toggle-based interaction | `/api/v1/like/*` |
| **Comments** | Comment on videos and community posts, CRUD operations, ownership validation | `/api/v1/comment/*` |
| **Followers** | Follow/unfollow users, retrieve follower/following lists with pagination | `/api/v1/follower/*` |
| **Community** | Create and manage text-based posts, community feed aggregation | `/api/v1/communitypost/*` |
| **Playlists** | Create video collections, add/remove videos, playlist management | `/api/v1/playlist/*` |
| **Analytics** | Dashboard statistics: total videos, views, followers, likes aggregation | `/api/v1/dashboard/*` |

---

## Technology Stack

### Core Runtime and Framework
*   **Framework**: Express 5.2.1 application server running on Node.js with TypeScript compilation

### Key Dependencies

| Category | Library | Purpose |
| :--- | :--- | :--- |
| **Database** | `mongoose` | MongoDB ODM with schema validation |
| | `mongoose-aggregate-paginate-v2` | Pagination for aggregation queries |
| **Authentication** | `jsonwebtoken` | JWT token generation/verification |
| | `bcrypt` | Password hashing (10 rounds) |
| **Security** | `helmet` | HTTP security headers |
| | `express-rate-limit` | Request rate limiting (1000/15min) |
| | `cors` | Cross-origin resource sharing |
| **File Handling** | `multer` | Multipart form-data parsing |
| | `cloudinary` | Media storage and CDN |
| **Email** | `resend` | Transactional email service |
| **Logging** | `winston` | Structured logging |
| | `winston-daily-rotate-file` | Log rotation |
| | `morgan` | HTTP request logging |
| **Validation** | `zod` | Schema validation |
| **Documentation** | `swagger-jsdoc` | OpenAPI spec generation |
| | `swagger-ui-express` | Interactive API docs |

---

## System Architecture Layers

### High-Level Layer Structure

#### Middleware Pipeline Configuration
The Express application configures middleware in a specific order to ensure proper request processing:

1.  **Trust Proxy**: Enables proxy support for rate limiting and IP detection
2.  **CORS**: Configures allowed origins, methods, and headers from environment
3.  **Rate Limiting**: Applies 1000 requests per 15 minutes limit to `/api` routes
4.  **Helmet**: Sets security HTTP headers
5.  **Morgan**: Logs HTTP requests in JSON format to Winston logger
6.  **Static Files**: Serves files from `public/` directory
7.  **Body Parsers**: JSON and URL-encoded data with 16KB limit
8.  **Cookie Parser**: Parses cookies for session management

### Core Data Models and Relationships
#### Entity Relationship Overview

![Database ERD](public/image/dancely-erd.png)

[View Interactive ERD](https://app.eraser.io/workspace/HiohxqmgH1LXubmwzeWW?diagram=pvt-YmUzuW7YbJOMwJOUg)

#### Key Relationships:
*   **User-Video**: One-to-many relationship where `Video.owner` references `User._id`
*   **Polymorphic Likes**: `Like` model can reference `Video`, `Comment`, or `CommunityPost` via conditional foreign keys
*   **Polymorphic Comments**: `Comment` can belong to either `Video` or `CommunityPost`
*   **Bidirectional Follow**: `Follow.follower` and `Follow.following` both reference `User._id`
*   **Many-to-Many Playlists**: `Playlist.videos` array contains multiple `Video._id` references
*   **Watch History**: Embedded array in `User.watchHistory` tracking viewed videos

---

## Security Implementation

### Security Layers

| Layer | Implementation | Configuration |
| :--- | :--- | :--- |
| **Transport Security** | HTTPS-only cookies in production | `secure: env.NODE_ENV === 'production'` |
| **CORS Protection** | Allowed origins, methods, headers | `app` file configuration |
| **Rate Limiting** | 1000 requests per 15 minutes per IP | `app` file configuration |
| **HTTP Headers** | Helmet middleware (XSS, clickjacking, etc.) | `app` file configuration |
| **Authentication** | JWT tokens with HTTP-only cookies | `authenticate` middleware |
| **Authorization** | Ownership validation in controllers | Resource-specific checks |
| **Password Security** | bcrypt hashing with 10 rounds | Salt generation per password |
| **Input Validation** | Zod schemas for request bodies | Type-safe validation |
| **File Upload Limits** | 100MB video, 5MB thumbnail | Multer configuration |
| **Session Management** | Refresh token rotation, revocation | Stored in `User` model |

---

## API Documentation

The system provides interactive API documentation through Swagger UI:

*   **Endpoint**: `/api/v1/docs`
*   **Specification**: OpenAPI 3.0 format
*   **Generation**: `swagger-jsdoc` from inline JSDoc comments
*   **UI**: `swagger-ui-express` for browser-based testing

All API routes follow RESTful conventions with versioned paths (`/api/v1/*`). For comprehensive API documentation, see [API Documentation](https://api.dancely.in/api/v1/docs).

---

## Database Connection Management

### MongoDB Atlas with Mongoose Setup in Node.js
*   **Connection String**: Use the MongoDB Atlas connection string from environment variables
*   **Mongoose Configuration**: Connect to MongoDB Atlas using Mongoose
*   **Schema Definition**: Define schemas using Mongoose models
*   **Connection Handling**: Manage connection events and errors

---

## External Service Integration

### Service Architecture

#### Cloudinary Integration:
*   **Purpose**: Cloud-based media storage and CDN delivery
*   **Uploads**: Videos (MP4), thumbnails, profile images
*   **Return Data**: `secure_url` (CDN URL), `public_id` (asset identifier)
*   **Security**: Use secure URLs for viewing and `public_id` for deleting items

#### Resend Integration:
*   **Purpose**: Transactional email delivery
*   **Use Cases**: Email verification codes, password reset codes
*   **Configuration**: API key and sender address from environment variables
*   **Sender Address**: All outgoing emails use `noreply@mail.dancely.in` as the sender address.

---

## Logging and Observability

### Logging Architecture
#### Logging Configuration:
*   **Transport Layer**: Winston with daily log rotation
*   **HTTP Logging**: Morgan middleware pipes to Winston
*   **Log Format**: JSON-structured logs with method, URL, status, response time
*   **Rotation**: Daily log files with automatic archival
*   **Log Levels**: Error, info, debug for different severity levels

### System Health Monitoring
The application provides a health check endpoint for monitoring:
*   **Route**: `/health`
*   **Handler**: `healthCheckRouter`
*   **Purpose**: Check if the server is available and working properly
*   **Use Case**: Used for load balancer health checks and uptime monitoring

Also, check the [System Status](https://stats.uptimerobot.com/cmOjvPimbc) for real-time monitoring.

---

## Getting Started

### Prerequisites
*   Node.js (v18+ recommended)
*   pnpm
*   MongoDB instance

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/sourav6563/dancely-backend.git
    cd dancely-backend
    ```

2.  **Install dependencies**
    ```bash
    pnpm install
    ```

3.  **Configure environment variables**
    Create a `.env` file in the root directory:
    ```env
    NODE_ENV=development
    PORT=8000
    MONGODB_URI=mongodb+srv://...
    JWT_ACCESS_SECRET=your_secret
    CLOUDINARY_CLOUD_NAME=your_cloud_name
    RESEND_API_KEY=your_resend_key
    # ... see full list in Configuration section
    ```

4.  **Start Development Server**
    ```bash
    pnpm run dev
    ```

5.  **Build for production**
    ```bash
    pnpm run build
    pnpm start
    ```

---

## Configuration

The application requires the following environment variables to be defined in a `.env` file in the root directory:

| Variable | Description |
| :--- | :--- |
| `NODE_ENV` | Environment mode (`development`, `production`, `test`) |
| `PORT` | Server listening port |
| `MONGODB_URI` | Connection string for MongoDB |
| `DB_MIN_POOL_SIZE` | Minimum database connection pool size |
| `DB_MAX_POOL_SIZE` | Maximum database connection pool size |
| `JWT_ACCESS_SECRET` | Secret key for access tokens |
| `JWT_ACCESS_EXPIRY` | Expiration time for access tokens |
| `JWT_REFRESH_SECRET` | Secret key for refresh tokens |
| `JWT_REFRESH_EXPIRY` | Expiration time for refresh tokens |
| `CORS_ORIGIN` | Allowed origin for CORS |
| `BASE_URL` | Base URL of the API |
| `CLOUDINARY_CLOUD_NAME`| Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET`| Cloudinary API secret |
| `RESEND_API_KEY` | API key for Resend email service |
| `EMAIL_FROM` | Sender email address |
| `COOKIE_DOMAIN` | (Optional) Domain for cookie scoping |
