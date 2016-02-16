var request = require('request');
var fs = require('fs');
var moment = require('moment');
var Datastore = require('nedb');

var skill_list = ["Overall", "Attack", "Defence", "Strength", "Constitution", "Ranged", "Prayer", "Magic", "Cooking", "Woodcutting", "Fletching", "Fishing", "Firemaking", "Crafting", "Smithing", "Mining", "Herblore", "Agility", "Thieving", "Slayer", "Farming", "Runecrafting", "Hunter", "Construction", "Summoning", "Dungeoneering", "Divination", "Invention"];

var playername = "repkam09"
var directory = "runescape/" + playername + "/rs3/";

var results = fs.readdirSync(directory);
var db = new Datastore({ filename: "../db/" + playername + '.repdb', autoload: true, timestampData: true});

results.forEach(function(file) {
    var parts = file.split('-');
    var year = parts[1];
    var month = parts[2];
    var day = parts[3];
    
    var created = moment(year + "-" + month + "-" + day);
    var dayOfYear = created.dayOfYear();
    var cyear = created.year();    
    
    var contents = fs.readFileSync(directory + file, "UTF-8");
    var player = getPlayerStructure(playername, contents);
    player.year = cyear;
    player.dayOfYear = dayOfYear;
    db.insert(player);
});


function getPlayerStructure(name, lhs) {
    var skills = [];

    var lines = lhs.split("\n");

    for (var count = 0; count < lines.length; count++) {
        var line = lines[count];
        var skill = line.split(",");
        if (skill.length === 3) {
            var add = {};
            add.n = skill_list[count];
            add.r = skill[0];
            add.l = skill[1];
            add.e = skill[2];
            skills.push(add);
        }
    }
    var player = { name, skills};
    return player;
}
