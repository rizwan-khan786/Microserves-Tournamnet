const Tournament = require('../models/tournament.model');
const Player = require('../models/player.model');
const Umpire = require('../models/umpire.model');

// Create Tournament (admin only)
exports.createTournament = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Only admin can create tournaments' });
    }

    const tournament = new Tournament({
      ...req.body,
      createdBy: req.user.id
    });

    await tournament.save();
    res.status(201).json({ success: true, data: tournament });
  } catch (err) {
    next(err);
  }
};

// Add Players
exports.addPlayers = async (req, res, next) => {
  try {
    const { tournamentId } = req.params;
    const { playerIds } = req.body;

    const tournament = await Tournament.findById(tournamentId);
    if (!tournament)
      return res.status(404).json({ success: false, message: 'Tournament not found' });

    // Ensure players array exists
    tournament.players = tournament.players || [];

    // Add players safely, avoiding duplicates
    playerIds.forEach(pid => {
      if (!tournament.players.includes(pid)) {
        tournament.players.push(pid);
      }
    });

    await tournament.save();
    res.json({ success: true, data: tournament });
  } catch (err) {
    next(err);
  }
};


// Add Umpires
exports.addUmpires = async (req, res, next) => {
  try {
    const { tournamentId } = req.params;
    const { umpireIds } = req.body;

    const tournament = await Tournament.findById(tournamentId);
    if (!tournament) return res.status(404).json({ success: false, message: 'Tournament not found' });

    umpireIds.forEach(uid => {
      if (!tournament.umpires.includes(uid)) tournament.umpires.push(uid);
    });

    await tournament.save();
    res.json({ success: true, data: tournament });
  } catch (err) {
    next(err);
  }
};

// Add Match Result
exports.addMatchResult = async (req, res, next) => {
  try {
    const { tournamentId } = req.params;
    const {
      matchNumber,
      teamAName,
      teamBName,
      teamAPlayers,
      teamBPlayers,
      scoreA,
      scoreB,
      stage
    } = req.body;

    const tournament = await Tournament.findById(tournamentId);
    if (!tournament)
      return res.status(404).json({ success: false, message: 'Tournament not found' });

    // Determine winner
    let winner;
    if (scoreA > scoreB) winner = teamAName;
    else if (scoreB > scoreA) winner = teamBName;
    else winner = 'Draw';

    // Add match record
    tournament.matches.push({
      matchNumber,
      teamAName,
      teamBName,
      teamAPlayers,
      teamBPlayers,
      scoreA,
      scoreB,
      winner,
      stage,
      addedBy: req.user._id
    });

    // Ensure both teams exist in pointsTable
    function getOrCreateTeam(teamName) {
      let teamEntry = tournament.pointsTable.find(pt => pt.teamName === teamName);
      if (!teamEntry) {
        teamEntry = { teamName, matchesPlayed: 0, wins: 0, losses: 0, points: 0 };
        tournament.pointsTable.push(teamEntry);
      }
      return teamEntry;
    }

    const teamAEntry = getOrCreateTeam(teamAName);
    const teamBEntry = getOrCreateTeam(teamBName);

    // Update points
    teamAEntry.matchesPlayed += 1;
    teamBEntry.matchesPlayed += 1;

    if (winner === 'Draw') {
      teamAEntry.points += 1;
      teamBEntry.points += 1;
    } else if (winner === teamAName) {
      teamAEntry.wins += 1;
      teamAEntry.points += 2;
      teamBEntry.losses += 1;
    } else {
      teamBEntry.wins += 1;
      teamBEntry.points += 2;
      teamAEntry.losses += 1;
    }

    await tournament.save();
    res.json({ success: true, data: tournament });
  } catch (err) {
    next(err);
  }
};


// Add Teams instead of Players
exports.addTeams = async (req, res, next) => {
  try {
    const { tournamentId } = req.params;
    const { teams } = req.body; // array of { teamName, playerIds }

    if (!teams || !Array.isArray(teams) || teams.length === 0) {
      return res.status(400).json({ success: false, message: 'Teams array is required' });
    }

    const tournament = await Tournament.findById(tournamentId);
    if (!tournament)
      return res.status(404).json({ success: false, message: 'Tournament not found' });

    if (!tournament.teams) tournament.teams = [];

    teams.forEach(team => {
      if (!team.teamName || !Array.isArray(team.playerIds)) return;
      const existingTeam = tournament.teams.find(t => t.teamName === team.teamName);
      if (!existingTeam) {
        tournament.teams.push({ teamName: team.teamName, playerIds: team.playerIds });
      } else {
        // Merge players without duplicates
        team.playerIds.forEach(pid => {
          if (!existingTeam.playerIds.includes(pid)) {
            existingTeam.playerIds.push(pid);
          }
        });
      }
    });

    await tournament.save();
    res.json({ success: true, data: tournament });
  } catch (err) {
    next(err);
  }
};



// List Tournaments
// src/controllers/tournament.controller.js
// src/controllers/tournament.controller.js
exports.listTournaments = async (req, res, next) => {
  try {
    const tournaments = await Tournament.find()
      .populate('players') // Player model
      .populate('umpires'); // Umpire model
    res.json({ success: true, data: tournaments });
  } catch (err) {
    next(err);
  }
};






exports.getTeamsWithPoints = async (req, res, next) => {
  try {
    const tournaments = await Tournament.find()
      .populate('players') // Player model
      .populate('umpires'); // Umpire model

    // Sort the teams array by playerIds for each tournament
    const sortedTournaments = tournaments.map(tournament => {
      const sortedTeams = tournament.teams
        ? tournament.teams.sort((a, b) => {
            // Compare first playerId of each team
            if (!a.playerIds[0]) return -1;
            if (!b.playerIds[0]) return 1;
            return a.playerIds[0].toString().localeCompare(b.playerIds[0].toString());
          })
        : [];
      
      return {
        ...tournament.toObject(),
        teams: sortedTeams
      };
    });

    res.json({ success: true, data: sortedTournaments });
  } catch (err) {
    next(err);
  }
};

