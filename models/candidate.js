const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema({
    candidateID: {
        type:String
    },
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

// Define pre-save middleware to auto-increment candidateID
// candidateSchema.pre('save', async function(next) {
//     try {
//         if (!this.isNew) { // If it's not a new candidate, exit middleware
//             return next();
//         }

//         const count = await this.constructor.countDocuments();

//         this.candidateID = count;

//         next();
//     } catch (error) {
//         next(error);
//     }
// });



const Candidate = mongoose.model('Candidate', candidateSchema);


module.exports = Candidate;
