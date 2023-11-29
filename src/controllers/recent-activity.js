const recentActivityModel = require("../models/recent-activity");
const lessonController = require("../../src/controllers/lessons");

exports.addRecentActivity = async (req, res) => {
  let newRecentActivity = new recentActivityModel.RecentActivity({
    course_id: req.body.course_id,
    user_id: req.body.user_id,
    currentLessonIndex: req.body.currentLessonIndex,
    dateLastActivity: new Date(),
  });
  try {
    await newRecentActivity.save();
    newRecentActivity = await newRecentActivity.populate("course_id");
    return res.json(newRecentActivity);
  } catch (e) {
    return res.send("Recent Activity not created");
  }
};

exports.getRecentActivity = async (req, res) => {
  try {
    const recentActivity = await recentActivityModel.RecentActivity.find({
      user_id: req.params.id,
    })
      .populate("course_id")
      .limit(req.query.limit);
    const parsedRecentActivity = [];
    for (const courseEnrolled of recentActivity) {
      const courseLength = 10;
      let progress = courseEnrolled.currentLessonIndex / courseLength;
      parsedRecentActivity.push({
        ...courseEnrolled._doc,
        progress,
      });
    }
    return res.json(parsedRecentActivity);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.editRecentActivity = async (req, res) => {
  try {
    const recentActivity =
      await recentActivityModel.RecentActivity.findOneAndUpdate(
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
    const deletedRecentActivity =
      await recentActivityModel.RecentActivity.findOneAndDelete(
        {
          user_id: req.query.userId,
          course_id: req.query.courseId,
        },
        { new: true }
      );
    return res.json(deletedRecentActivity);
  } catch (err) {
    res.status(500).send(err.message);
  }
};
