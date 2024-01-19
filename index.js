const express = require("express");
const app = express();
const port = 3001;
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");

const courseController = require("./src/controllers/courses");
const lessonController = require("./src/controllers/lessons");
const commentController = require("./src/controllers/comments");
const userController = require("./src/controllers/users");
const feedbackController = require("./src/controllers/feedback");
const ratingController = require("./src/controllers/rating");
const courseEnrollmentController = require("./src/controllers/course-enrollment");

const jsonParser = bodyParser.json();

app.use(jsonParser);
app.use(cors({ origin: "http://localhost:3000" }));

mongoose.set("strictQuery", false);
const mongoDB =
  "mongodb+srv://martinrdl:martin01@cluster0.4t9qdhe.mongodb.net/?retryWrites=true&w=majority";
main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(mongoDB);
}

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.post("/register", userController.register);

app.post("/login", userController.login);

app.get("/users", userController.getUsers);

app.get("/users/:id", userController.getUser);

app.put("/users/:id", userController.updateUser);

app.delete("/users/:id", userController.deleteUser);

app.get("/courses", courseController.getCourses);

app.post("/courses", courseController.postCourse);

app.get("/courses/:id", courseController.getCourse);

app.put("/courses/:id", courseController.updateCourse);

app.delete("/courses/:id", courseController.deleteCourse);

app.post("/lessons", lessonController.postLesson);

app.get("/courses/:id/lessons", lessonController.getLessonsFromCourseId);

app.get("/lessons/:id", lessonController.getLesson);

app.put("/lessons/:id", lessonController.updateLesson);

app.delete("/lessons/:id", lessonController.deleteLesson);

app.get("/lessons/:id/comments", commentController.getComments);

app.post("/comments", commentController.postComment);

app.delete("/comments/:id", commentController.deleteComment);

app.put("/comments/:id", commentController.editComment);

app.post("/feedbacks", feedbackController.addFeedback);

app.put("/feedbacks", feedbackController.editFeedback);

app.delete("/feedbacks", feedbackController.deleteFeedback);

app.post("/ratings", ratingController.addRating);

app.put("/ratings", ratingController.editRating);

app.delete("/ratings", ratingController.deleteRating);

app.post("/course_enrollment", courseEnrollmentController.addCourseEnrollment);

app.put("/course_enrollment", courseEnrollmentController.editCourseEnrollment);

app.get(
  "/course_enrollment/:userId",
  courseEnrollmentController.getCourseEnrollments
);

app.get("/course_enrollment", courseEnrollmentController.getCourseEnrollment);

app.listen(port, () =>
  console.log(`Hello world app listening on port ${port}!`)
);
