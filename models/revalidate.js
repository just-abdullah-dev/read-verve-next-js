const { default: mongoose } = require("mongoose");

  const revalidateSchema = new mongoose.Schema(
    { 
      revalidate: { type: Boolean, required: true }, 
    }
  );


let Revalidate;
try {
  // Try to retrieve the model if it's already registered
  Revalidate = mongoose.model('revalidate');
} catch (e) {
  // If the model is not registered, create it
  Revalidate = mongoose.model('revalidate', revalidateSchema);
}


module.exports = Revalidate;
