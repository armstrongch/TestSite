//cd c:/users/chris/documents/html/elfbakerymanagerturbo
function gameConst(playerCount, humanCount)
{
	this.players = [];
	this.activePlayerIndex = 0;
	this.firstPlayerIndex = 0;
	
	this.activePlayer = function() { return this.players[this.activePlayerIndex]; }
	
	this.recipeDeck = getRecipeDeck();
	this.recipeMarket = [];
	
	this.ingredientDeck = ingFunctions.getIngredientDeck(playerCount);
	this.ingredientMarket = [];
	this.ingredientDiscard = [];
	
	this.elfDeck = getElfDeck();
	this.elfMarket = [];
	
	for (var i = 0; i < playerCount; i += 1)
	{
		var isHuman = i < humanCount;
		this.players.push(new player(isHuman));
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
		//Update the age of all recipes. Move the oldest to the bottom of the deck, and add one from the top of the deck.
		for (var i = this.recipeMarket.length - 1; i >= 0; i -= 1)
		{
			if (this.recipeMarket[i].roundsAvailable == 1)
			{
				this.recipeMarket[i].roundsAvailable = 3;
				this.recipeDeck.unshift(this.recipeMarket[i]);
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
		this.nextTurn(-1, true);
	};
	
	this.nextTurn = function(elfIndexToTire, moveOnToNextPlayer)
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

		if (moveOnToNextPlayer)
		{
			this.activePlayerIndex += 1;
			if (this.activePlayerIndex >= this.players.length)
			{
				this.activePlayerIndex = 0;
			}
			if (this.activePlayer().passed)
			{
				this.nextTurn(-1, true);
			}
		}
		
		draw.gameState(game, false);
		
		if (this.ingredientMarket.length == 0)
		{
			var canAffordAnyRecipe = false;
			for (var i = 0; i < this.recipeMarket.length; i += 1)
			{
				if (this.playerCanBakeRecipe(i)) { canAffordAnyRecipe = true; }
			}
			if (!canAffordAnyRecipe)
			{
				this.passTurn();
			}
			else if (!this.activePlayer().isHuman)
			{
				cpu.playTurn();
			}
		}
		else if (!this.activePlayer().passed && !this.activePlayer().isHuman)
		{
			cpu.playTurn();
		}
	};
	
	this.passTurn = function()
	{
		this.activePlayer().passed = true;
		draw.writeToLog("Player " + (this.activePlayerIndex+1).toString() + " does not have enough ingredients to bake any more cookies, and passes their turn.");
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
		this.nextTurn(-1, true);
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
		
		for (var i = 0; i < 3; i += 1)
		{
			var elfCount = elf.give.filter(x => x == i).length;
			var playerCount = this.activePlayer().ingredients.filter(x => x == i).length;
			if (elfCount > playerCount)
			{
				hasAllIngredients = false;
			}
		}
		
		//To give "All Chocolate" you must have at least 1 chocolate.
		if (elf.give[0] >= 3 && elf.give[0] <= 5)
		{
			var playerCount = this.activePlayer().ingredients.filter(x => x == (elf.give[0]-3)).length; 
			if (playerCount == 0)
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
			this.nextTurn(playerElfIndex, true);
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
		this.nextTurn(-1, false);
	};
	
};	