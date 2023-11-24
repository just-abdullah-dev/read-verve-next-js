const { default: mongoose } = require("mongoose");

  const categorySchema = new mongoose.Schema(
    { 
      name: { type: String, required: true }, 
      slug: { type: String, unique: true }, 
    },
    { timestamps: true }
  );


let Category;
try {
  Category = mongoose.model('Category');
} catch (e) {
  Category = mongoose.model('Category', categorySchema);
}


module.exports = Category;
