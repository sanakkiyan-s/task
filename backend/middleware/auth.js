const jwt = require('jsonwebtoken');
const supabase = require('../config/supabase');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      throw new Error();
    }

    // 1. Try verify with Supabase
    const { data: { user: supabaseUser }, error: supabaseError } = await supabase.auth.getUser(token);

    if (supabaseUser && !supabaseError) {
      // Find or create local user to maintain foreign key relationships
      let user = await User.findOne({ where: { email: supabaseUser.email } });

      if (!user) {
        // Create user if not exists
        // Note: Password is dummy since they use OAuth. 
        // We use a random string that can't be guessed.
        user = await User.create({
          name: supabaseUser.user_metadata?.full_name || supabaseUser.email?.split('@')[0] || 'User',
          email: supabaseUser.email,
          password: Math.random().toString(36).slice(-10) + Math.random().toString(36).slice(-10)
        });
      }

      req.user = user;
      req.token = token;
      return next();
    }

    // 2. Fallback to Local JWT (for legacy/dev testing without Supabase)
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findByPk(decoded.id);

      if (user) {
        req.user = user;
        req.token = token;
        return next();
      }
    } catch (jwtError) {
      // Ignore JWT error, will throw final error below
    }

    throw new Error();
  } catch (error) {
    console.error('Auth Middleware Error:', error.message);
    res.status(401).json({ error: 'Please authenticate' });
  }
};

module.exports = auth;