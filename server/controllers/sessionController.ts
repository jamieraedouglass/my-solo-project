// import Session from '../models/sessionModel.ts';
// import type { RequestHandler } from 'express';

// interface SessionController {
//   isLoggedIn: RequestHandler;
//   startSession: RequestHandler;
// }

// const sessionController: SessionController = {
//   isLoggedIn: async (req, res, next) => {
//     try {
//       const ssid = req.cookies?.ssid;
//       if (!ssid) return res.redirect('/login');

//       const session = await Session.findOne({ cookieId: ssid });
//       if (!session) return res.redirect('/login');

//       res.locals.isLoggedIn = true;
//       return next();
//     } catch (err) {
//       return next(err);
//     }
//   },

//   startSession: async (req, res, next) => {
//     try {
//       const cookieId =
//         res.locals.user?._id?.toString?.() ??
//         res.locals.userID ??
//         req.cookies?.ssid;

//       if (!cookieId) return next();

//       let session = await Session.findOne({ cookieId });
//       if (!session) {
//         session = await Session.create({ cookieId });
//       }

//       res.locals.session = session;

//       res.cookie('ssid', cookieId, {
//         httpOnly: true,
//         secure: process.env.NODE_ENV === 'production',
//         sameSite: 'lax',
//       });

//       return next();
//     } catch (err) {
//       return next(err);
//     }
//   },
// };

// export default sessionController;
// server/controllers/sessionController.ts
import type { RequestHandler } from 'express';
import Session from '../models/sessionModel.ts';

const sessionController = {
  isLoggedIn: (async (req, res, next) => {
    try {
      const ssid = req.cookies?.ssid;
      if (!ssid) return res.status(401).json({ error: 'Not logged in' });

      const session = await Session.findOne({ cookieId: ssid }); // cookieId (lowercase d)
      if (!session) return res.status(401).json({ error: 'Not logged in' });

      res.locals.isLoggedIn = true;
      return next();
    } catch (err) {
      return next(err);
    }
  }) as RequestHandler,

  startSession: (async (req, res, next) => {
    try {
      const userId = res.locals.user?._id?.toString?.(); // MUST come from verifyUser
      if (!userId)
        return res.status(500).json({ error: 'No user id to start session' });

      let session = await Session.findOne({ cookieId: userId });
      if (!session) session = await Session.create({ cookieId: userId });

      res.locals.session = session;

      // 👇 important attributes for dev
      res.cookie('ssid', userId, {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production', // false in dev
        path: '/', // 👈 ensure cookie is visible to /api/*
      });

      return next();
    } catch (err) {
      return next(err);
    }
  }) as RequestHandler,
};

export default sessionController;
