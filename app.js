const express = require('express');
const session = require('express-session');
const Database = require('better-sqlite3');
const SQLiteStore = require('better-sqlite3-session-store')(session);
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const path = require('path');

// Import routes
const authRoutes = require('./src/routes/auth.routes');
const userRoutes = require('./src/routes/user.routes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src', 'views')); 
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

// Session configuration
app.use(session({
  store: new SQLiteStore({
    client: new Database('sessions.db'),
    expired: {
      clear: true,
      intervalMs: 900000 // limpa sessões expiradas a cada 15min
    }
  }),
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 24 * 60 * 60 * 1000 }
}));

app.use(authRoutes); // Authentication routes
app.use(userRoutes); // User routes

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});