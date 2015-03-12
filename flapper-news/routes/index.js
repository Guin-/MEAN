var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Post = mongoose.model('Post');
var Comment = mongoose.model('Comment');

/* GET home page. */
router.get('/', function(req, res, next) {
/*  res.render('index', { title: 'Express' }); */
    res.render('index');
});

/* GET posts page */
router.get('/posts', function(req, res, next) {
    Post.find(function(err, posts){
        if(err){ return next(err); }
        res.json(posts);
    });
});

/* POST new post */
router.post('/posts', function(req, res, next){
    var post = new Post(req.body);
    post.save(function(err, post){
        if(err){ return next(err); }
        res.json(post);
    });
});

/* Pre-loading Post Objects using Express param() */
router.param('post', function(req, res, next, id){
    var query = Post.findById(id);

    query.exec(function(err,post){
        if(err){ return next(err); }
        if(!post){ return next(new Error('can\'t find post')); }

        req.post = post;
        return next();
    });
});

/* GET single post page */
router.get('/posts/:post', function(req, res, next){
    req.post.populate('comments', function(err, post){
        if(err) { return next(err); }
        res.json(post);
    });
});

/* PUT upvote a post */
router.put('/posts/:post/upvote', function(req, res, next){
    req.post.upvote(function(err, post){
        if(err){ return next(err); }

        res.json(post);
    });
});

/* POST /posts/:id/comments - add a new comment to a post by ID*/

router.post('/posts/:post/comments', function(req, res, next){
    var comment = new Comment(req.body);
    comment.post = req.post;

    comment.save(function(err, comment){
        if(err){return next(err); }

        req.post.comments.push(comment);
        req.post.save(function(err, post){
            if(err){return next(err); }

            res.json(comment);
        });
    });
});

/*PUT /posts/:id/comments/:id/upvote - upvote a comment */
/* /posts/:post/comments/:comment/upvote */

router.param('comment', function(req, res, next, id){
    var query = Comment.findById(id);

    query.exec(function(err, comment){
        if(err){ return next(err); }
        if(!comment){ return next(new Error('can\'t find comment')); }

        req.comment = comment;
        return next();
    });
});



router.put('/posts/:post/comments/:comment/upvote', function(req, res, next){
    req.comment.upvote(function(err, comment){
        if(err){ return next(err); }
        res.json(comment);
    });
});



module.exports = router;
