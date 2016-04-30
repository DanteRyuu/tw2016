var orm = require('orm');
var bcrypt   = require('bcrypt-nodejs');

module.exports = function(app) {
	var str = "mysql://sql7116871:hLTAWewfLZ@sql7.freemysqlhosting.net:3306/sql7116871";
	var encoded_str = str.replace(/%([^\d].)/, "%25$1");
	app.use(orm.express(encoded_str,
	{
		define: function (db, models) {
			models.user = db.define("user", {
				userID : { type: 'number', key: true },
				username : String,
				password : String,
				email : String,
				twitterID : String,
				gender : ["male", "female", ""],
				origin : ["north", "east", "south", "west", ""]
			}, {
					methods: {
						generateHash: function(pass) {
							return bcrypt.hashSync(pass, bcrypt.genSaltSync(8), null);
						},
						checkPass: function(pass) {
							return bcrypt.compareSync(pass, this.password);
						}
					}
				}
			);
			
			models.character=db.define("character",{
				userID: { type: 'number', key: true },
				level:Number,
				xp:Number,
				hp:Number,
				strength:Number,
				agility:Number,
				stamina:Number,
				charisma:Number,
				guildID:Number,
				gold: Number
			},{
				methods: {
					
				}
			});
			
			models.guild=db.define("guild",{
				guildID: { type: 'number', key: true },
				guildName:String,
				ownerID:Number,
				number_members:Number,
				level:Number
			},{
				methods: {
					
				}
			});
			
			models.inventory=db.define("inventory",{
				userID: { type: 'number', key: true },
				itemID: { type: 'number', key: true },
				itemType:String,
				inventory_number:Number,
				inventory_x_position:Number,
				inventory_y_position:Number
			},{
				methods: {
					
				}
			});
			
			models.equipment=db.define("equipment",{
				userID:{ type: 'number', key: true },
				helmetID:Number,
				chestID:Number,
				glovesID:Number,
				bootsID:Number,
				weaponID:Number,
				shieldID:Number
			},{
				methods: {
					
				}
			});
			
			models.weapon=db.define("weapon",{
				weaponID:{ type: 'number', key: true },
				damage_min:Number,
				damage_max:Number,
				upgrade_level:Number,
				price:Number,
				weaponName:String,
				weight:Number
			},{
				methods: {
					
				}
			});
			
			models.consumable=db.define("consumable",{
				consumableID:{ type: 'number', key: true },
				consumableType:String,
				consumableName:String,
				consumableHP:Number,
				price:Number
			},{
				methods: {
					
				}
			});
			
			models.armour=db.define("armour",{
				armourID:{ type: 'number', key: true },
				armourType:String,
				strength:Number,
				agility:Number,
				stamina:Number,
				charisma:Number,
				upgrade_level:Number,
				price:Number,
				weight:Number,
				armourName:String,
				defense:Number
			},{
				methods: {
					
				}
			});
			
			models.market=db.define("market",{
				auctionID: { type: 'number', key: true },
				userID:Number,
				price:Number,
				duration:Number,
				inventoryID:Number
			},{
				methods: {
					
				}
			});
			
			models.fights=db.define("fights", {
				userID: { type: 'number', key: true},
				total:Number,
				wins:Number,
				defeats:Number,
				draws:Number,
				dmg_taken:Number,
				dmg_dealt:Number,
				gold_won:Number,
				gold_lost:Number,
				type: { type: 'enum', values: ['dungeon', 'arena'], key: true}
			}, {
				methods : {
					
				}
			});
			
			models.warehouse=db.define("warehouse", {
				warehouseID: { type: 'number', key: true},
				itemID:Number,
				type:String,
				timestamp: Date
			}, {
				methods : {
					
				}
			});
			
			db.sync();
		}
	}));
};