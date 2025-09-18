import Session from '../models/sessionModel.ts';
import type { RequestHandler } from 'express';

interface SessionController {
  isLoggedIn: RequestHandler;
  startSession: RequestHandler;
}

const sessionController: SessionController = {
  isLoggedIn: async (req, res, next) => {
    try {
      const ssid = req.cookies?.ssid;
      if (!ssid) return res.redirect('/login');

      const session = await Session.findOne({ cookieId: ssid });
      if (!session) return res.redirect('/login');

      res.locals.isLoggedIn = true;
      return next();
    } catch (err) {
      return next(err);
    }
  },

  startSession: async (req, res, next) => {
    try {
      const cookieId =
        res.locals.user?._id?.toString?.() ??
        res.locals.userID ??
        req.cookies?.ssid;

      if (!cookieId) return next();

      let session = await Session.findOne({ cookieId });
      if (!session) {
        session = await Session.create({ cookieId });
      }

      res.locals.session = session;

      res.cookie('ssid', cookieId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
      });

      return next();
    } catch (err) {
      return next(err);
    }
  },
};

export default sessionController;
