const commentModel = require("../models/comments");
const feedbackModel = require("../models/feedback");
const { Feedback } = require("../models/feedback");

exports.getComments = async (req, res) => {
  try {
    const comments = await commentModel.Comment.find({
      lesson_id: req.params.id,
    }).populate("user");
    const parsedComments = [];
    for (const comment of comments) {
      let feedback = false;
      if (req.query.userId !== "undefined") {
        feedback = await Feedback.findOne({
          user_id: req.query.userId,
          comment_id: comment._id,
        });
      }
      const likes = await Feedback.find({
        type: "like",
        comment_id: comment._id,
      }).count();
      const dislikes = await Feedback.find({
        type: "dislike",
        comment_id: comment._id,
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
    lesson_id: req.body.lesson_id,
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
    await feedbackModel.Feedback.deleteMany({ comment_id: req.params.id });
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
      user_id: comment.user._id,
      comment_id: comment._id,
    });
    const likes = await Feedback.find({
      type: "like",
      comment_id: comment._id,
    }).count();
    const dislikes = await Feedback.find({
      type: "dislike",
      comment_id: comment._id,
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
