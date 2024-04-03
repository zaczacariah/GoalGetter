const sequelize = require('../config/connection');
const {
  User,
  ActionableGoal,
  ActionableGoalEntry,
  HabitualGoal,
  HabitualGoalEntry,
} = require('../models');

const userData = require('./userData.json');
const actionableGoalData = require('./actionableGoals.json');
const actionableGoalDataEntries = require('./actionableGoalEntries.json');
const habitualGoalData = require('./habitualGoals.json');
const habitualGoalDataEntries = require('./habitualGoalEntries.json');

const seedDatabase = async () => {
  await sequelize.sync({ force: true });

  const users = await User.bulkCreate(userData, {
    individualHooks: true,
    returning: true,
  });

  const enrichedActionableGoalData = actionableGoalData.map((goal) => ({
    ...goal,
    user_id: users[Math.floor(Math.random() * users.length)].id,
  }));

  await ActionableGoal.bulkCreate(enrichedActionableGoalData);

  await ActionableGoalEntry.bulkCreate(actionableGoalDataEntries);

  const enrichedHabitualGoalData = habitualGoalData.map((goal) => ({
    ...goal,
    user_id: users[Math.floor(Math.random() * users.length)].id,
  }));

  await HabitualGoal.bulkCreate(enrichedHabitualGoalData);

  await HabitualGoalEntry.bulkCreate(habitualGoalDataEntries);

  process.exit(0);
};

seedDatabase();
