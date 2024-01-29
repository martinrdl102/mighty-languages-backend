const courseModel = require("../models/courses");
const { Rating } = require("../models/rating");
const ratingModel = require("../models/rating");
const lessonModel = require("../models/lessons");
const { CourseEnrollment } = require("../models/course-enrollment");

exports.getCourses = async (req, res) => {
  try {
    const courses = await courseModel.Course.find(
      req.query.title !== "undefined"
        ? {
            title: { $regex: req.query.title, $options: "i" },
          }
        : {}
    );
    const parsedCourses = [];
    for (const course of courses) {
      // const hasLessons =
        // (await lessonModel.Lesson.findOne({
        //   course: course._id,
        // })) !== null;
      if (/*hasLessons*/ true) {
        let userRating = 0;
        let userEnrollment = false;
        if (req.query.user_id !== "undefined") {
          userRating = await Rating.findOne({
            userId: req.query.user_id,
            courseId: course._id,
          });
          userEnrollment = await CourseEnrollment.find({
            user: req.query.user_id,
            course: course._id,
          });
        }
        const ratings = await Rating.aggregate([
          {
            $match: {
              courseId: course._id,
            },
          },
          {
            $group: {
              _id: null,
              average: { $avg: "$rating" },
            },
          },
        ]);
        parsedCourses.push({
          ...course._doc,
          rating: ratings.length ? ratings[0].average : 0,
          hasRating: userRating ? userRating._doc.rating : 0,
          isUserEnrolled: userEnrollment.length !== 0 ? true : false,
        });
      }
    }
    return res.json(parsedCourses);
  } catch (err) {
    console.log(err);
    res.status(500).send(err.message);
  }
};

exports.postCourse = async (req, res) => {
  const newCourse = new courseModel.Course({
    title: req.body.title,
    description: req.body.description,
    rating: 0,
    imageURL: req.body.imageURL,
    instructor: req.body.instructor,
  });
  try {
    const course = await newCourse.save();
    return res.json(course);
  } catch (e) {
    return res.send("Course not created");
  }
};

exports.getCourse = async (req, res) => {
  try {
    let course = await courseModel.Course.findById(req.params.id);
    let userRating = 0;
    let courseEnrollment = null;
    if (req.query.user_id !== "undefined") {
      userRating = await Rating.findOne({
        userId: req.query.user_id,
        courseId: course._id,
      });
      courseEnrollment = await CourseEnrollment.findOne({
        course: req.params.id,
        user: req.query.user_id,
      });
    }
    const ratings = await Rating.aggregate([
      {
        $match: {
          courseId: course._id,
        },
      },
      {
        $group: {
          _id: null,
          average: { $avg: "$rating" },
        },
      },
    ]);
    course = {
      ...course._doc,
      rating: ratings.length ? ratings[0].average : 0,
      hasRating: userRating ? userRating.rating : 0,
      isUserEnrolled: courseEnrollment?.isActive,
    };
    return res.json(course);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.updateCourse = async (req, res) => {
  try {
    const course = await courseModel.Course.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    const userRating = await Rating.findOne({
      userId: req.query.user_id,
      courseId: course._id,
    });
    const courseRating = await Rating.find({
      courseId: course._id,
    }).count();
    const courseCopy = {
      ...course._doc,
      rating: courseRating,
      hasRating: userRating,
    };
    return res.json(courseCopy);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.deleteCourse = async (req, res) => {
  try {
    const course = await courseModel.Course.findByIdAndDelete(req.params.id);
    await lessonModel.Lesson.deleteMany({ course: req.params.id });
    await ratingModel.Rating.deleteMany({ courseId: req.params.id });
    return res.json(course);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.searchCoursebyName = async (req, res) => {
  try {
    const courses = await courseModel.Course.find({
      title: { $regex: `/${req.query.title}/` },
    });
    return res.json(courses);
  } catch (err) {
    res.status(500).send(err.message);
  }
};
