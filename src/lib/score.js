/**
 * Calculates points for each team
 *
 * @param games array of games
 * @returns returns a dictionary of team names and they´re points
 * to be inserted into the standings table
 */

export async function calculateStandings(games) {
  const standings = {};
  try {
    for (const game of games) {
      const homeTeam = game.home.name;
      const awayTeam = game.away.name;

      if (!standings[homeTeam]) {
        standings[homeTeam] = 0;
      }
      if (!standings[awayTeam]) {
        standings[awayTeam] = 0;
      }

      if (game.home.score > game.away.score) {
        standings[homeTeam] += 3;
      } else if (game.home.score < game.away.score) {

        standings[awayTeam] += 3;
      } else {

        standings[homeTeam] += 1;
        standings[awayTeam] += 1;
      }
    }
  } catch (e) {
    console.error(e);
  }

  return standings;
}
