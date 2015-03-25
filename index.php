<html>
<head>
<title>Mark Repka</title>
<link href="/css/default.css" rel="stylesheet" type="text/css" media="all" />
</head>
<body>
<div id="wrapper">
	<div id="header-wrapper">
	<div id="header" class="container">
		<div id="logo">
			<h1><a href="/">Mark Repka</a></h1>
			<p>Software engineer who runs a Minecraft server!</p>
		</div>
		<div id="menu">
			<ul>
				<li><a href="/" accesskey="1" title="">Homepage</a></li>
				<li><a href="/about" accesskey="2" title="">About</a></li>
				<li><a href="/contact" accesskey="3" title="">Contact</a></li>
			</ul>
		</div>
	</div>
	</div>
	<div class="container">

	<?php
	$player = $_POST['player'];


	echo "</form>";
	echo "</br>";

        echo "<!-- Display Form -->";
	echo "Enter a RuneScape player name:<br />";                                                                                    
        echo "<form action=\"index.php\" method=\"post\">";
        echo "<input type=\"text\" name=\"player\">";
        echo "<input type=\"submit\" value=\"Search\">";
        echo "</form>";

	if (empty($player)) {
		$player = "Repkam09";
	}

	$txt_file    = file_get_contents('http://hiscore.runescape.com/index_lite.ws?player=' . $player);
	$rows        = explode("\n", $txt_file);

	$skills = array("Overall", "Attack", "Defence", "Strength", "Constitution", "Ranged", "Prayer", "Magic", "Cooking", "Woodcutting",
		"Fletching", "Fishing", "Firemaking", "Crafting", "Smithing", "Mining", "Herblore", "Agility", "Thieving", "Slayer", "Farming",
		"Runecraft", "Hunter" ,"Construction", "Summoning", "Dungeoneering", "Divination");

	$skill_icon = array("overall.gif", "attack.gif", "defence.gif", "strength.gif", "constitution.gif", "ranged.gif",
		"prayer.gif", "magic.gif", "cooking.gif", "woodcutting.gif", "fletching.gif", "fishing.gif",
		"firemaking.gif", "crafting.gif", "smithing.gif", "mining.gif", "herblore.gif", "agility.gif",
		"thieving.gif", "slayer.gif", "farming.gif", "runecraft.gif", "hunter.gif" ,"construction.gif", "summoning.gif",
		"dungeoneering.gif", "divination.gif");

	$counter = 0;

	echo '<h1>' . $player . '</h1><br />';

	echo '<table style="width:80%">';
	echo '<td><h3>Skill Name</h3></td>';
	echo '<td><h3>Player Rank</h3></td>';
	echo '<td><h3>Skill Level</h3></td>';
	echo '<td><h3>Experience</h3></td>';

	foreach ($rows as $data) {
		echo '<tr>';
		//get row data
	    $row_data = explode(',', $data);

	    $info[$row]['rank']          = $row_data[0];
	    $info[$row]['level']         = $row_data[1];
	    $info[$row]['exp'] 		 = $row_data[2];
	
	    //display data
	    echo '<td><img src="img/' . $skill_icon[$counter] . '">    ' . $skills[$counter] . '</td>';
	    echo '<td>' . number_format($info[$row]['rank']) . '</td>';
	    echo '<td>' . number_format($info[$row]['level']) . '</td>';
	    echo '<td>' . number_format($info[$row]['exp']) . '</td>';

	    $counter++;
	
		if ($counter > 26) {
			break;
		}

		echo '</tr>';
	}
	echo '</table>';
	?>
	<br />

<p>This page will decode a RuneScape lite-highscore file into a readable table. Enter a username to view that players current RuneScape highscores.</p>
	</div>
</div>
<!-- End of wrapper -->
<?php include("/home/mark/website/footer.php") ?>
</body>
</html>
