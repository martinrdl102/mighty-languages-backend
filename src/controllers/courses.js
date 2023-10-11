const courseModel = require("../models/courses");
const { Rating } = require("../models/rating");
const ratingModel = require("../models/rating");
const lessonModel = require("../models/lessons");

exports.getCourses = async (req, res) => {
  try {
    const courses = await courseModel.Course.find();
    const parsedCourses = [];
    for (const course of courses) {
      let userRating = 0;
      if (req.query.user !== "undefined") {
        userRating = await Rating.findOne({
          user_id: req.query.user,
          course_id: course._id,
        });
      }
      const ratings = await Rating.aggregate([
        {
          $match: {
            course_id: course._id,
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
      });
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
    const course = await courseModel.Course.findById(req.params.id);
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
      user_id: course.user._id,
      course_id: course._id,
    });
    const courseRating = await Rating.find({
      course_id: course._id,
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
    await lessonModel.Lesson.deleteMany({ course_id: req.params.id });
    await ratingModel.Rating.deleteMany({ course_id: req.params.id });
    return res.json(course);
  } catch (err) {
    res.status(500).send(err.message);
  }
};
