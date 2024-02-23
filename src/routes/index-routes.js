import express from 'express';
import { getGames } from '../lib/db.js';
import { calculateStandings } from '../lib/score.js';

export const indexRouter = express.Router();

async function indexRoute(req, res) {
  return res.render('index', {
    title: 'Forsíða',
    time: new Date().toISOString(),
  });
}

async function leikirRoute(req, res) {
  const games = await getGames();
  games.sort((a, b) => new Date(b.date) - new Date(a.date));

  return res.render('leikir', {
    title: 'Leikir',
    games,
    time: new Date().toISOString(),
  });
}

async function stadaRoute(req, res) {
  const games = await getGames();
  const standings = await calculateStandings(games);
  const standingsArray=Object.entries(standings).map(([team, points]) => ({ team, points }));
  standingsArray.sort((a,b) => b.points - a.points);

  return res.render('stada', {
    title: 'Staðan',
    standingsArray,
  });
}

indexRouter.get('/', indexRoute);
indexRouter.get('/leikir', leikirRoute);
indexRouter.get('/stada', stadaRoute);
