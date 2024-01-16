const mongoose = require("mongoose")



const choiceTypeSchema = new mongoose.Schema ( {
    type: String
})

const OptionType = mongoose.model('OptionType', optionTypeSchema)

const schema = new mongoose.Schema({
    type: String,
    options: [choiceTypeSchema], 
    "first-statement": String,
    "last-statement": String,
    solution: String,
    "is-correct": Boolean,
    "selected-option": String
})


const Question = mongoose.model('Question', schema)
module.exports = {Question, schema}