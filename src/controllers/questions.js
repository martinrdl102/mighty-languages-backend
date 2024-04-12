const { QUESTION_TYPES } = require("../helpers");
const questionModel = require("../models/questions");

exports.postQuestion = async (req, res) => {
  const newQuestion = new questionModel.Question({
    type: req.body.type,
    lesson: req.body.lessonId,
    statements: req.body.statements,
  });
  try {
    const createdQuestion = await newQuestion.save();
    return res.json(createdQuestion);
  } catch (e) {
    console.log(e.message);
    return res.send("Question not created");
  }
};

exports.getQuestionsFromLessonId = async (req, res) => {
  try {
    const questions = await questionModel.Question.find({
      lesson: req.params.id,
    });
    return res.json(questions);
  } catch (err) {
    console.log(err);
    res.status(500).send(err.message);
  }
};

exports.updateQuestion = async (req, res) => {
  try {
    const question = await questionModel.Question.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    return res.json(question);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.deleteQuestion = async (req, res) => {
  try {
    const question = await questionModel.Question.findByIdAndDelete(
      req.params.id
    );
    return res.json(question);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.getQuestionsTypes = async (req, res) => {
  try {
    return res.json(QUESTION_TYPES);
  } catch (err) {
    console.log(err);
    res.status(500).send(err.message);
  }
};
