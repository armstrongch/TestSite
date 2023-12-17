//cd c:/users/chris/documents/html/elfbakerymanagerturbo
function gameConst(playerCount, humanCount)
{
	this.players = [];
	this.activePlayerIndex = 0;
	this.firstPlayerIndex = 0;
	
	this.activePlayer = function() { return this.players[this.activePlayerIndex]; }
	
	this.recipeDeck = getRecipeDeck();
	this.recipeMarket = [];
	this.recipeDiscard = [];
	
	this.ingredientDeck = ingFunctions.getIngredientDeck(playerCount);
	this.ingredientMarket = [];
	this.ingredientDiscard = [];
	
	this.elfDeck = getElfDeck();
	this.elfMarket = [];
	this.elfDiscard = [];
	
	for (var i = 0; i < playerCount; i += 1)
	{
		this.players.push(new player(i < humanCount));
	}
	
	this.recipeDeck.sort(() => Math.random() - 0.5);
	for (var i = 0; i < 3; i += 1)
	{
		this.recipeMarket.push(this.recipeDeck.pop());
	}
	this.recipeMarket[0].roundsAvailable = 1;
	this.recipeMarket[1].roundsAvailable = 2;
	
	this.ingredientDeck.sort(() => Math.random() - 0.5);
	for (var i = 0; i < 6; i += 1)
	{
		this.ingredientMarket.push(this.ingredientDeck.pop());
	}
	
	this.elfDeck.sort(() => Math.random() - 0.5);
	for (var i = 0; i < 3; i += 1)
	{
		this.elfMarket.push(this.elfDeck.pop());
	}
	
	this.startNewRound = function()
	{
		//Update the age of all recipes. Remove the oldest, and add a new one.
		for (var i = this.recipeMarket.length - 1; i >= 0; i -= 1)
		{
			if (this.recipeMarket[i].roundsAvailable == 1)
			{
				this.recipeDiscard.push(this.recipeMarket[i]);
				this.recipeMarket.splice(i, 1);
			}
			else
			{
				this.recipeMarket[i].roundsAvailable -= 1;
			}
		}
		this.recipeMarket.push(this.recipeDeck.pop());
		
		//add ingredients discard to ingredients deck and shuffle.
		while (this.ingredientDiscard.length > 0) { this.ingredientDeck.push(this.ingredientDiscard.pop()); }
		this.ingredientDeck.sort(() => Math.random() - 0.5);
		//Refill the market up to 6 if necessary.
		while (this.ingredientMarket.length < 6) { this.ingredientMarket.push(this.ingredientDeck.pop()); }
		
		//add elf discard to elf deck and shuffle
		while (this.elfDiscard.length > 0) { this.elfDeck.push(this.elfDiscard.pop()); }
		this.elfDeck.sort(() => Math.random() - 0.5);
		//discard current elf market
		while (this.elfMarket.length > 0) { this.elfDiscard.push(this.elfMarket.pop()); }
		//add 3 new elves to market from deck
		for (var i = 0; i < 3; i += 1)
		{
			this.elfMarket.push(this.elfDeck.pop());
		}
		
		//no players have passed, and no elves are tired
		for (var i = 0; i < this.players.length; i += 1)
		{
			this.players[i].passed = false;
			for (var j = 0; j < this.players[i].elves.length; j += 1)
			{
				this.players[i].elves[j].tired = false;
			}
		}
		
		draw.writeToLog("A new round begins");
	};
	
	this.claimIngredientFromMarket = function(marketIndex)
	{
		var ing = this.ingredientMarket[marketIndex];
		this.activePlayer().ingredients.push(ing);
		this.ingredientMarket.splice(marketIndex, 1);
		if (this.ingredientDeck.length > 0)
		{
			this.ingredientMarket.push(this.ingredientDeck.pop());
		}
		draw.writeToLog("Player " + (this.activePlayerIndex+1).toString() + " claims " + ingNames[ing] + " from the market");
		this.nextTurn(-1);
	};
	
	this.nextTurn = function(elfIndexToTire)
	{
		if (this.players.filter(p => !p.passed).length == 0)
		{
			this.startNewRound();
		}
		
		for (var i = 0; i < this.activePlayer().elves.length; i += 1)
		{
			var elf = this.activePlayer().elves[i];
			if (i == elfIndexToTire) { elf.tired = true; } else { elf.tired = false; }
		}

		this.activePlayerIndex += 1;
		if (this.activePlayerIndex >= this.players.length)
		{
			this.activePlayerIndex = 0;
		}
		if (this.activePlayer().passed)
		{
			this.nextTurn(-1);
		}
		
		draw.gameState(game, false);
	};
	
	this.passTurn = function()
	{
		this.activePlayer().passed = true;
		draw.writeToLog("Player " + (this.activePlayerIndex+1).toString() + " passes their turn.");
		aux.passTurn(this.activePlayerIndex);
	};
	
	this.claimElfFromMarket = function(marketIndex)
	{
		var elf = this.elfMarket[marketIndex];
		this.activePlayer().elves.push(elf);
		this.elfMarket.splice(marketIndex, 1);
		if (this.elfDeck.length > 0)
		{
			this.elfMarket.push(this.elfDeck.pop());
		}
		draw.writeToLog("Player " + (this.activePlayerIndex+1).toString() + " claims an elf from the market.");
		this.nextTurn(-1);
	};
	
	this.playerCanBakeRecipe = function(marketIndex)
	{
		var recipe = this.recipeMarket[marketIndex];
		var hasAllIngredients = true;
		for (var i = 0; i < 3; i += 1)
		{
			var recipeCount = recipe.ing.filter(x => x == i).length;
			var playerCount = this.activePlayer().ingredients.filter(x => x == i).length;
			if (recipeCount > playerCount)
			{
				hasAllIngredients = false;
			}
		}
		return hasAllIngredients;
	}
	
	this.activePlayerCanAffordElf = function(playerWhoOwnsElfIndex, elfIndex)
	{
		var player = this.activePlayer();
		var elf = this.players[playerWhoOwnsElfIndex].elves[elfIndex];
		
		var hasAllIngredients = true;
		
		//we only need to check the 3 raw ingredient requirements. Everything else is good no matter what ingredients the player has. For example: "All Chocolate" still works if the player has 0 chocolate. This may change if the elf requirements change.
		for (var i = 0; i < 3; i += 1)
		{
			var elfCount = elf.give.filter(x => x == i).length;
			var playerCount = this.activePlayer().ingredients.filter(x => x == i).length;
			if (elfCount > playerCount)
			{
				hasAllIngredients = false;
			}
		}
		
		var validGet = true;
		//if the GET requirements gives the most common ingredient, we need to make sure there is exactly 1 max ing. If there are 3 CHC and 3 OAT, you cannot use this elf, there must be an explicit max.
		if (elf.get[0] == elfGiveGetMappings.comMkt)
		{
			var maxIngs = ingFunctions.getMostCommonMarketIngredientArray();
			if (maxIngs.length != 1)
			{
				validGet = false;
			}
		}
		else if (elf.get[0] == elfGiveGetMappings.threeLCom)
		{
			var minIngs = ingFunctions.getFewestOwnedIngredients();
			if (minIngs.length != 1)
			{
				validGet = false;
			}
		}
		else if (elf.get[0] == elfGiveGetMappings.elf)
		{
			validGet = false;
			for (var i = 0; i < game.players.length; i += 1)
			{
				if (i != this.activePlayerIndex)
				{
					for (var j = 0; j < game.players[i].elves.length; j += 1)
					{
						var elf = game.players[i].elves[j];
						
						//don't allow player loop this ability lol
						if (elf.get[0] != elfGiveGetMappings.elf && game.activePlayerCanAffordElf(i, j))
						{
							validGet = true;
						}
					}
				}
			}
		}
		
		return hasAllIngredients && !elf.tired && validGet;
	};
	
	this.useElf = function(playerOwnerIndex, playerElfIndex)
	{
		var player = game.players[playerOwnerIndex];
		var elf = player.elves[playerElfIndex];
		elf.processGive();
		var passTurn = elf.processGet(elf.get);
		draw.writeToLog("Player " + (this.activePlayerIndex+1).toString() + " uses an elf.");
		if (passTurn)
		{
			var elfToTireIndex = playerElfIndex;
			
			//If elf is being used by another player, tire the active player's elf.
			if (playerOwnerIndex != game.activePlayerIndex)
			{
				var activePlayer = this.activePlayer();
				for (var i = 0; i < this.activePlayer().elves.length; i += 1)
				{
					if (this.activePlayer().elves[i].get[0] = elfGiveGetMappings.elf)
					{
						elfToTireIndex = i;
					}
				}
			}
			this.nextTurn(playerElfIndex);
		}
	};
	
	this.bakeCookie = function(marketIndex)
	{
		if (!game.playerCanBakeRecipe(marketIndex))
		{
			alert("Error! Player does not have enough ingredients for recipe!");
		}
		
		var recipe = this.recipeMarket[marketIndex];
		var player = this.activePlayer();
		
		for (var i = 0; i < recipe.ing.length; i += 1)
		{
			this.ingredientDiscard.push(recipe.ing[i]);
			player.ingredients.splice(player.ingredients.indexOf(recipe.ing[i]), 1);
		}
		
		player.score += recipe.points;
		draw.writeToLog("Player " + (this.activePlayerIndex+1).toString() + " bakes cookies for <span class='points'>" + recipe.points.toString() + " points</span>.");
		this.nextTurn(-1);
	};
	
};	