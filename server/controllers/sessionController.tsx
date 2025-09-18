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
      if (!ssid) {
        return res.redirect('/signup');
      }
      const session = await Session.findOne({ cookieID: ssid });
      if (!session) {
        return res.redirect('/signup');
      }
      res.locals.isLoggedIn = true;
      return next();
    } catch (err) {
      next(err);
    }
  },

  startSession: async (req, res, next) => {
    try {
      const cookieId =
        res.locals.user?._id?.toString?.() ??
        res.locals.userID ??
        req.cookies?.ssid;
      if (!cookieId) return next();
      const existing = await Session.findOne({ cookieId });
      if (existing) {
        res.locals.session = existing;
        return next;
      }
      const newSession = await Session.create({ cookieId });
      res.locals.session = newSession;
      return next();
    } catch (err) {
      return next(err);
    }
  },
};

export default sessionController;
