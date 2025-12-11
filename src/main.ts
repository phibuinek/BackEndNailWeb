import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import compression from 'compression';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(compression());
  
  // CORS configuration
  const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:3001',
    'https://nailweb.vercel.app',
    'https://phamnailsupply.vercel.app',
    process.env.FRONTEND_URL,
  ].filter(Boolean);
  
  // Log allowed origins for debugging (only in development)
  if (process.env.NODE_ENV !== 'production') {
    console.log('CORS Allowed Origins:', allowedOrigins);
  }
  
  app.enableCors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, Postman, etc.)
      if (!origin) {
        return callback(null, true);
      }
      
      // Check if origin is in allowed list
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      
      // In development, allow all origins
      if (process.env.NODE_ENV !== 'production') {
        return callback(null, true);
      }
      
      // Reject in production if not in allowed list
      callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });
  
  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
