const commentModel = require("../models/comments");
const feedbackModel = require("../models/feedback");
const { Feedback } = require("../models/feedback");

exports.getComments = async (req, res) => {
  try {
    const comments = await commentModel.Comment.find({
      lessonId: req.params.id,
    }).populate("user");
    const parsedComments = [];
    for (const comment of comments) {
      let feedback = false;
      if (req.query.user_id !== "undefined") {
        feedback = await Feedback.findOne({
          userId: req.query.user_id,
          commentId: comment._id,
        });
      }
      const likes = await Feedback.find({
        type: "like",
        commentId: comment._id,
      }).count();
      const dislikes = await Feedback.find({
        type: "dislike",
        commentId: comment._id,
      }).count();
      parsedComments.push({
        ...comment._doc,
        hasFeedback: feedback?.type ? feedback.type : false,
        likes,
        dislikes,
      });
    }
    return res.json(parsedComments);
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

exports.postComment = async (req, res) => {
  let newComment = new commentModel.Comment({
    user: req.body.user,
    comment: req.body.comment,
    lessonId: req.body.lessonId,
  });
  try {
    await newComment.save();
    newComment = await newComment.populate("user");
    return res.json(newComment);
  } catch (e) {
    console.log(e.message);
    return res.send("Comment not created");
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const comment = await commentModel.Comment.findByIdAndDelete(req.params.id);
    await feedbackModel.Feedback.deleteMany({ commentId: req.params.id });
    res.json(comment);
  } catch (error) {
    res.send(error.message);
  }
};

exports.editComment = async (req, res) => {
  try {
    const comment = await commentModel.Comment.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    ).populate("user");
    const feedback = await Feedback.findOne({
      userId: comment.user._id,
      commentId: comment._id,
    });
    const likes = await Feedback.find({
      type: "like",
      commentId: comment._id,
    }).count();
    const dislikes = await Feedback.find({
      type: "dislike",
      commentId: comment._id,
    }).count();
    const commentCopy = {
      ...comment._doc,
      hasFeedback: feedback?.type ? feedback.type : false,
      likes,
      dislikes,
    };
    return res.json(commentCopy);
  } catch (err) {
    res.status(500).send(err.message);
  }
};
