/*For more info on creating mongoose schemas refer to
https://mongoosejs.com/docs/guide.html#definition
*/
const mongoose = require('mongoose');

const ExampleSchema = mongoose.Schema({
    exampleField1 : {
        type: String,
        required: 'You must enter this field'
    },
    exampleField2: {
        type: Number
    }
})

module.exports = mongoose.model('Example', ExampleSchema);