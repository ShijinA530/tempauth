// Import Mongoose module
const mongoose = require('mongoose');

// Define candidate schema
const candidateSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    middleName: String,
    lastName: {
        type: String,
        required: true
    },
    department: String,
    electionType: String,
    party: String
});

// Create Candidate model from schema
const Candidate = mongoose.model('Candidate', candidateSchema);

// Export Candidate model
module.exports = Candidate;
