// const User = require('./User');
// const Comment = require('./Comment');
// const Post = require('./Post');
const User = require('./User');
const HabitualGoal = require('./HabitualGoal');
const HabitualGoalEntry = require('./HabitualGoalEntry');

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

module.exports = { User, HabitualGoal, HabitualGoalEntry };
