function player(isHuman)
{
	this.isHuman = isHuman;
	this.ingredients = [];
	this.elves = [];
	this.score = 0;
	this.passed = false;
	
	this.getHTML = function(game, playerNum, anotherPlayerElf)
	{
		var playerDivClass = game.activePlayerIndex == playerNum ? "activePlayerDiv" : "playerDiv";
		
		//Can elves be used? Interacts with the elf that uses other player's elves.
		var useElves = (game.activePlayerIndex == playerNum && !anotherPlayerElf) || (game.activePlayerIndex != playerNum && anotherPlayerElf);
		
		var html = "<div class='" + playerDivClass + "'><p>PLAYER " + (playerNum+1).toString() + "</p>";
		
		//Ingredients
		html += "<p>INGREDIENTS: ";
		for (var i = 0; i < this.ingredients.length; i += 1)
		{
			html += ingNames[this.ingredients[i]] + " ";
		}
		html += "</p>";
		
		//Elves
		for (var i = 0; i < this.elves.length; i += 1)
		{
			if (
				useElves &&
				game.activePlayerCanAffordElf(playerNum, i) &&
				game.ingredientMarket.length > 0 &&
				( this.elves[i].get[0] != elfGiveGetMappings.elf || !anotherPlayerElf )
			)
			{
				html += "<span class='clickable' onclick='game.useElf(" + playerNum + ", " + i.toString() + ")'>" + this.elves[i].getHTML(true, true) + "</span>";
			}
			else
			{
				html += this.elves[i].getHTML(true, true);
			}
		}
		
		//Points
		html += "<p><span class='points'>POINTS: " + this.score.toString() + "</span></p>"

		html += "</div>";
		
		return html;
	}
}