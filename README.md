# Dancely Backend System

## Overview

Dancely is a **#Platform for Dancers** — a vibrant community where creators can **share their dance videos**, build an audience, and discover incredible performances from around the globe.

Designed specifically for the dance community, Dancely combines high-quality video streaming with powerful social networking features. Whether you're here to **Watch & Learn**, **Share Content**, or **Build Community**, Dancely provides the professional tools you need.

This repository houses the robust RESTful API backend that powers the Dancely ecosystem, ensuring scalability, security, and real-time interaction.

## Table of Contents

- [Overview](#overview)
- [System Architecture](#system-architecture)
- [Technology Stack](#technology-stack)
- [Database Schema](#database-schema)
- [Key Features](#key-features)
- [Getting Started](#getting-started)
- [Configuration](#configuration)
- [API Documentation](#api-documentation)

## System Architecture

The application follows a layered architecture pattern, ensuring separation of concerns and maintainability.

-   **Presentation Layer**: Express.js controllers handling HTTP requests and responses.
-   **Business Logic Layer**: Encapsulated within controllers and specialized utilities to manage application rules.
-   **Data Access Layer**: Mongoose models providing schema validation and database interactions.
-   **Infrastructure Layer**: Integrations with external services like Cloudinary for media storage and Resend for transactional emails.

### Middleware Pipeline

The request processing pipeline is configured to ensure security and efficiency:

1.  **Security Headers**: Implementation of Helmet for secure HTTP headers.
2.  **CORS**: Configured cross-origin resource sharing policies.
3.  **Rate Limiting**: Protection against abuse with request limiting on API routes.
4.  **Logging**: Comprehensive request logging via Morgan and Winston.
5.  **Body Parsing**: JSON and URL-encoded data handling.
6.  **Cookie Parsing**: Secure cookie processing for authentication tokens.

## Technology Stack

The project utilizes a modern TypeScript-based stack:

-   **Runtime**: Node.js
-   **Framework**: Express.js
-   **Language**: TypeScript
-   **Database**: MongoDB (with Mongoose ORM)
-   **Validation**: Zod
-   **Authentication**: JSON Web Tokens (JWT) & Cookies
-   **Storage**: Cloudinary
-   **Email**: Resend
-   **Documentation**: Swagger / OpenAPI

## Database Schema

The core data models interact to support the video and social features. The Entity-Relationship Diagram (ERD) below illustrates the key relationships, including User-Video ownership, polymorphic Likes/Comments, and social connections.

![Database ERD](public/image/dancely-erd.png)

[View original workspace on Eraser.io](https://app.eraser.io/workspace/HiohxqmgH1LXubmwzeWW?origin=share)

## Key Features

-   **Authentication & Security**: Robust user registration, login, and password management using JWTs and secure cookies.
-   **Video Management**: Full CRUD operations for video content, including direct uploads and metadata management.
-   **Social Interactions**:
    -   **Likes**: Polymorphic reaction system for videos, comments, and posts.
    -   **Comments**: Threaded discussions on content.
    -   **Follow System**: Bidirectional user relationships.
-   **Community Engagement**: Community posts for text-based updates and interactions.
-   **Playlists**: User-curated collections of videos.
-   **Dashboard**: Aggregated metrics and analytics for creators.

## Getting Started

### Prerequisites

-   Node.js (v18+ recommended)
-   pnpm
-   MongoDB instance

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/sourav6563/dancely-backend.git
    cd dancely-backend
    ```

2.  Install dependencies:
    ```bash
    pnpm install
    ```

3.  Configure environment variables (see [Configuration](#configuration)).

4.  Start the development server:
    ```bash
    pnpm run dev
    ```

5.  Build for production:
    ```bash
    pnpm run build
    pnpm start
    ```

## Configuration

The application requires the following environment variables to be defined in a `.env` file in the root directory:

| Variable | Description |
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

## API Documentation

The API is fully documented using Swagger/OpenAPI.

-   **Base API URL**: `https://api.dancely.in/api/v1`
-   **Interactive Documentation**: Access the Swagger UI at [`https://api.dancely.in/api/v1/docs`](https://api.dancely.in/api/v1/docs) or locally at `http://localhost:8000/api/v1/docs`.
-   **JSON Specification**: Available at `/docs/json`.

The API endpoints are versioned and prefixed with `/api/v1`.

## Frontend Reference

The frontend for this application is built with Next.js and can be found here:
- **Repository**: [sourav6563/dancely-frontend](https://github.com/sourav6563/dancely-frontend)
