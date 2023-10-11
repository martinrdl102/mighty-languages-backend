const feedbackModel = require("../models/feedback");

exports.addFeedback = async (req, res) => {
  const newFeedback = new feedbackModel.Feedback({
    user_id: req.body.user_id,
    comment_id: req.body.comment_id,
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
        user_id: req.query.userId,
        comment_id: req.query.commentId,
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
      user_id: req.query.userId,
      comment_id: req.query.commentId,
    });
    return res.send("ok");
  } catch (err) {
    res.status(500).send(err.message);
  }
};
