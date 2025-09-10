const express = require('express');
const router = express.Router();
const controller = require('../controllers/tournament.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Protect all routes - any authenticated user
router.use(authMiddleware);

router.post('/', controller.createTournament);
router.get('/', controller.listTournaments);
router.post('/:tournamentId/players', controller.addPlayers);
router.post('/:tournamentId/teams', controller.addTeams);

router.get('/:tournamentId/teams', controller.getTeamsWithPoints);

router.post('/:tournamentId/umpires', controller.addUmpires);
router.post('/:tournamentId/match', controller.addMatchResult);

module.exports = router;
