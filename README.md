## LLC Formation Portal

A web application for managing LLC formation process, document verification, and EIN issuance.

### Setup Instructions

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with the following variables:
   ```
   JWT_SECRET=your-secret-key
   DATABASE_URL=your-database-url
   DATABASE_AUTH_TOKEN=your-database-token
   FRONTEND_URL=your-frontend-url
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

### Deployment

#### Heroku Deployment Steps:

1. Create a new Heroku app
2. Connect your GitHub repository to Heroku
3. Add the following config vars in Heroku settings:
   - JWT_SECRET
   - DATABASE_URL
   - DATABASE_AUTH_TOKEN
   - FRONTEND_URL
4. Deploy from the GitHub branch

### Features

- Client onboarding
- Document upload and verification
- Company registration tracking
- EIN issuance management
- Admin dashboard
- Status tracking