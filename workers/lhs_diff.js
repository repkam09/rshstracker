var request = require('request');
var fs = require('fs');
var moment = require('moment');
var Datastore = require('nedb');

var skill_list = ["Overall", "Attack", "Defence", "Strength", "Constitution", "Ranged", "Prayer", "Magic", "Cooking", "Woodcutting", "Fletching", "Fishing", "Firemaking", "Crafting", "Smithing", "Mining", "Herblore", "Agility", "Thieving", "Slayer", "Farming", "Runecrafting", "Hunter", "Construction", "Summoning", "Dungeoneering", "Divination", "Invention"];

var settings = JSON.parse(fs.readFileSync('../config.json', 'utf8'));
var url = settings.rs3url;

var playername = "repkam09";
console.log("Getting info for " + playername);
var db = new Datastore({ filename: "../db/" + playername + '.repdb', autoload: true, timestampData: true });

geturl(url + playername).then(function (response) {
    var player = getPlayerStructure(playername, response);
    var dayOfYesterday = (player.dayOfYear - 1);
    var yearOfYesterday = player.year;

    if (dayOfYesterday === 0) {
        dayOfYesterday = 365;
        yearOfYesterday = (player.year - 1);
    }

    db.find({ name: player.name, year: yearOfYesterday, dayOfYear: dayOfYesterday }, function (err, docs) {
        if (docs.length === 1) {
            var pyesterday = docs[0];
            lhsCalcDiff(player, pyesterday);         
        }
    });
}).catch(function (error) {
    console.error("Error: " + error);
});

function lhsCalcDiff(p1, p2) {
    var sc1 = p1.skills.length;
    var sc2 = p2.skills.length;
    
    if (sc1 !== sc2) {
        console.log("A new skill was released! Woah!");
    }
    
    var skillchange = [];
    
    for(var count=0; count < sc1; count++) {
        var sp1 = p1.skills[count];
        var sp2 = p2.skills[count];
        
        if (sp1.n !== sp2.n) {
            console.log("Something is horribly wrong! Malformed player file");
        } 
        
        var deltae = sp1.e - sp2.e;
        var deltar = sp1.r - sp2.r;
        var deltal = sp1.l - sp2.l;
        
        if (deltae !== 0) {
            skillchange.push({name: sp1.n, deltae: deltae});
        }
    }
    
    console.log("Since yesterday you made progress in " + skillchange.length + " skills.");
    skillchange.forEach(function(skill) {
        console.log("You gained " + skill.deltae + "xp in " + skill.name + "!"); 
    });
}

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

    var player = { name, skills, year, dayOfYear };
    
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