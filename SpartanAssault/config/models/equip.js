module.exports = function(sequelize, DataTypes) {
	var Equip = sequelize.define("equipment", {
		userID: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true
		},
		helmetID: {
			type: DataTypes.INTEGER
		},
		chestID: {
			type: DataTypes.INTEGER
		},
		bootsID: {
			type: DataTypes.INTEGER
		},
		weaponID: {
			type: DataTypes.INTEGER
		},
		shieldID: {
			type: DataTypes.INTEGER
		}
	}, {
		classMethods: {
			
		}
	});
	
	return Equip;
}