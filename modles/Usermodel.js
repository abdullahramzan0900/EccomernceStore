var mongoose = require("mongoose");
const schema = mongoose.Schema(
    {
      name: { type: String, require: true, unique: true },
      password: { type: String, require: true },
      question: { type: String, require: true },
    },
    { timestamps: true }

    );

    

export default mongoose.model("newusers", schema);