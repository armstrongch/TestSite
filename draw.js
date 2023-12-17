var draw = {
	gameState: function(game, anotherPlayerElf)
	{
		$('#recipesDiv').html(this.recipesDivHTML(game, anotherPlayerElf));
		$('#elvesForHireDiv').html(this.elvesForHireDivHTML(game, anotherPlayerElf));
		$('#ingredientsMarketDiv').html(this.ingredientsMarketDivHTML(game, anotherPlayerElf));
		$('#playersDiv').html(this.playersDivHTML(game, anotherPlayerElf));
	},
	
	recipesDivHTML: function(game, anotherPlayerElf)
	{
		var html = "";
		for (var i = 0; i < game.recipeMarket.length; i += 1)
		{
			if (game.playerCanBakeRecipe(i) && !anotherPlayerElf)
			{
				html += "<span class='clickable' onclick='game.bakeCookie(" + i.toString() + ")'>" + game.recipeMarket[i].getHTML() + "</span>";
			}
			else
			html += game.recipeMarket[i].getHTML();
		}
		
		return html;
	},
	
	elvesForHireDivHTML: function(game, anotherPlayerElf)
	{
		var html = "";
		for (var i = 0; i < game.elfMarket.length; i += 1)
		{
			if (anotherPlayerElf)
			{
				html += game.elfMarket[i].getHTML();
			}
			else
			{
				html += "<span class='clickable' onclick='game.claimElfFromMarket(" + i.toString() + ")'>" + game.elfMarket[i].getHTML() + "</span>";
			}
		}
		
		return html;
	},
	
	ingredientsMarketDivHTML: function(game, anotherPlayerElf)
	{
		var html = "INGREDIENTS MARKET: ";
		for (var i = 0; i < game.ingredientMarket.length; i += 1)
		{
			if (anotherPlayerElf)
			{
				html += ingNames[game.ingredientMarket[i]] + " ";
			}
			else
			{
				html += "<span class='clickable' onclick='game.claimIngredientFromMarket(" + i.toString() + ")'>" + ingNames[game.ingredientMarket[i]] + "</span> ";
			}
		}
		
		return html;
	},
	
	playersDivHTML: function(game, anotherPlayerElf)
	{
		var html = "PLAYERS: ";
		for (var i = 0; i < game.players.length; i += 1)
		{
			var playerDisplayIndex = game.activePlayerIndex + i;
			if (playerDisplayIndex >= game.players.length)
			{
				playerDisplayIndex -= game.players.length;
			}
			html += game.players[playerDisplayIndex].getHTML(game, playerDisplayIndex, anotherPlayerElf);
		}
		
		return html;
	},
	
	writeToLog: function(info)
	{
		$('#internalLogDiv').html("<p>" + info + "</p>" + $('#internalLogDiv').html());
	}
}
