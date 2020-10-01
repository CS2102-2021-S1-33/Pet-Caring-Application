# Setting Up Backend Server for Local Dev

1. Run: `npm ci`
2. Create a new `.env` file in the backend folder root
3. Create environmental variables for:

```
DATABASE_URL=postgres://{user}:{password}@{hostname}:{port}/{database-name}
SESSION_SECRET={SECRET}
FRONTEND_LOCAL_URL=http://localhost:{PORT}
```

4. Run the sql scripts in the `db` folder - this is to create the neccessary tables
5. Run: `npm run dev` to start the server. If everything is set up correctly, you should see something like `Connected at {PORT}!`.
