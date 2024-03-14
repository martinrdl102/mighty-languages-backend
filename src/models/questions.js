const mongoose = require("mongoose");
const { QUESTION_TYPES } = require("../helpers");

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
      type: String,
      value: String,
      options: [{ value: String, isAnswer: Boolean }],
    },
  ],
});

const Question = mongoose.model("Question", schema);
module.exports = { Question, schema };

/* 
    const newQuestion = {
        type: {id:"MULTI_CHOICE",value:"Opcion multiple"},
        lesson: "ghghgjhgjhg",
        statements: [
            {
            type: "text", 
            value: "what is correct?", 
            options: [
                { value: "this one is correct", isAnswer: true},
                { value: "this is wrong", isAnswer: false}
            ]
        },
        {
            type: "textfield", 
            value: null, 
            options: "this one is correct"
            
        },
        {
            type: "select", 
            value: null, 
            options:  [
                { value: "this one is correct", isAnswer: true},
                { value: "this is wrong", isAnswer: false}
            ]
            
        },
        ], 
    }
*/
