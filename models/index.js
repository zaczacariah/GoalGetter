// const User = require('./User');
// const Comment = require('./Comment');
// const Post = require('./Post');
const User = require('./User');
const HabitualGoal = require('./HabitualGoal');
const HabitualGoalEntry = require('./HabitualGoalEntry');
const ActionableGoal = require('./ActionableGoal');
const ActionableGoalEntry = require('./ActionableGoalEntry');


User.hasMany(HabitualGoal, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE'
});

HabitualGoal.belongsTo(User, {
    foreignKey: 'user_id'
});

HabitualGoal.hasMany(HabitualGoalEntry, {
    foreignKey: 'habitual_goal_id',
    onDelete: "CASCADE"
});

HabitualGoalEntry.belongsTo(HabitualGoal, {
    foreignKey: 'habitual_goal_id'
});

User.hasMany(ActionableGoal, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE'
});

ActionableGoal.belongsTo(User, {
    foreignKey: 'user_id'
});

ActionableGoal.hasMany(ActionableGoalEntry, {
    foreignKey: 'actionable_goal_id',
    onDelete: 'CASCADE'
});

ActionableGoalEntry.belongsTo(ActionableGoal, {
    foreignKey: 'actionable_goal_id'
});

module.exports = { User, HabitualGoal, HabitualGoalEntry, ActionableGoal, ActionableGoalEntry };
