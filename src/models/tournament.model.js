// const mongoose = require('mongoose');

// const tournamentSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   type: { type: String, enum: ['League', 'Knockout'], default: 'League' },
//   startDate: { type: Date, required: true },
//   endDate: { type: Date, required: true },
//   players: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Player' }],
  
//   createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Track creator

//   umpires: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Umpire' }],
//   matches: [{
//     matchNumber: Number,
//     teamA: [ { type: mongoose.Schema.Types.ObjectId, ref: 'Player' } ],
//     teamB: [ { type: mongoose.Schema.Types.ObjectId, ref: 'Player' } ],
//     scoreA: Number,
//     scoreB: Number,
//     winner: { type: String },
//     stage: { type: String, enum: ['League', 'QuarterFinal', 'SemiFinal', 'Final'], default: 'League' },
//     addedBy: { type: String }
//   }],
//   pointsTable: [{
//     teamName: String,
//     matchesPlayed: Number,
//     wins: Number,
//     losses: Number,
//     points: Number
//   }]
// }, { timestamps: true });

// module.exports = mongoose.model('Tournament', tournamentSchema);


const mongoose = require('mongoose');

const tournamentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ['League', 'Knockout'], default: 'League' },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },

  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Track creator

 teams: [
    {
      teamName: { type: String, required: true },
      playerIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Player' }]
    }
  ],

  players: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Player' }],
  umpires: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Umpire' }],

  matches: [{
    matchNumber: Number,
    teamAName: { type: String, required: true },
    teamBName: { type: String, required: true },
    teamAPlayers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Player' }],
    teamBPlayers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Player' }],
    scoreA: Number,
    scoreB: Number,
    winner: String, // Dynamic team name or 'Draw'
    stage: { type: String, enum: ['League', 'QuarterFinal', 'SemiFinal', 'Final'], default: 'League' },
    addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  }],

  pointsTable: [{
    teamName: String,
    matchesPlayed: Number,
    wins: Number,
    losses: Number,
    points: Number
  }]
}, { timestamps: true });

module.exports = mongoose.model('Tournament', tournamentSchema);
