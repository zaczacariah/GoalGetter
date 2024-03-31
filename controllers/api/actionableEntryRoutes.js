const router = require('express').Router();
// Import the User model from the models folder
const { ActionableGoal, ActionableGoalEntry } = require('../../models');

// Import validator from module
var validator = require('validator');


//Ben PUT
router.put('/:id', async (req, res) => {
    const { quantity, notes } = req.body;

    if(!quantity && !notes){
        return res.status(400).json( { message: "No Data to update" });
    }

    try{

        //Checking if there is an AGE that belongs to this user
        const entry = await ActionableGoalEntry.findByPk(req.params.id, {
            include: [{
              model: ActionableGoal,
              attributes: [],
              where: { user_id: req.session.user_id }
            }]
          });

        if (!entry) {
            return res.status(404).send("You do not have an Actionable Goal Entry with this ID");
        }

        await ActionableGoalEntry.update({
            quantity,
            notes
        },
        {
            where: {
                id: req.params.id
            }
        });

        return res.status(202).send("Actionable Goal Entry Updated!");

    } catch (error) {
        return res.status(500).send(error);
    }

});


// Actionable Entry Schema
// {
//     "quantity": 2,
//     "notes": "Lost 2 Kg this week with healthy eating and more exercise.",
//     "actionable_goal_id": 2
// }
router.post('/', async (req, res) => {

    const { quantity, notes, actionable_goal_id } = req.body;
    // console.log(req.body);
    // console.log(!validator.isNumeric(quantity));
    // console.log(!validator.isEmpty(notes));
    // console.log(!validator.isNumeric(actionable_goal_id));

    if ( !validator.isNumeric(quantity) ||
         !validator.isEmpty(notes) ||
         !validator.isNumeric(actionable_goal_id) ) {
        return res.status(400).send("Actionable Goal Entries require the following properties: quantity, notes and actionable_goal_id");
    };

    try {
        
    // Check if the goal exists and belongs to the user
        const goal = await ActionableGoal.findOne({
            where: {
                id: actionable_goal_id,
                user_id: req.session.user_id
            }
        });

        if (!goal) {
            return res.status(404).send('No goal found with the provided id for the current user.');
        }
    
       
        const newActionableEntry = await ActionableGoalEntry.create(req.body);
        res.status(200).json(newActionableEntry);            
  
        
    } catch (error) {
        res.status(500).json(error);
    };
});


router.delete('/:id', async (req, res) => {

    // Check ID is an INTEGER
    if(isNaN(parseInt(req.params.id))){
        return res.status(400).json({ message: "ID not an INTEGER"});
    }

    try {

                
        //Checking if there is an AGE that belongs to this user
        const entry = await ActionableGoalEntry.findByPk(req.params.id, {
            include: [{
              model: ActionableGoal,
              attributes: [],
              where: { user_id: req.session.user_id }
            }]
          });

        if (!entry) {
            return res.status(404).send("You do not have an Actionable Goal Entry with this ID");
        }

        await ActionableGoalEntry.destroy({
            where: {
                id: req.params.id
            }
        });

  
        res.status(200).send("Succesfully Deleted");            
        
    } catch (error) {
        res.status(500).json(error);
    };
});


module.exports = router;