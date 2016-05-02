module.exports = function(sequelize, DataTypes) {
	var Fights = sequelize.define("fights", {
		userID: {
			type: DataTypes.INTEGER,
			primaryKey: true
		},
		total: {
			type: DataTypes.INTEGER
		},
		wins: {
			type: DataTypes.INTEGER
		},
		defeats: {
			type: DataTypes.INTEGER
		},
		draws: {
			type: DataTypes.INTEGER
		},
		dmg_taken: {
			type: DataTypes.INTEGER
		},
		dmg_dealt: {
			type: DataTypes.INTEGER
		},
		gold_won: {
			type: DataTypes.INTEGER
		},
		gold_lost: {
			type: DataTypes.INTEGER
		},
		type: {
			type: DataTypes.ENUM('dungeon', 'arena'),
			primaryKey: true
		}
	}, {
		classMethods: {
			
		}
	});
	
	return Fights;
}