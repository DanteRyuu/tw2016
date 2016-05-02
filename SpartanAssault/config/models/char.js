module.exports = function(sequelize, DataTypes) {
	var Char = sequelize.define("character", {
		userID: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true
		},
		level: {
			type: DataTypes.INTEGER
		},
		xp: {
			type: DataTypes.INTEGER
		},
		hp: {
			type: DataTypes.INTEGER
		},
		strength: {
			type: DataTypes.INTEGER
		},
		agility: {
			type: DataTypes.INTEGER
		},
		stamina: {
			type: DataTypes.INTEGER
		},
		charisma: {
			type: DataTypes.INTEGER
		}
	}, {
		classMethods: {
			
		}
	});
	
	return Char;
}