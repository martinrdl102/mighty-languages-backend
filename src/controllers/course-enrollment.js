const courseEnrollmentModel = require("../models/course-enrollment");
const lessonModel = require("../models/lessons");

exports.addCourseEnrollment = async (req, res) => {
  try {
    let enrollment = await courseEnrollmentModel.CourseEnrollment.findOne({
      user: req.body.userId,
      course: req.body.courseId,
    });
    if (enrollment) {
      enrollment =
        await courseEnrollmentModel.CourseEnrollment.findOneAndUpdate(
          {
            user: req.body.userId,
            course: req.body.courseId,
          },
          {
            $set: {
              isActive: true,
              dateLastActivity: new Date(),
            },
          },
          { new: true }
        )
          .populate("course")
          .populate("currentLesson");
    } else {
      const numberOfLessons = await lessonModel.Lesson.find({
        course: req.body.courseId,
      }).count();
      const newCourseEnrollment = new courseEnrollmentModel.CourseEnrollment({
        user: req.body.userId,
        course: req.body.courseId,
        finishedLessonsIds: [],
        currentLesson: req.body.lessonId,
        numberOfLessons,
        isActive: true,
        isCompleted: false,
        dateLastActivity: new Date(),
      });
      await newCourseEnrollment.save();
      newCourseEnrollment = await newCourseEnrollment.populate("course");
      return res.json(newCourseEnrollment);
    }
    return res.json(enrollment);
  } catch (e) {
    return res.send("Course Enrollment not created");
  }
};

exports.setCurrentLesson = async (req, res) => {
  try {
    const courseEnrollment =
      await courseEnrollmentModel.CourseEnrollment.findOneAndUpdate(
        {
          user: req.body.userId,
          course: req.body.courseId,
        },
        {
          $set: {
            currentLesson: req.body.lessonId,
            dateLastActivity: new Date(),
          },
        },
        { new: true }
      )
        .populate("course")
        .populate("currentLesson");
    return res.json(courseEnrollment);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.addFinishedLesson = async (req, res) => {
  try {
    let currentEnrollment =
      await courseEnrollmentModel.CourseEnrollment.findOne({
        user: req.body.userId,
        course: req.body.courseId,
      });
    let finishedLessonsIds = currentEnrollment.finishedLessonsIds;
    if (!finishedLessonsIds.includes(req.body.lessonId)) {
      finishedLessonsIds.push(req.body.lessonId);
      let updatedCourseEnrollment =
        await courseEnrollmentModel.CourseEnrollment.findOneAndUpdate(
          {
            user: req.body.userId,
            course: req.body.courseId,
          },
          { $set: { finishedLessonsIds, dateLastActivity: new Date() } },
          { new: true }
        )
          .populate("course")
          .populate("currentLesson");
      const courseLength = await lessonModel.Lesson.find({
        course: req.body.courseId,
      }).count();
      if (finishedLessonsIds.length === courseLength) {
        updatedCourseEnrollment = completeCourse({
          user: req.body.userId,
          course: req.body.courseId,
        });
      }
      return res.json(updatedCourseEnrollment);
    }
    return res.json(currentEnrollment);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const completeCourse = async ({ user, course }) => {
  try {
    const courseEnrollment =
      await courseEnrollmentModel.CourseEnrollment.findOneAndUpdate(
        { user, course },
        { $set: { isCompleted: true, dateLastActivity: new Date() } },
        { new: true }
      ).populate("course");
    return courseEnrollment;
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.leaveCourse = async (req, res) => {
  try {
    const courseEnrollment =
      await courseEnrollmentModel.CourseEnrollment.findOneAndUpdate(
        {
          user: req.body.userId,
          course: req.body.courseId,
        },
        {
          $set: {
            isActive: false,
            dateLastActivity: new Date(),
          },
        },
        { new: true }
      ).populate("course");
    return res.json(courseEnrollment);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.getCourseEnrollments = async (req, res) => {
  try {
    const courseEnrollments = await courseEnrollmentModel.CourseEnrollment.find(
      { user: req.params.user_id, isActive: true }
    )
      .populate("course")
      .populate("currentLesson");
    return res.json(courseEnrollments);
  } catch (err) {
    res.status(500).send(err.message);
  }
};
