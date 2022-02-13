const express = require("express");

const authenticator = require("../middleware/check-userAuth");
const extractFile = require("../middleware/file-validator");

const PostsController = require("./controllers/posts-controller");

const router = express.Router();


router.post("", authenticator, extractFile, PostsController.createPost);

router.get("", PostsController.fetchAllPosts);

router.get("/:id", PostsController.getSelPost);

router.delete("/:postId", authenticator, PostsController.deletePost);

router.put("/:id", authenticator, extractFile, PostsController.updatePost);

module.exports = router;