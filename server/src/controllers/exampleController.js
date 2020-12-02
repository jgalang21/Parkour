const express = require('express');
const Example = require('../models/examplesModel');

/*We will export individual functions to carry out each
API call, this is an example of adding a new object to the
database from an API call
Mongoose query operators documentation:
https://mongoosejs.com/docs/queries.html
*/
module.exports.addNewExample = async function(data){
    let newExample = new Example(data);
    console.log(newExample);

    newExample.save(newExample);
}

module.exports.getAllExamples = async function(){
    const list = await Example.find({});
    return list;
}