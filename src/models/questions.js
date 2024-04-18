const mongoose = require("mongoose");
const { QUESTION_TYPES, STATEMENT_TYPES } = require("../helpers");

const schema = new mongoose.Schema({
  type: {
    id: {
      type: String,
      enum: Object.keys(QUESTION_TYPES),
    },
    value: String,
  },
  lesson: { type: mongoose.Schema.Types.ObjectId, ref: "Lesson" },
  statements: [
    {
      type: {
        id: {
          type: String,
          enum: Object.keys(STATEMENT_TYPES),
        },
        value: String,
      },
      value: String,
      options: [{ value: String, isAnswer: Boolean }],
    },
  ],
});

const Question = mongoose.model("Question", schema);
module.exports = { Question, schema };
