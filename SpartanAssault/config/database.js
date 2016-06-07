var orm = require('orm');
var bcrypt = require('bcrypt-nodejs');

module.exports = function(app) {
	var str = "mysql://danteryuu:parola@db4free.net:3306/spartanassault";
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
				max_hp:Number,
				strength:Number,
				agility:Number,
				stamina:Number,
				charisma:Number,
				gold:Number
			},{
				methods: {
					
				}
			});
			
			models.inventory=db.define("inventory",{
				userID: { type: 'number', key: true },
				itemID: { type: 'number', key: true },
				itemType: { type: 'text', key: true },
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
			
			models.fights=db.define("fights", {
				username: { type: 'text', key: true},
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
			
			models.jobs=db.define("jobs",{
				jobid: { type: 'number', key: true },
				jobname:String,
				minhours:Number,
				maxhours:Number,
				salary:Number,
				reward:String
			},{ 
				methods: {
				}
			}
			);
			
			models.work=db.define("work",{
				userId: {type: 'number', key:true},
				jobend: {type: 'date', time: true},
				rewarditem:String,
				totalreward:Number
			},{
				methods: {
					
				}
			});
			
			models.warehouse=db.define("warehouse", {
				warehouseID: { type: 'number', key: true},
				itemID:Number,
				type:String,
				timestamp: {type: 'date', time: true}
			}, {
				methods : {
					
				}
			});
			
			models.mob=db.define("mob",{
				mobName :{type:'text',key:true},
				mobHp:Number,
				mobMinDmg:Number,
				mobMaxDmg:Number,
				mobDefense:Number,
				strength:Number,
				agility:Number,
				stamina:Number,
				charisma:Number,
				rewardXp:Number,
				rewardGold:Number
			},{
				
			});
			
			db.sync();
		}
	}));
	
};