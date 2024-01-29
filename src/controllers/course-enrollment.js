const courseEnrollmentModel = require("../models/course-enrollment");

exports.addCourseEnrollment = async (req, res) => {
  try {
    const newCourseEnrollment = new courseEnrollmentModel.CourseEnrollment({
      user: req.body.userId,
      course: req.body.courseId,
      finishedLessonsIds: [],
      currentLesson: req.body.lessonId,
      isActive: true,
      isCompleted: false,
      dateLastActivity: new Date(),
    });
    await newCourseEnrollment.save();
    return res.json(newCourseEnrollment);
  } catch (e) {
    return res.send("Course Enrollment not created");
  }
};

exports.editCourseEnrollment = async (req, res) => {
  try {
    const courseEnrollment =
      await courseEnrollmentModel.CourseEnrollment.findOneAndUpdate(
        {
          user: req.query.user_id,
          course: req.query.course_id,
        },
        { $set: { ...req.body, dateLastActivity: new Date() } },
        { new: true }
      );
    return res.json(courseEnrollment);
  } catch (err) {
    res.status(500).send(err.message);
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
        { $set: { currentLesson: req.body.lessonId, dateLastActivity: new Date() } },
        { new: true }
      );
    return res.json(courseEnrollment);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.addFinishedLesson = async (req, res) => {
  try {
    let finishedLessonsIds = (
      await courseEnrollmentModel.CourseEnrollment.findOne({
        user: req.body.userId,
        course: req.body.courseId,
      })
    ).finishedLessonsIds;
    if (!finishedLessonsIds.includes(req.body.lessonId)) {
      finishedLessonsIds.push(req.body.lessonId);
      const courseEnrollment =
        await courseEnrollmentModel.CourseEnrollment.findOneAndUpdate(
          {
            user: req.body.userId,
            course: req.body.courseId,
          },
          { $set: { finishedLessonsIds, dateLastActivity: new Date() } },
          { new: true }
        );
      return res.json(courseEnrollment);
    }

    return res.json(null);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.completeCourse = async (req, res) => {
  try {
    const courseEnrollment =
      await courseEnrollmentModel.CourseEnrollment.findOneAndUpdate(
        {
          user: req.body.userId,
          course: req.body.courseId,
        },
        { $set: { isCompleted: true, dateLastActivity: new Date() } },
        { new: true }
      );
    return res.json(courseEnrollment);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.getCourseEnrollments = async (req, res) => {
  try {
    const courseEnrollments = await courseEnrollmentModel.CourseEnrollment.find(
      { user: req.params.user_id, isCompleted: false }
    ).populate("course");
    return res.json(courseEnrollments);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.getCourseEnrollment = async (req, res) => {
  try {
    const courseEnrollment =
      await courseEnrollmentModel.CourseEnrollment.findOne({
        user: req.query.user_id,
        course: req.query.course_id,
      });
    return res.json(courseEnrollment);
  } catch (err) {
    res.status(500).send(err.message);
  }
};
