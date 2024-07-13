import Post from "../models/post-model.js";
import User from "../models/user-model.js";

export const createPost = async (req, res) => {
  const { userId, book, author, genre, review, cover, rating } = req.body;
  const newPost = new Post({
    userId,
    book,
    author,
    genre,
    review,
    cover,
    rating,
  });

  try {
    await newPost.save();
    const user = await User.findById(userId)
    user.posts.push(newPost._id)
    await user.save()
    return res.status(200).json({ message: "Post Created successfully" });
  } catch(err) {
    return res.status(505).json({ message: "Internal Server Error",err});
  }
};

export const updatePost = async (req, res) => {
  const { postId, userId, book, author, genre, review, cover, rating  } = req.body;
  console.log(postId)
  let post;
  try {
    post = await Post.findOneAndUpdate({_id:postId, userId}, {
      book,
      author,
      genre,
      review,
      cover,
      rating,
    });
    console.log(post)
  } catch(err) {
    return res.status(500).json({ message: "Internal Server Error",err });
  }

  if (!post) {
    return res.status(500).json({ message: "Failed to update post" });
  }
  return res.status(200).json({ message: "Post Updated successfully" });
};

export const deletePost = async (req, res) => {
  const postId = req.params.postId;
  const {userId} = req.body
  try {
    const post = await Post.findOneAndDelete({_id: postId, userId: userId});
    console.log(post);
    return res.status(200).json({ message: "Post Deleted Successfully!!" });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Internal server Error", error: err });
  }
};

export const getPosts = async (req, res) => {
  try {
    const allPosts = await Post.find().populate("userId");
    return res.status(200).json({ posts: allPosts });
  } catch {
    return res.status(404).json({ message: "Couldn't Find posts" });
  }
};

export const loggedUserPosts = async (req, res) => {
  const loggedUserId = req.params.userId;
  try {
    const posts = await Post.find({ userId: loggedUserId });
    return res.status(200).json({ posts: posts });
  } catch (err) {
    return res.status(404).json({ message: "Couldn't Find posts", error: err });
  }
};


export const getSinglePost = async (req, res) => {
  const postId = req.params.postId;
  let post;
  try {
     post = await Post.findById(postId);
    console.log(post);
    return res.status(200).json({ post: post });
  } catch (err) {
    return res.status(404).json({ message: "Couldn't Find post", error: err });
  }
};

export const likePost = async (req, res) => {
  console.log(req.body);
  const { userId, postId } = req.body;

  try {
    let post = await Post.findById(postId);

    if (post.likes.includes(userId)) {
      post = await Post.findByIdAndUpdate(
        postId,
        { $pull: { likes: userId } },
        { new: true }
      );
      return res.status(200).json({ dislikes: post.dislikes, likes: post.likes });
    } else {
      if (post.dislikes.includes(userId)) {
        post = await Post.findByIdAndUpdate(
          postId,
          { $pull: { dislikes: userId } },
          { new: true }
        );
      }
      post = await Post.findByIdAndUpdate(
        postId,
        { $push: { likes: userId } },
        { new: true },
      );
      return res.status(200).json({ dislikes: post.dislikes, likes: post.likes });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const dislikePost = async (req, res) => {
  const { userId, postId } = req.body;

  try {
    let post = await Post.findById(postId);

    if (post.dislikes.includes(userId)) {
      post = await Post.findByIdAndUpdate(
        postId,
        { $pull: { dislikes: userId } },
        { new: true },
      );
      return res.status(200).json({ dislikes: post.dislikes, likes: post.likes });
    } else {
      if (post.likes.includes(userId)) {
        post = await Post.findByIdAndUpdate(
          postId,
          { $pull: { likes: userId } },
          { new: true }
        );
      }
      post = await Post.findByIdAndUpdate(
        postId,
        { $push: { dislikes: userId } },
        { new: true }
      );
      return res.status(200).json({ dislikes: post.dislikes, likes: post.likes });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};


export const allUsers = async(req, res) => {
  try{
    const allUsers = await User.find().populate("posts")
    return res.status(200).json({allUsers})
  }catch{
    return res.status(404).json({ message: "Internal Server Error" });
  }

}

// export const rating = async(req, res) => {

// }
