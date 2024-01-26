const lessonModel = require("../models/lessons");
const commentModel = require("../models/comments");

exports.postLesson = async (req, res) => {
  const newLesson = new lessonModel.Lesson({
    title: req.body.title,
    videos: req.body.videos,
    course: req.body.courseId,
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
    const lessons = await lessonModel.Lesson.find({ course: req.params.id });
    return res.json(lessons);
  } catch (err) {
    console.log(err);
    res.status(500).send(err.message);
  }
};

exports.getLesson = async (req, res) => {
  try {
    const lesson = await lessonModel.Lesson.findById(req.params.id).populate(
      "course"
    );
    const prevLesson = await lessonModel.Lesson.find({
      _id: { $lt: req.params.id },
      course: lesson._doc.course,
    })
      .sort({ _id: -1 })
      .limit(1);
    const nextLesson = await lessonModel.Lesson.find({
      _id: { $gt: req.params.id },
      course: lesson._doc.course,
    })
      .sort({ _id: 1 })
      .limit(1);

    const courseLessons = await lessonModel.Lesson.find({
      course: lesson._doc.course,
    });
    const parsedLesson = {
      ...lesson._doc,
      prevLesson: prevLesson[0]?._id,
      nextLesson: nextLesson[0]?._id,
      index: courseLessons.findIndex((elem) => {
        return elem._id.toString() === req.params.id;
      }),
    };
    return res.json(parsedLesson);
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
