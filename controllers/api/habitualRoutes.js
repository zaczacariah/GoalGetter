const router = require('express').Router();
// Import the User model from the models folder
const { HabitualGoal, HabitualGoalEntry } = require('../../models');

router.get('/', async (req, res) => {
  try {
    const habitualGoals = await HabitualGoal.findAll({
      include: [
        {
          model: HabitualGoalEntry,
          attributes: ['id', 'notes', 'date_created'],
        },
      ],
      where: {
        user_id: req.session.user_id,
      },
    });

    if (!habitualGoals) {
      res.status(404).send({ message: 'No Actionable Goals Found' });
      return;
    }

    res.status(200).json(habitualGoals);
  } catch (error) {
    res.json(error);
  }
});

router.get('/:id', async (req, res) => {
  try {
    const goal = await HabitualGoal.findOne({
      where: {
        id: req.params.id, // Primary key filter
        user_id: req.session.user_id, // Additional filtering condition
      },
      include: [
        {
          model: HabitualGoalEntry,
          attributes: ['id', 'notes', 'date_created'],
        },
      ],
    });

    if (!goal) {
      return res.status(404).json({ message: 'No Habitual Goal Found' });
    }

    res.status(200).json(goal);
  } catch (error) {
    res.json(error);
  }
});

router.put('/:id', async (req, res) => {
  const { name, notes, description, due_date, goal_amount } = req.body;

  if (!name && !notes && !description && !due_date && !goal_amount) {
    return res.status(400).json({ message: 'No Data to update' });
  }

  // Check date format
  if (due_date) {
    const date = new Date(due_date);
    if (isNaN(date.getTime())) {
      return res
        .status(400)
        .send({ error: 'Invalid date format. We require ISO 8601 format.' });
    }
  }

  // Check if the goal exists and belongs to the user
  const goal = await HabitualGoal.findOne({
    where: {
      id: req.params.id,
      user_id: req.session.user_id,
    },
  });

  if (!goal) {
    return res
      .status(404)
      .send('No goal found with the provided ID for the current user.');
  }

  try {
    const updatedGoal = await HabitualGoal.update(
      {
        name,
        notes,
        description,
        due_date,
        goal_amount,
      },
      {
        where: {
          id: req.params.id,
          user_id: req.session.user_id,
        },
      }
    );

    return res.status(202).send('Goal Successfully Updated');
  } catch (error) {
    return res.status(500).send(error);
  }
});

router.post('/', async (req, res) => {
  // check if there is valid req
  const { name, description, goal_amount, due_date } = req.body;
  if (!name && !description && !goal_amount && !due_date) {
    res.status(400).json({ message: 'No data to create goal!' });
    return;
  }

  try {
    const newHabitualGoal = await HabitualGoal.create({
      ...req.body,
      user_id: req.session.user_id,
    });
    res.status(200).json(newHabitualGoal);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.delete('/:id', async (req, res) => {
  // Check if id is an INTEGER
  if (isNaN(parseInt(req.params.id))) {
    res.status(400).json({ message: 'ID not an INTEGER' });
    return;
  }

  try {
    const deletedHabitualGoal = await HabitualGoal.destroy({
      where: {
        id: req.params.id,
      },
    });

    // check if the goal is not found to delete
    if (!deletedHabitualGoal) {
      res.status(404).json({ message: 'No goal found with this ID!' });
      return;
    }
    res.status(200).json(deletedHabitualGoal);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;