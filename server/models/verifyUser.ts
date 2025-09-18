import { RequestHandler } from 'express';

const verifyUser: RequestHandler = async (req, res, next) => {
  try {
    const { email, password } = req.body as {
      email?: string;
      password?: string;
    };
    if (!email || !password) {
      return res.status(400).json({ error: 'Missing credentials' });
    }

    // Select the passwordHash since it's hidden by default
    const user = await User.findOne({ email }).select('+passwordHash');
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    // Use your instance method
    const ok = await user.validatePassword(password);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

    // hand off to startSession
    res.locals.user = user;
    return next();
  } catch (err) {
    return next(err);
  }
};
