const { hash, compare } = require('bcryptjs');
const { sign } = require('jsonwebtoken');
const { default: mongoose } = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    avatar: { type: String, default: '' },
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    verified: { type: Boolean, default: false },
    verificationCode: { type: String, required: false },
    admin: { type: Boolean, default: false },
    author: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await hash(this.password, 10);
  }
  next();
});

userSchema.methods.generateJWT = async function () {
  return sign({ id: this._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

userSchema.methods.comparePassword = async function (enteredPassword) {
  return compare(enteredPassword, this.password);
};

// Create the User model
let User;
try {
  // Try to retrieve the model if it's already registered
  User = mongoose.model('User');
} catch (e) {
  // If the model is not registered, create it
  User = mongoose.model('User', userSchema);
}

module.exports = User;
