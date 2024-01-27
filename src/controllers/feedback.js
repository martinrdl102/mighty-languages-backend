const feedbackModel = require("../models/feedback");

exports.addFeedback = async (req, res) => {
  const newFeedback = new feedbackModel.Feedback({
    userId: req.body.userId,
    commentId: req.body.commentId,
    type: req.body.type,
  });
  try {
    const createdFeedback = await newFeedback.save();
    return res.json(createdFeedback);
  } catch (e) {
    console.log(e.message);
    return res.send("Feedback not created");
  }
};

exports.editFeedback = async (req, res) => {
  try {
    const feedback = await feedbackModel.Feedback.findOneAndUpdate(
      {
        userId: req.query.user_id,
        commentId: req.query.comment_id,
      },
      { $set: req.body }, //{type}
      { new: true }
    );
    return res.json(feedback);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.deleteFeedback = async (req, res) => {
  try {
    await feedbackModel.Feedback.deleteOne({
      userId: req.query.user_id,
      commentId: req.query.comment_id,
    });
    return res.send("ok");
  } catch (err) {
    res.status(500).send(err.message);
  }
};
