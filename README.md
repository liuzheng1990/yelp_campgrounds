# Yelp Campgrounds

A Node.js web application using Express and MongoDB for managing campground listings.

## Setup

1. Install dependencies:
   ```
npm install
   ```
2. Create a `.env` file with your MongoDB URI and other secrets.
3. Start the server:
   ```
npm start
   ```

## Folder Structure
- `models/` - Mongoose models
- `routes/` - Express route handlers
- `views/` - View templates (EJS)
- `public/` - Static assets

## Environment Variables
- `MONGODB_URI` - MongoDB connection string
- `PORT` - Server port
- `SESSION_SECRET` - Session secret key