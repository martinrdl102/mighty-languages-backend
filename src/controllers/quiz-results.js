const quizResultsModel = require("../models/quiz-results");

exports.postQuizResults = async (req, res) => {
  const newQuizResults = new quizResultsModel.QuizResult({
    user: req.body.userId,
    lesson: req.body.lessonId,
    userAnswers: req.body.answers,
  });
  try {
    const createdResults = await newQuizResults.save();
    return res.json(createdResults);
  } catch (e) {
    console.log(e.message);
    return res.send("Results not created");
  }
};

exports.getResultsFromLessonId = async (req, res) => {
  try {
    const results = await quizResultsModel.QuizResult.findOne({
      lesson: req.params.id,
      user: req.params.user_id,
    });
    return res.json(results);
  } catch (err) {
    console.log(err);
    res.status(500).send(err.message);
  }
};

exports.updateQuizResults = async (req, res) => {
  try {
    const results = await quizResultsModel.QuizResult.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    return res.json(results);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.deleteQuizResults = async (req, res) => {
  try {
    const results = await quizResultsModel.QuizResult.findByIdAndDelete(
      req.params.id
    );
    return res.json(results);
  } catch (err) {
    res.status(500).send(err.message);
  }
};
