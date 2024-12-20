const express = require("express");
const router = express.Router();
const Post = require("../models/posts");
const Author = require("../models/author");

//create new post
router.post("/create-post", async (req, res) => {
  try {
    const post = new Post({
      title: req.body.title,
      summary: req.body.summary,
      content: req.body.content,
      author: req.body.author,
    });
    await post.save();

    req.session.message = {
      type: "success",
      message: "Post created successfully",
    };
    res.redirect("/");
  } catch (err) {
    res.json({ message: err.message, type: "danger" });
  }
});

//select all post (display)
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find().populate("author").sort({ date: -1 });
    res.render("home", { title: "All Posts", posts: posts });
  } catch (err) {
    res.json({ message: err.message });
  }
});

//edit form
router.get("/edit/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const post = await Post.findById(id);
    const authors = await Author.find();

    if (!post) {
      return res.redirect("/");
    }

    res.render("update-post", {
      title: "Edit Post",
      post: post,
      authors: authors,
    });
  } catch (err) {
    console.error("Error fetching post:", err);
    res.redirect("/");
  }
});

router.get("/detail/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const post = await Post.findById(id).populate("author");

    if (!post) {
      return res.redirect("/");
    }

    res.render("detail-post", {
      title: "Post detail",
      post: post,
    });
  } catch (err) {
    console.error("Error fetching post:", err);
    res.redirect("/");
  }
})

//update
router.post("/update/:id", async (req, res) => {
  const id = req.params.id;
  try {
    await Post.findByIdAndUpdate(id, {
      title: req.body.title,
      summary: req.body.summary,
      content: req.body.content,
      author: req.body.author,
      date: Date.now(),
    });
    req.session.message = {
      type: "success",
      message: "Post updated successfully!",
    };
    res.redirect("/");
  } catch (err) {
    res.json({ message: err.message, type: "danger" });
  }
});

//go to create post form
router.get("/new-post", async (req, res) => {
  try {
    const authors = await Author.find();
    res.render("new", { title: "Add New Post!", authors: authors });
  } catch (err) {
    res.json({ message: err.message, type: "danger" });
  }
});

//delete
router.get("/delete/:id", async (req, res) => {
  const id = req.params.id;
  try {
    await Post.findByIdAndDelete(id);
    req.session.message = {
      type: "success",
      message: "Post deleted successfully",
    };
    res.redirect("/");
  } catch (err) {
    res.json({ message: err.message });
  }
});

module.exports = router;
