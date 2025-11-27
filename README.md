# 🔄 Skill-Swap

> A modern peer-to-peer skill exchange platform built with NestJS, TypeORM, and PostgreSQL

[![NestJS](https://img.shields.io/badge/NestJS-11.0-E0234E?logo=nestjs)](https://nestjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql)](https://www.postgresql.org/)
[![TypeORM](https://img.shields.io/badge/TypeORM-0.3-FE0803?logo=typeorm)](https://typeorm.io/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

## 📖 Overview

Skill-Swap is a platform that connects people who want to learn new skills with those who can teach them. Whether you're a developer wanting to learn design, a musician wanting to learn coding, or anyone looking to exchange knowledge - Skill-Swap makes it easy to find the perfect match.

### ✨ Key Features

- 🎯 **Smart Matching Algorithm** - Automatically matches skill offers with requests based on compatibility scores
- 👥 **User Profiles** - Comprehensive profiles with skill portfolios and proficiency levels
- 📅 **Session Scheduling** - Built-in scheduling system with meeting link integration
- 💬 **Real-time Messaging** - In-session chat for seamless communication
- ⭐ **Rating System** - Post-session feedback to build trust and reputation
- 🔍 **Advanced Search** - Filter by skill category, urgency level, and availability
- 🔐 **Secure Authentication** - JWT-based authentication with refresh tokens
- 📊 **Analytics Dashboard** - Track your learning journey and teaching impact

## 🏗️ Architecture

### Tech Stack

- **Backend Framework**: [NestJS](https://nestjs.com/) - Progressive Node.js framework
- **Database**: [PostgreSQL](https://www.postgresql.org/) - Reliable relational database
- **ORM**: [TypeORM](https://typeorm.io/) - TypeScript-first ORM with excellent PostgreSQL support
- **Validation**: [class-validator](https://github.com/typestack/class-validator) - Decorator-based validation
- **Authentication**: JWT (JSON Web Tokens) with refresh token rotation

### Database Schema

The platform uses a well-designed relational schema with 9 core entities:

- **User** - Platform users with authentication and profiles
- **Skill** - Master catalog of skills across 8 categories
- **Userskill** - User skill portfolios with proficiency levels
- **Offer** - Skills users can teach
- **Request** - Skills users want to learn
- **Match** - Connects offers with requests
- **Session** - Scheduled learning sessions
- **Message** - In-session communication
- **Rating** - Post-session feedback

📊 **[View Full Database Schema →](DATABASE_SCHEMA.md)**

### Project Structure

```
skill-swap/
├── src/
│   ├── users/           # User management & authentication
│   ├── skill/           # Skill catalog management
│   ├── userskill/       # User skill portfolios
│   ├── offer/           # Skill teaching offers
│   ├── request/         # Skill learning requests
│   ├── match/           # Matching algorithm & management
│   ├── session/         # Session scheduling & tracking
│   ├── message/         # In-session messaging
│   ├── rating/          # Rating & feedback system
│   └── orm.config.ts    # TypeORM configuration
├── DATABASE_SCHEMA.md   # Complete ERD documentation
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** >= 18.x
- **npm** >= 9.x
- **PostgreSQL** >= 14.x

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/skill-swap.git
   cd skill-swap
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   # Database
   DB_HOST=localhost
   DB_PORT=5432
   DB_USERNAME=your_username
   DB_PASSWORD=your_password
   DB_NAME=skill_swap

   # JWT
   JWT_SECRET=your_jwt_secret_key
   JWT_REFRESH_SECRET=your_refresh_secret_key
   JWT_EXPIRES_IN=15m
   JWT_REFRESH_EXPIRES_IN=7d

   # Application
   PORT=3000
   NODE_ENV=development
   ```

4. **Set up the database**
   ```bash
   # Create PostgreSQL database
   createdb skill_swap

   # Run migrations (TypeORM will auto-sync in development)
   npm run start:dev
   ```

### Running the Application

```bash
# Development mode with hot-reload
npm run start:dev

# Production mode
npm run build
npm run start:prod

# Debug mode
npm run start:debug
```

The API will be available at `http://localhost:3000`

## 📚 API Documentation

### Authentication

```bash
# Register a new user
POST /auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}

# Login
POST /auth/login
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

### Skills Management

```bash
# Add a skill to your profile
POST /userskills
{
  "skillId": "uuid",
  "proficiencyLevel": 3,
  "yearsOfExperience": 2
}

# Create an offer to teach
POST /offers
{
  "skillId": "uuid",
  "description": "I can teach web development basics",
  "availability": "Mon, Wed, Fri 6pm-8pm"
}

# Create a request to learn
POST /requests
{
  "skillId": "uuid",
  "description": "Looking to learn guitar",
  "urgencyLevel": "medium",
  "preferredTimeSlots": "Weekends"
}
```

### Matching & Sessions

```bash
# Get matches for your offers/requests
GET /matches?status=pending

# Accept a match
PATCH /matches/:id/accept

# Schedule a session
POST /sessions
{
  "matchId": "uuid",
  "scheduledAt": "2025-12-01T18:00:00Z",
  "duration": 60,
  "meetingLink": "https://meet.google.com/xyz"
}
```

> 📖 **Full API documentation coming soon with Swagger/OpenAPI**

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## 🛠️ Development

### Code Quality

```bash
# Lint code
npm run lint

# Format code
npm run format
```

### Database Migrations

```bash
# Generate migration from entity changes
npm run typeorm migration:generate -- -n MigrationName

# Run migrations
npm run typeorm migration:run

# Revert last migration
npm run typeorm migration:revert
```

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'Add some amazing feature'`)
4. **Push to the branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

### Contribution Guidelines

- Follow the existing code style (ESLint + Prettier)
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting PR

## 📋 Roadmap

- [ ] Real-time notifications (WebSocket)
- [ ] Video call integration (Zoom/Google Meet API)
- [ ] Advanced matching algorithm with ML
- [ ] Mobile app (React Native)
- [ ] Skill verification system
- [ ] Community forums
- [ ] Gamification (badges, achievements)
- [ ] Multi-language support

## 🐛 Known Issues

- Session reminder notifications not yet implemented
- Bulk operations for offers/requests need optimization
- Search functionality needs full-text search (PostgreSQL FTS)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Your Name** - *Initial work* - [@DGreegman](https://github.com/DGreegman)

## 🙏 Acknowledgments

- Built with [NestJS](https://nestjs.com/)
- Database design inspired by modern marketplace architectures
- Community feedback and contributions

## 📞 Support

- 📧 Email: support@skill-swap.com
- 💬 Discord: [Join our community](https://discord.gg/yourserver)
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/skill-swap/issues)

---

<p align="center">Made with ❤️ by the Skill-Swap community</p>
