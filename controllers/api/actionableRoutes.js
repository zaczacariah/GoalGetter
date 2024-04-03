const router = require('express').Router();
const { ActionableGoal, ActionableGoalEntry } = require('../../models');

router.get('/', async (req, res) => {
  try {
    const actionableGoals = await ActionableGoal.findAll({
      include: [
        {
          model: ActionableGoalEntry,
          attributes: ['id', 'quantity', 'notes', 'date_created'],
        },
      ],
      where: {
        user_id: req.session.user_id,
      },
    });

    if (!actionableGoals) {
      res.status(404).json({ message: 'No Actionable Goals Found' });
      return;
    }

    res.status(200).json(actionableGoals);
  } catch (error) {
    res.json(error);
  }
});

router.get('/:id', async (req, res) => {
  try {
    const goal = await ActionableGoal.findOne({
      where: {
        id: req.params.id,
        user_id: req.session.user_id,
      },
      include: [
        {
          model: ActionableGoalEntry,
          attributes: ['id', 'quantity', 'notes', 'date_created'],
        },
      ],
    });

    if (!goal) {
      return res.status(404).json({ message: 'No Actionable Goal Found' });
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

  if (due_date) {
    const date = new Date(due_date);
    if (isNaN(date.getTime())) {
      return res
        .status(400)
        .send({ error: 'Invalid date format. We require ISO 8601 format.' });
    }
  }

  const goal = await ActionableGoal.findOne({
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

  const updatedGoal = await ActionableGoal.update(
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
});

router.post('/', async (req, res) => {
  const { name, unit, direction, description, goal_amount, due_date } =
    req.body;
  if (
    !name ||
    !unit ||
    !direction ||
    !description ||
    !goal_amount ||
    !due_date
  ) {
    res.status(400).json({ message: 'No data to create goal' });
    return;
  }

  try {
    const newActionableGoal = await ActionableGoal.create({
      ...req.body,
      user_id: req.session.user_id,
    });
    res.status(200).json(newActionableGoal);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.delete('/:id', async (req, res) => {
  if (isNaN(parseInt(req.params.id))) {
    return res.status(400).json({ message: 'ID not an Int' });
  }

  try {
    const deletedActionableGoal = await ActionableGoal.destroy({
      where: {
        id: req.params.id,
        user_id: req.session.user_id,
      },
    });

    if (!deletedActionableGoal) {
      res.status(404).json({ message: 'No goal found with this ID!' });
      return;
    }
    res.status(200).json(deletedActionableGoal);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;