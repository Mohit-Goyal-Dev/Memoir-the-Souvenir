const Post = require('../../models/post');

exports.createPost = (req, res, next) => {
    const url = `${req.protocol}://${req.get("host")}`;
    const post = new Post({
        title: req.body.title,
        content: req.body.content,
        imagePath: url + "/images/" + req.file.filename,
        creator: req.userData.userId
    });
    post.save().then(result => {
        res.status(201).json({
            message: 'Post added successfully!',
            postObj: {
                // ...result,
                id: result._id,
                title: result.title,
                content: result.content,
                imagePath: result.imagePath,
                creator: result.creator
            }
        });
    }).catch(error => {
        res.status(500).json({
            message: "Post uploading failed!"
        });
    });
}

exports.fetchAllPosts = (req, res, next) => {
    const pageSize = parseInt(req.query.pageSize);
    const currentPage = parseInt(req.query.currentPageSel);
    let fetchedPosts;
    const postQuery = Post.find();
    if (pageSize && currentPage) {
        postQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
    }
    postQuery.then(docs => {
        fetchedPosts = docs;
        return Post.count();
    }).then(count => {
        res.status(200).json({
            message: "Posts fetched successfully!",
            posts: fetchedPosts,
            totalPosts: count
        });
    }).catch(error => {
        res.status(500).json({
            message: "Fetching posts failed!"
        });
    });
}

exports.getSelPost = (req, res, next) => {
    Post.findById(req.params.id).then(result => {
        if (result) {
            res.status(200).json({
                message: "Fetched Post Successfully!",
                post: result
            })
        } else {
            res.status(404).json({ message: "Post not found!" })
        }
    }).catch(error => {
        res.status(500).json({
            message: "Fetching post failed!"
        });
    });
}

exports.deletePost = (req, res, next) => {
    Post.deleteOne({ _id: req.params.postId, creator: req.userData.userId }).then(response => {
        if (response.deletedCount > 0) {
            res.status(200).json({ message: 'Post deleted!' });
        } else {
            res.status(401).json({ message: "Not Authorized!" })
        }
    }).catch(error => {
        res.status(500).json({
            message: "Post deletion failed!"
        });
    });
}
exports.updatePost = (req, res, next) => {
    //to check if any new file was uploaded or only string is sent from request
    let imagePath = req.body.imagePath;
    if (req.file) {
        const url = `${req.protocol}://${req.get("host")}`;
        imagePath = url + "/images/" + req.file.filename;
    }
    const updatePost = new Post({
        _id: req.params.id,
        title: req.body.title,
        content: req.body.content,
        imagePath: imagePath,
        creator: req.userData.userId
    });
    Post.updateOne({ _id: req.params.id, creator: req.userData.userId }, updatePost).then(result => {
        if (result.matchedCount > 0) {
            // if (result.modifiedCount > 0) {

            res.status(200).json({ message: "Update Successful!" });
        } else {
            res.status(401).json({ message: "Not Authorized!" })
        }
    }).catch(error => {
        res.status(500).json({
            message: "Post update failed!"
        });
    });
}