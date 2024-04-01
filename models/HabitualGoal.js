const {Model, DataTypes} = require('sequelize');
const sequelize = require('../config/connection');

class HabitualGoal extends Model {

    async goalProgress() {
       
        const count = await sequelize.models.habitualGoalEntry.count({
            where: { habitual_goal_id: this.id } 
        });
        if(!count){
            return 0;
        }
        console.log(this.name + ": " + count)
        let percent = (count/this.goal_amount)*100;
        percent = percent > 100 ? 100 : percent;
        return percent || 0; 
    }
}

HabitualGoal.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false
        },
        goal_amount: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        imgUrl: {
            type: DataTypes.STRING,
            allowNull: true
        },
        due_date: {
            type: DataTypes.DATE,
            allowNull: false
        },
        date_created: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        },
        user_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'user',
                key: 'id'
            }
        }    
    },
    {
        sequelize,
        timestamps: false,
        freezeTableName: true,
        underscored: true,
        modelName: 'habitualGoal'
    }
);

module.exports = HabitualGoal;