# YouTube Stream Manager

A continuous livestream management application for YouTube.

## System Requirements

- Node.js 20 or higher
- PostgreSQL database
- FFmpeg for video processing

## Production Configuration

1. Create a Replit project and import this repository
2. Install system dependencies:
   - FFmpeg will be installed automatically

3. Environment Variables Required:
   - Database variables (automatically set by Replit):
     - DATABASE_URL
     - PGUSER
     - PGPASSWORD
     - PGPORT
     - PGHOST
     - PGDATABASE
   
   - YouTube Configuration:
     - Get your YouTube Stream Key from YouTube Studio

4. Build and Start:
   ```bash
   npm run build    # Build the project
   npm start        # Start in production mode
   ```

## Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start development server:
   ```bash
   npm run dev
   ```

## Features

- Video upload and management
- Continuous YouTube livestreaming
- Stream controls (start/stop)
- Real-time stream status
- Analytics dashboard

## Project Structure

- `/client` - React frontend
- `/server` - Express backend
- `/shared` - Shared types and schemas
- `/uploads` - Video storage directory

## Notes

- Make sure your Replit project has enough storage for video uploads
- The application uses FFmpeg for video processing and streaming
- Database migrations are handled automatically through Drizzle
