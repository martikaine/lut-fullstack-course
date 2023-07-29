# Blurp

The next generation social media platform.

## How to run it

Prerequisite: MongoDB must be running in the default port (27017). You can change the MongoDB url in `backend/config/database.ts` if needed.

Then run the following in order:

```
cd frontend
npm i
ng build

cd ../backend
npm i
npm run dev
```

Application starts now on `localhost:3000`. Alternatively, you can `ng serve` the frontend while the backend is running on port 3000, and use the application from `localhost:4200`.
