const userModel = require("./src/models/users");
const courseModel = require("./src/models/courses");
const lessonModel = require("./src/models/lessons");
const commentModel = require("./src/models/comments");
const express = require("express");
const app = express();
const port = 3001;
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const jsonParser = bodyParser.json();

app.use(jsonParser);
app.use(cors({ origin: "http://localhost:3000" }));

mongoose.set("strictQuery", false);
const mongoDB =
  "mongodb+srv://martinrada:martin01@cluster0.uuonmkg.mongodb.net/?retryWrites=true&w=majority";
main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(mongoDB);
}

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.post("/register", async (req, res) => {
  try {
    const { name, profile_pic, email, password } = req.body;

    if (!(name && email && password)) {
      res.status(400).send("Faltan campos por llenar");
    }

    const oldUser = await userModel.User.findOne({ email });
    if (oldUser) {
      return res.status(409).send("El usuario ya existe");
    }

    let encryptedPassword = await bcrypt.hash(password, 10);

    const user = await userModel.User.create({
      name,
      profile_pic,
      email: email.toLowerCase(),
      password: encryptedPassword,
    });

    const token = jwt.sign({ user_id: user._id, email }, "martin123", {
      expiresIn: "2h",
    });
    user.token = token;

    res.status(201).json(user);
  } catch (err) {
    console.log(err);
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!(email && password)) {
      res.status(400).send("Faltan campos por llenar");
    }

    const user = await userModel.User.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign({ user_id: user._id, email }, "martin123", {
        expiresIn: "2h",
      });
      user.token = token;

      res.status(200).json(user);
    }
    res.status(400).send("Credenciales No Validas");
  } catch (err) {
    console.log(err.message);
  }
});

app.get("/users", async (req, res) => {
  try {
    const users = await userModel.User.find();
    return res.json(users);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.get("/users/:id", async (req, res) => {
  try {
    const user = await userModel.User.findById(req.params.id);
    return res.json(user);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.put("/users/:id", async (req, res) => {
  try {
    const user = await userModel.User.findByIdAndUpdate(req.params.id, {
      $set: req.body,
    });
    return res.json(user);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.delete("/users/:id", async (req, res) => {
  try {
    const user = await userModel.User.findByIdAndDelete(req.params.id);
    return res.json(user);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.get("/courses", async (req, res) => {
  try {
    const courses = await courseModel.Course.find();
    return res.json(courses);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.post("/courses", async (req, res) => {
  const newCourse = new courseModel.Course({
    title: req.body.title,
    description: req.body.description,
    lessons: req.body.lessons,
    rating: req.body.rating,
    imageURL: req.body.imageURL,
  });
  try {
    const course = await newCourse.save();
    return res.json(course);
  } catch (e) {
    return res.send("Course not created");
  }
});

app.get("/courses/:id", async (req, res) => {
  try {
    const course = await courseModel.Course.findById(req.params.id).populate(
      "lessons"
    );
    return res.json(course);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.put("/courses/:id", async (req, res) => {
  try {
    const course = await courseModel.Course.findByIdAndUpdate(req.params.id, {
      $set: req.body,
    });
    return res.json(course);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.delete("/courses/:id", async (req, res) => {
  try {
    const course = await courseModel.Course.findByIdAndDelete(req.params.id);
    return res.json(course);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.post("/courses/:id/lessons", async (req, res) => {
  const newLesson = new lessonModel.Lesson({
    title: req.body.title,
    videos: req.body.videos,
    quiz: [],
    comments: [],
  });
  try {
    const createdLesson = await newLesson.save();
    const course = await courseModel.Course.findById(req.params.id);
    let oldLessonsArray = course.lessons;
    await course.updateOne({
      $set: { lessons: [...oldLessonsArray, createdLesson._id] },
    });
    return res.json(createdLesson);
  } catch (e) {
    return res.send("Lesson not created");
  }
});

app.get("/courses/:courseId/lessons/:id", async (req, res) => {
  try {
    const lesson = await lessonModel.Lesson.findById(req.params.id);
    return res.json(lesson);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.put("/courses/:course-id/lessons/:id", async (req, res) => {
  try {
    const lesson = await lessonModel.Lesson.findByIdAndUpdate(req.params.id, {
      $set: req.body,
    });
    return res.json(lesson);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.delete("/courses/:course-id/lessons/:id", async (req, res) => {
  try {
    const lesson = await lessonModel.Lesson.findByIdAndDelete(req.params.id);
    return res.json(lesson);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.get("/lessons/:id/comments", async (req, res) => {
  try {
    const lesson = await lessonModel.Lesson.findById(req.params.id).populate(
      "comments"
    );
    const populatedLesson = await lesson.populate("comments.user");
    return res.json(populatedLesson.comments);
  } catch (error) {
    return res.status(500).send(error.message);
  }
});

app.post("/lessons/:id/comments", async (req, res) => {
  const newComment = new commentModel.Comment({
    user: req.body.user,
    comment: req.body.comment,
    likes: 0,
    dislikes: 0,
  });
  try {
    const createdComment = await newComment.save();
    const lesson = await lessonModel.Lesson.findById(req.params.id);
    let oldCommentsArray = lesson.comments;
    await lesson.updateOne({
      $set: { comments: [...oldCommentsArray, createdComment._id] },
    });
    return res.json(createdComment);
  } catch (e) {
    return res.send("Comment not created");
  }
});

app.delete("/lessons/:lesson_id/comments/:id", async (req, res) => {
  try {
    await commentModel.Comment.findByIdAndDelete(req.params.id);

    const lesson = await lessonModel.Lesson.findById(req.params.lesson_id);
    console.log(lesson);
    if (lesson.comments.length > 0) {
      const a = await lesson.updateMany(
        { _id: req.params.lesson_id },
        { $pull: { comments: { $in: [req.params.id] } } }
      );
      console.log(a);
    }

    res.send("OK");
  } catch (error) {
    res.send(error.message);
  }
});

app.listen(port, () =>
  console.log(`Hello world app listening on port ${port}!`)
);
