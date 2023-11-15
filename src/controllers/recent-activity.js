const recentActivityModel = require("../models/recent-activity");

exports.addRecentActivity = async (req, res) => {
  const newRecentActivity = new recentActivityModel.RecentActivity({
    course_id: req.body.course_id,
    user_id: req.body.user_id,
    currentLessonIndex: req.body.currentLessonIndex,
    dateLastActivity:new Date(),
  });
  try {
    const createdRecentActivity = await newRecentActivity.save();
    return res.json(createdRecentActivity);
  } catch (e) {
    console.log(e.message);
    return res.send("Recent Activity not created")
  }
};

exports.editRecentActivity= async (req, res) => {
    try {
      const recentActivity = await recentActivityModel.RecentActivity.findOneAndUpdate(
        {
          user_id: req.query.userId,
          course_id: req.query.courseId,
        },
        { $set: req.body }, //{rating}
        { new: true }
      );
      return res.json(recentActivity);
    } catch (err) {
      res.status(500).send(err.message);
    }
  };

exports.deleteRecentActivity = async (req, res) => {
  try {
    await recentActivityModel.RecentActivity.deleteOne({
      user_id: req.query.userId,
      course_id: req.query.courseId,
    });
    return res.send("ok");
  } catch (err) {
    res.status(500).send(err.message);
  }
};
