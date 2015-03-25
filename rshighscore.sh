#!/bin/bash

cd /home/mark/runescape/
# Set the file format to name-year-month-day
filename=$(date +%F)

# For each player, grab the highscores
cat players.txt | while read name
do
	# do something with $line here
	mkdir "./$name/"
	mkdir "./$name/rs3/"
	mkdir "./$name/osrs/"
	wget -nv -O "./$name/rs3/$name-$filename.rs" "http://hiscore.runescape.com/index_lite.ws?player=$name"
	wget -nv -O "./$name/osrs/$name-$filename.osrs" "http://services.runescape.com/m=hiscore_oldschool/index_lite.ws?player=$name"
	sleep 5
done

