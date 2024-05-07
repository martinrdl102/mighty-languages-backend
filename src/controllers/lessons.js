const lessonModel = require("../models/lessons");
const commentModel = require("../models/comments");
const courseEnrollmentModel = require("../models/course-enrollment");
const questionModel = require("../models/questions");

exports.postLesson = async (req, res) => {
  const newLesson = new lessonModel.Lesson({
    title: req.body.title,
    videos: req.body.videos,
    course: req.body.courseId,
    isQuizActive: false,
  });
  try {
    const createdLesson = await newLesson.save();
    const numOfLessonsInCourse = await lessonModel.Lesson.find({
      course: req.body.courseId,
    }).count();
    await courseEnrollmentModel.CourseEnrollment.updateMany(
      { course: req.body.courseId },
      { $set: { numberOfLessons: numOfLessonsInCourse } }
    );
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

const parseLesson = async (lesson) => {
  const prevLesson = await lessonModel.Lesson.find({
    _id: { $lt: lesson._id },
    course: lesson._doc.course,
  })
    .sort({ _id: -1 })
    .limit(1);
  const nextLesson = await lessonModel.Lesson.find({
    _id: { $gt: lesson._id },
    course: lesson._doc.course,
  })
    .sort({ _id: 1 })
    .limit(1);

  const courseLessons = await lessonModel.Lesson.find({
    course: lesson._doc.course,
  });
  return {
    ...lesson._doc,
    prevLesson: prevLesson[0]?._id,
    nextLesson: nextLesson[0]?._id,
    index: courseLessons.findIndex((elem) => {
      return elem._id.toString() === lesson._id.toString();
    }),
  };
};

exports.getLesson = async (req, res) => {
  try {
    const lesson = await lessonModel.Lesson.findById(req.params.id).populate(
      "course"
    );
    const parsedLesson = await parseLesson(lesson);
    console.log(parsedLesson);
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
    ).populate("course");
    const parsedLesson = await parseLesson(lesson);
    return res.json(parsedLesson);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.deleteLesson = async (req, res) => {
  try {
    const lesson = await lessonModel.Lesson.findById(req.params.id);
    const deletedLesson = await lessonModel.Lesson.findByIdAndDelete(
      req.params.id
    );
    await commentModel.Comment.deleteMany({ lessonId: req.params.id });
    await questionModel.Question.deleteMany({ lesson: req.params.id });
    const numOfLessonsInCourse = await lessonModel.Lesson.find({
      course: lesson.course,
    }).count();
    const enrollments = await courseEnrollmentModel.CourseEnrollment.find({
      course: lesson.course,
    });
    for (const enrollment of enrollments) {
      if (enrollment.finishedLessonsIds.includes(lesson._id)) {
        const foundIndex = (elem) => elem.toString() === lesson._id.toString();
        const i = enrollment.finishedLessonsIds.findIndex(foundIndex);
        const updatedFinishedLessonsIds = [
          ...enrollment.finishedLessonsIds.slice(0, i),
          ...enrollment.finishedLessonsIds.slice(i + 1),
        ];
        await courseEnrollmentModel.CourseEnrollment.findByIdAndUpdate(
          enrollment._id,
          { $set: { finishedLessonsIds: updatedFinishedLessonsIds } }
        );
      }
    }
    await courseEnrollmentModel.CourseEnrollment.updateMany(
      { course: lesson.course },
      { $set: { numberOfLessons: numOfLessonsInCourse } }
    );
    const newCurrentLesson = await lessonModel.Lesson.findOne({
      course: lesson.course,
    });
    await courseEnrollmentModel.CourseEnrollment.updateMany(
      { currentLesson: lesson._id },
      { $set: { currentLesson: newCurrentLesson._id } }
    );
    return res.json(deletedLesson);
  } catch (err) {
    res.status(500).send(err.message);
  }
};
