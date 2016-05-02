module.exports = function(sequelize, DataTypes) {
	var Inv = sequelize.define("inventory", {
		userID: {
			type: DataTypes.INTEGER,
			primaryKey: true
		},
		itemID: {
			type: DataTypes.INTEGER,
			primaryKey: true
		},
		itemType: {
			type: DataTypes.ENUM('boots', 'chest', 'gloves', 'helmet', 'potion', 'shield', 'weapon')
		},
		inventory_number: {
			type: DataTypes.INTEGER
		},
		inventory_x_position: {
			type: DataTypes.INTEGER
		},
		inventory_y_position: {
			type: DataTypes.INTEGER
		}
	}, {
		classMethods: {
			
		}
	});
	
	return Inv;
}