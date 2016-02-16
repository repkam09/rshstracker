var request = require('request');
var fs = require('fs');
var moment = require('moment');
var Datastore = require('nedb');

var skill_list = ["Overall", "Attack", "Defence", "Strength", "Constitution", "Ranged", "Prayer", "Magic", "Cooking", "Woodcutting", "Fletching", "Fishing", "Firemaking", "Crafting", "Smithing", "Mining", "Herblore", "Agility", "Thieving", "Slayer", "Farming", "Runecrafting", "Hunter", "Construction", "Summoning", "Dungeoneering", "Divination", "Invention"];

var settings = JSON.parse(fs.readFileSync('../config.json', 'utf8'));
var players = settings.players;
var url = settings.rs3url;

players.forEach(function (playername) {
    console.log("Getting info for " + playername);
    var db = new Datastore({ filename: "../db/" + playername + '.repdb', autoload: true, timestampData: true});
    
    geturl(url + playername).then(function (response) {
        var player = getPlayerStructure(playername, response);
        db.insert(player);
        console.log("Stored info for " + playername);
    }).catch(function (error) {
        console.error("Error: " + error);
    });
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

    var dayOfYear = moment().dayOfYear();
    var year = moment().year();

    var player = { name, skills, year, dayOfYear};
    
    //console.log(JSON.stringify(player));
    return player;
}

function geturl(url) {
    return new Promise(function (resolve, reject) {
        request(url, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                resolve(body);
            } else {
                reject(error);
            }
        });
    });
}