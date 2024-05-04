const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  post: { type: String },
  image: { type: String },
  data: {
    type: Date,
    default: Date.now,
  },
  approved: {
    type: Boolean,
    default: false,
  },
  likes: {
    type: Number,
    default: 0,
  },
  dislikes: { type: Number, default: 0 },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  likeby: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],

  dislikeby: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

const Post = mongoose.model("Post", postSchema);
module.exports = Post;
