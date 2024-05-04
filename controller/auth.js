const Post = require("../model/post");
const User = require("../model/user");

const signup = async (req, res) => {
  const { name, password, email, number, image } = req.body;
  let user = new User({ name, password, email, number, image });

  try {
    const userName = await User.findOne({ name });
    if (userName) {
      return res.status(400).json("User already exists");
    }
    let newUser = await user.save();
    user.newUser = undefined;
    return res.status(201).json(newUser);
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "enternal server error" });
  }
};

const login = (req, res) => {
  const { name, password } = req.body;
  User.findOne({ name })
    .then(async (user) => {
      if (!user) return res.status(400).send("Invalid username or Password");

      const validPass = await User.findOne({ password });
      if (!validPass) return res.status(400).send("Invalid Password");
      user.password = undefined;
      if (validPass) return res.status(200).send(user);
    })
    .catch((err) => {
      console.log(err);
    });
};
const post = async (req, res) => {
  const { image, postText } = req.body;
  const userNew = await User.findOne({ name: req.params.name });
  if (!userNew) return res.status(400).json("No user found");
  let postData = await Post.create({
    post: postText,
    image,
    user: userNew._id,
  });
  try {
    userNew.posts.push(postData._id);
    await userNew.save();
    return res.status(200).json(postData);
  } catch (error) {
    res.status(500).json({ success: false, message: "enternal server error" });
  }
};

const getPostbyUserName = async (req, res) => {
  try {
    const userData = await User.findOne({ name: req.params.id }).populate(
      "posts"
    );
    if (!userData)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    await userData.save();
    return res.status(200).json(userData);
  } catch (error) {
    return res.status(500).json({ success: false, message: "server error" });
  }
};

const updatePostbyid = async (req, res) => {
  const id = req.params.id;
  const update = await Post.findByIdAndUpdate(
    id,
    { post: req.body.postText, image: req.body.image, approved: false },
    { new: true }
  );

  if (!update) return res.status(404).json({ message: "No user found" });
  await update.save();
  return res.status(200).json(update);
};

const deletePostbyid = async (req, res) => {
  const id = req.params.id;
  const userId = req.params.userId;
  try {
    const user = await User.findById(userId);
    await Post.findByIdAndDelete(id);
    user.posts.pull(id);
    await user.save();
    return res
      .status(200)
      .json({ success: true, message: "Post deleted successfully" });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "There was a problem deleting the post",
    });
  }
};

const alluserPost = async (req, res) => {
  const user = await User.find({ name: { $ne: req.params.name } })
    .sort({ createdAt: -1 })
    .populate("posts");
  return res.status(200).json(user);
};

const getPostbyId = async (req, res) => {
  try {
    const post = await Post.findOne({ _id: req.params.id });
    if (!post)
      return res.status(404).json({ message: "The post is not available." });
    res.status(200).json(post);
  } catch (error) {
    console.log(error);
  }
};

const adminData = async (req, res) => {
  const user = await User.find().populate("posts");
  return res.status(200).json(user);
};

const adminApproved = async (req, res) => {
  const id = req.params.id;
  const update = await Post.findByIdAndUpdate(
    id,
    { approved: true },
    { new: true }
  );
  if (!update) return res.status(404).json({ message: "No user found" });
  await update.save();
  return res.status(200).json(update);
};

const postlikes = async (req, res) => {
  const postId = req.params.postId;
  const userId = req.params.userId;
  try {
    const postData = await Post.findById(postId);
    if (!postData) return res.status(400).json({ message: "Post not found" });
    await User.findById(userId);
    if (postData.likeby.includes(userId)) {
      return res.status(200).json({ message: "User already liked this post" });
    }

    if (postData.dislikeby.includes(userId)) {
      postData.dislikeby.pull(userId);
      postData.dislikes -= 1;
    }
    postData.likeby.push(userId);
    postData.likes += 1;

    await postData.save();
    return res.status(200).json(postData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const postDislikes = async (req, res) => {
  const postId = req.params.postId;
  const userId = req.params.userId;
  try {
    const postData = await Post.findById(postId);
    if (!postData) return res.status(400).json({ message: "Post not found" });
    await User.findById(userId);
    if (postData.dislikeby.includes(userId)) {
      return res
        .status(200)
        .json({ message: "User already disliked this post" });
    }
    if (postData.likeby.includes(userId)) {
      postData.likeby.pull(userId);
      postData.likes -= 1;
    }
    postData.dislikeby.push(userId);
    postData.dislikes += 1;
    await postData.save();
    return res.status(200).json(postData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getLikePostbyusers = async (req, res) => {
  const postId = req.params.postId;
  const users = await Post.findById(postId)
    .sort({ likeby: -1 })
    .populate("likeby");

  res.status(200).json(users);
};
const getdisLikePostbyusers = async (req, res) => {
  const postId = req.params.postId;
  const users = await Post.findById(postId).populate("dislikeby");

  res.status(200).json(users);
};

module.exports = {
  signup,
  login,
  post,
  getPostbyUserName,
  alluserPost,
  deletePostbyid,
  updatePostbyid,
  getPostbyId,
  adminData,
  adminApproved,
  postlikes,
  postDislikes,
  getLikePostbyusers,
  getdisLikePostbyusers,
};
