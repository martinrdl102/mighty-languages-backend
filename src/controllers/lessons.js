const lessonModel = require("../models/lessons");
const commentModel = require("../models/comments");
const courseEnrollmentModel = require("../models/course-enrollment");
const questionModel = require("../models/questions");

exports.postLesson = async (req, res) => {
  const courseLength = await lessonModel.Lesson.find({
    course: req.body.courseId,
  }).count();

  const newLesson = new lessonModel.Lesson({
    title: req.body.title,
    videos: req.body.videos,
    course: req.body.courseId,
    isQuizActive: false,
    index: courseLength,
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
    const lessons = await lessonModel.Lesson.find({
      course: req.params.id,
    })
      .sort({ index: 1 })
      .populate("course");
    return res.json(lessons);
  } catch (err) {
    console.log(err);
    res.status(500).send(err.message);
  }
};

const parseLesson = async (lesson) => {
  const prevLesson = await lessonModel.Lesson.findOne({
    course: lesson._doc.course,
    index: lesson._doc.index - 1,
  });
  const nextLesson = await lessonModel.Lesson.findOne({
    course: lesson._doc.course,
    index: lesson._doc.index + 1,
  });

  return {
    ...lesson._doc,
    prevLesson: prevLesson?._id,
    nextLesson: nextLesson?._id,
  };
};

exports.getLesson = async (req, res) => {
  try {
    const lesson = await lessonModel.Lesson.findById(req.params.id).populate(
      "course"
    );
    const parsedLesson = await parseLesson(lesson);
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
    )
      .sort({ index: 1 })
      .populate("course");
    const parsedLesson = await parseLesson(lesson);
    return res.json(parsedLesson);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.changeLessonIndex = async (req, res) => {
  const draggingLessonIndex = req.body.draggingLessonIndex;
  const targetLessonIndex = req.body.targetLessonIndex;

  if (draggingLessonIndex > targetLessonIndex) {
    await lessonModel.Lesson.updateMany(
      {
        course: req.body.courseId,
        index: { $gte: targetLessonIndex, $lt: draggingLessonIndex },
      },
      { $inc: { index: 1 } }
    );
  } else {
    await lessonModel.Lesson.updateMany(
      {
        course: req.body.courseId,
        index: { $lte: targetLessonIndex, $gt: draggingLessonIndex },
      },
      { $inc: { index: -1 } }
    );
  }
  await lessonModel.Lesson.findOneAndUpdate(
    {
      course: req.body.courseId,
      index: draggingLessonIndex,
    },
    {
      $set: { index: targetLessonIndex },
    },
    { new: true }
  );
  const lessonsList = await lessonModel.Lesson.find({
    course: req.body.courseId,
  })
    .sort({ index: 1 })
    .populate("course");
  return res.json(lessonsList);
};

const deleteLessonFromEnrollments = async (lesson) => {
  const newNumOfLessons = await lessonModel.Lesson.find({
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
    { $set: { numberOfLessons: newNumOfLessons } }
  );
  const newCurrentLesson = await lessonModel.Lesson.findOne({
    course: lesson.course,
  });
  await courseEnrollmentModel.CourseEnrollment.updateMany(
    { currentLesson: lesson._id },
    { $set: { currentLesson: newCurrentLesson._id } }
  );
};

exports.deleteLesson = async (req, res) => {
  try {
    const lesson = await lessonModel.Lesson.findById(req.params.id);
    const deletedLesson = await lessonModel.Lesson.findByIdAndDelete(
      req.params.id
    );
    await commentModel.Comment.deleteMany({ lessonId: req.params.id });
    await questionModel.Question.deleteMany({ lesson: req.params.id });
    deleteLessonFromEnrollments(lesson);

    await lessonModel.Lesson.updateMany(
      { index: { $gt: lesson.index } },
      { $set: { $inc: { index: -1 } } }
    );
    return res.json(deletedLesson);
  } catch (err) {
    res.status(500).send(err.message);
  }
};
