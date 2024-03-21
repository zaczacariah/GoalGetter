const router = require('express').Router();
// Import the User model from the models folder
const { Project, User } = require('../models');



router.get('/', async (req, res) => {
    // const projectsData = await Project.findAll({
    //     include: [
    //         {
    //             model: User,
    //             attributes: [
    //                 "name"
    //             ]            
    //         }
    //     ]
    // });

    // if(!projectsData){
    //     res.status(404).json();

    // }
    // const projects = projectsData.map((project) => project.get({plain:true}));

    res.render('homepage');
})

module.exports = router;
