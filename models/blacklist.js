
const { default: mongoose } = require('mongoose');

const blacklistSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    token: { type: String, required: true }
  },
  {
    timestamps: true,
  }
);

let Blacklist;
try {
  Blacklist = mongoose.model('Blacklist');
} catch (e) {
  Blacklist = mongoose.model('Blacklist', blacklistSchema);
}

module.exports = Blacklist;
