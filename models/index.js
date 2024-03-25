// const User = require('./User');
// const Comment = require('./Comment');
// const Post = require('./Post');
const User = require('./User');
const HabitualGoal = require('./HabitualGoal');
const HabitualGoalEntry = require('./HabitualGoalEntry');
const ActionableGoal = require('./ActionableGoal');
const ActionableGoalEntry = require('./ActionableGoalEntry');


User.hasMany(HabitualGoal, {
    foreignKey: 'user_id'
});

HabitualGoal.belongsTo(User, {
    foreignKey: 'user_id'
});

HabitualGoal.hasMany(HabitualGoalEntry, {
    foreignKey: 'habitualGoal_id'
});

HabitualGoalEntry.belongsTo(HabitualGoal, {
    foreignKey: 'habitualGoal_id'
});

User.hasMany(ActionableGoal, {
    foreignKey: 'user_id'
});

ActionableGoal.belongsTo(User, {
    foreignKey: 'user_id'
});

ActionableGoal.hasMany(ActionableGoalEntry, {
    foreignKey: 'habitualGoal_id'
});

ActionableGoalEntry.belongsTo(ActionableGoal, {
    foreignKey: 'habitualGoal_id'
});

module.exports = { User, HabitualGoal, HabitualGoalEntry, ActionableGoal, ActionableGoalEntry };
