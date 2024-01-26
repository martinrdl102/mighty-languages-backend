const ratingModel = require("../models/rating");

exports.addRating = async (req, res) => {
  const newRating = new ratingModel.Rating({
    userId: req.body.userId,
    courseId: req.body.courseId,
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
        userId: req.query.userId,
        courseId: req.query.courseId,
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
      userId: req.query.userId,
      courseId: req.query.courseId,
    });
    return res.send("ok");
  } catch (err) {
    res.status(500).send(err.message);
  }
};
