const mongoose = require("mongoose");
const { QUESTION_TYPES, STATEMENT_TYPES } = require("../helpers");

const schema = new mongoose.Schema({
  type: {
    id: {
      type: String,
      enum: Object.keys(QUESTION_TYPES),
    },
    label: String,
  },
  lesson: { type: mongoose.Schema.Types.ObjectId, ref: "Lesson" },
  statements: [
    {
      statementType: {
        id: {
          type: String,
          enum: Object.keys(STATEMENT_TYPES),
        },
        label: String,
      },
      value: String,
      options: [{ value: String, isAnswer: Boolean, _id: false }],
      _id: false,
    },
  ],
});

const Question = mongoose.model("Question", schema);
module.exports = { Question, schema };
