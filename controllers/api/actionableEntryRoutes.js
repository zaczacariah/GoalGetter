const router = require('express').Router();
const { ActionableGoal, ActionableGoalEntry } = require('../../models');
var validator = require('validator');

// Import withAuth to check if user already logged in
const withAuth = require('../../utils/auth');

//Ben PUT
router.put('/:id', async (req, res) => {
  const { quantity, notes } = req.body;

  if (!quantity && !notes) {
    return res.status(400).json({ message: 'No Data to update' });
  }

  try {
    const entry = await ActionableGoalEntry.findByPk(req.params.id, {
      include: [
        {
          model: ActionableGoal,
          attributes: [],
          where: { user_id: req.session.user_id },
        },
      ],
    });

    if (!entry) {
      return res
        .status(404)
        .send('You do not have an Actionable Goal Entry with this ID');
    }

    await ActionableGoalEntry.update(
      { quantity, notes },
      { where: { id: req.params.id } }
    );

    return res.status(202).send('Actionable Goal Entry Updated!');
  } catch (error) {
    return res.status(500).send(error);
  }
});

router.post('/', async (req, res) => {
  const { quantity, notes, actionable_goal_id } = req.body;

  if (
    !validator.isNumeric(quantity) ||
    !validator.isEmpty(notes) ||
    !validator.isNumeric(actionable_goal_id)
  ) {
    return res
      .status(400)
      .send(
        'Actionable Goal Entries require the following properties: quantity, notes and actionable_goal_id'
      );
  }

  try {
    const goal = await ActionableGoal.findOne({
      where: { id: actionable_goal_id, user_id: req.session.user_id },
    });

    if (!goal) {
      return res
        .status(404)
        .send('No goal found with the provided ID for the current user.');
    }

    const newActionableEntry = await ActionableGoalEntry.create(req.body);
    res.status(200).json(newActionableEntry);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.delete('/:id', withAuth, async (req, res) => {

    // Check ID is an INTEGER
    if ( !validator.isNumeric(req.params.id) ) {
        return res.status(400).json({ message: "ID not an INTEGER"});
    }

    try {
                
        //Checking if there is an entry that belongs to this user
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