// // server/middleware/verifyUser.ts
// import type { RequestHandler } from 'express';

// // (optional) type res.locals.user so TS is happy
// declare module 'express-serve-static-core' {
//   interface Locals {
//     user?: { _id: string; email: string };
//   }
// }

// const verifyUser: RequestHandler = async (req, res, next) => {
//   const raw = req.body as { email?: string; password?: string };

//   // Debug: see exactly what's arriving (remove later)
//   console.log('[verifyUser] body:', raw);

//   const email = raw.email?.trim().toLowerCase();
//   const password = raw.password?.trim();

//   if (!email || !password) {
//     return res.status(400).json({ error: 'Missing credentials' });
//   }

//   // Hardcoded dev creds
//   const DEV_EMAIL = 'test@example.com';
//   const DEV_PASSWORD = 'password';

//   if (email === DEV_EMAIL && password === DEV_PASSWORD) {
//     res.locals.user = { _id: 'dev-user', email: DEV_EMAIL };
//     return next();
//   }

//   return res.status(401).json({ error: 'Invalid credentials' });
// };

// export default verifyUser;
import type { RequestHandler } from 'express';

const verifyUser: RequestHandler = async (req, res, next) => {
  const raw = req.body as { email?: string; password?: string };
  console.log('[verifyUser] body:', raw); // debug

  const email = raw.email?.trim().toLowerCase();
  const password = raw.password?.trim();
  if (!email || !password)
    return res.status(400).json({ error: 'Missing credentials' });

  const DEV_EMAIL = 'test@example.com';
  const DEV_PASSWORD = 'password';

  if (email === DEV_EMAIL && password === DEV_PASSWORD) {
    res.locals.user = { _id: 'dev-user', email: DEV_EMAIL }; // used by startSession
    return next();
  }
  return res.status(401).json({ error: 'Invalid credentials' });
};

export default verifyUser;
