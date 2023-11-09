const recentActivityModel = require("../models/recent-activity");

exports.addRating = async (req, res) => {
  const newRating = new ratingModel.Rating({
    user_id: req.body.user_id,
    course_id: req.body.course_id,
    rating: req.body.rating,
  });
  try {
    const createdRating = await newRating.save();
    return res.json(createdRating);
  } catch (e) {
    console.log(e.message);
    return res.send("Rating not created");
  }
};

exports.editRating = async (req, res) => {
  try {
    const rating = await ratingModel.Rating.findOneAndUpdate(
      {
        user_id: req.query.userId,
        course_id: req.query.courseId,
      },
      { $set: req.body }, //{rating}
      { new: true }
    );
    return res.json(rating);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.deleteRating = async (req, res) => {
  try {
    await ratingModel.Rating.deleteOne({
      user_id: req.query.userId,
      course_id: req.query.courseId,
    });
    return res.send("ok");
  } catch (err) {
    res.status(500).send(err.message);
  }
};
