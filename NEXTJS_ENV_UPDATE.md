# Next.js Environment Variables Update

## Update your Next.js `.env.local` file

Since you're now using CodeIgniter 3 as your backend, you need to update your Next.js environment variables to point to the new backend:

### Current (Next.js API routes):
```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

### New (CodeIgniter 3 backend):
```env
NEXT_PUBLIC_API_URL=http://localhost/gharwa-backend/api
```

## Complete Environment Variables for Next.js

```env
# MySQL Database Configuration (for reference - not used by frontend)
MYSQL_PASSWORD=993912

# JWT Secret Key (for reference - not used by frontend)
JWT_SECRET=35ce5a33fbbefea240139f7ca8e9eb92f9c9794df7942a8cea5a6275c01837ee

# Application URLs (UPDATED)
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost/gharwa-backend/api

# Database Connection (for reference - not used by frontend)
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_NAME=gharwa_auth
DB_PASSWORD=993912

# Environment
NODE_ENV=development
```

## What Changed

- **`NEXT_PUBLIC_API_URL`**: Changed from `http://localhost:3000/api` to `http://localhost/gharwa-backend/api`
- All other variables remain the same
- Your Next.js frontend will now make API calls to the CodeIgniter 3 backend instead of Next.js API routes

## Testing

1. Update your `.env.local` file
2. Restart your Next.js development server: `npm run dev`
3. Test the application - it should work exactly the same as before
4. Check browser network tab to confirm API calls are going to `http://localhost/gharwa-backend/api`

## Benefits

- ✅ Same functionality, better performance
- ✅ Dedicated PHP backend
- ✅ Easier deployment to shared hosting
- ✅ Better separation of concerns
- ✅ No changes needed to your React components
