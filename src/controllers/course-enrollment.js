const courseEnrollmentModel = require("../models/course-enrollment");

exports.addCourseEnrollment = async (req, res) => {
  try {
    const newCourseEnrollment = new courseEnrollmentModel.CourseEnrollment({
      user: req.body.userId,
      course: req.body.courseId,
      finishedLessons: [],
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
          user: req.query.userId,
          course: req.query.courseId,
        },
        { $set: req.body },
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
      { user: req.params.userId, isCompleted: false }
    ).populate("course");
    return res.json(courseEnrollments);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.getCourseEnrollment = async (req, res) => {
  try {
    const courseEnrollment = await courseEnrollmentModel.CourseEnrollment.findOne(
      { user: req.query.userId, course: req.query.courseId }
    );
    return res.json(courseEnrollment);
  } catch (err) {
    res.status(500).send(err.message);
  }
};
