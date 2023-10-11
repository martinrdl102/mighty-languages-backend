const lessonModel = require("../models/lessons");
const commentModel = require("../models/comments");

exports.postLesson = async (req, res) => {
  const newLesson = new lessonModel.Lesson({
    title: req.body.title,
    videos: req.body.videos,
    course_id: req.body.course_id,
  });
  try {
    const createdLesson = await newLesson.save();

    return res.json(createdLesson);
  } catch (e) {
    console.log(e.message);
    return res.send("Lesson not created");
  }
};

exports.getLessonsFromCourseId = async (req, res) => {
  try {
    const lessons = await lessonModel.Lesson.find({ course_id: req.params.id });
    return res.json(lessons);
  } catch (err) {
    console.log(err);
    res.status(500).send(err.message);
  }
};

exports.getLesson = async (req, res) => {
  try {
    const lesson = await lessonModel.Lesson.findById(req.params.id);
    return res.json(lesson);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.updateLesson = async (req, res) => {
  try {
    const lesson = await lessonModel.Lesson.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    return res.json(lesson);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.deleteLesson = async (req, res) => {
  try {
    const lesson = await lessonModel.Lesson.findByIdAndDelete(req.params.id);
    await commentModel.Comment.deleteMany({ lesson_id: req.params.id });
    return res.json(lesson);
  } catch (err) {
    res.status(500).send(err.message);
  }
};
