import express from 'express';
import passport from 'passport';
import { insertGame, getGames, getTeams } from '../lib/db.js';

export const adminRouter = express.Router();

async function indexRoute(req, res) {
  return res.render('login', {
    title: 'Innskráning',
  });
}

async function adminRoute(req, res) {
  const games = await getGames();
  games.sort((a, b) => new Date(b.date) - new Date(a.date));

  const user = req.user || null;
  const loggedIn = req.isAuthenticated();

  return res.render('admin', {
    user,
    games,
    loggedIn,
  });
}

function ensureLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  return res.redirect('/login');
}

async function skraRoute(req, res) {
  const teams = await getTeams();

  return res.render('skra', {
    title: 'Skrá leik',
    teams,
    error: null,
  });
}

const logoutRoute = (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error(err);
    }
    return res.redirect('/');
  });
};

async function skraRouteInsert(req, res) {
  const teams = await getTeams();
  const { DATE, HOME_ID, AWAY_ID, HOME_SCORE, AWAY_SCORE } = req.body;

  const currentDate = new Date();
  const gameDate = new Date(DATE);
  const dateTwoMonthsAgo = new Date();
  dateTwoMonthsAgo.setMonth(dateTwoMonthsAgo.getMonth() - 2);

  if (gameDate > currentDate || gameDate < dateTwoMonthsAgo) {
    return res.render('skra', {
      title: 'Skrá leik',
      teams,
      error: 'Dagsetningar mega ekki vera meira en tveggja mánaðar gamlar og ekki í framtíðinni.',
    });
  }
  const homeScore = parseInt(HOME_SCORE, 10);
  const awayScore = parseInt(AWAY_SCORE, 10);

  if (Number.isNaN(homeScore) || homeScore < 0 || Number.isNaN(awayScore) || awayScore < 0) {
    return res.render('skra', {
      title: 'Skrá leik',
      teams,
      error: 'Stig verða að vera jákvæð heiltala eða 0.',
    });
  }

  insertGame(DATE, HOME_ID, HOME_SCORE, AWAY_ID, AWAY_SCORE);
  return res.redirect('/admin');
}

adminRouter.get('/login', indexRoute);
adminRouter.get('/admin', ensureLoggedIn, adminRoute);
adminRouter.get('/skra', ensureLoggedIn, skraRoute);
adminRouter.post('/skra', skraRouteInsert);
adminRouter.post('/logout', logoutRoute);

adminRouter.post(
  '/login',
  passport.authenticate('local', {
    failureMessage: 'Notandanafn eða lykilorð rangt.',
    failureRedirect: '/login',
  }),
  (req, res) => {
    res.redirect('/admin');
  },
);
