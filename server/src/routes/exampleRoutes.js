const exampleController = require('../controllers/exampleController');
const express = require('express');

const router = express.Router();

/* Inside of our routes files we will import the functions
from the corresponding controller file and use those functions
to carry out the API's functionality
*/
router.get('/', async (req, res) => {
    const examples = await exampleController.getAllExamples();
    console.log(examples);
    res.json(examples);
});

router.post('/', async (req, res) =>{
    await exampleController.addNewExample(req.body);
    res.json('Data posted');
});

module.exports = router;