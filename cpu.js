var cpu = {
	roundEndCleanup: false,
	
	useAnotherElf: function()
	{
		var foundTarget = false;
		var checkIndex = game.activePlayerIndex + 1;
		var playerNum = game.activePlayerIndex;
		
		while (!foundTarget)
		{
			if (checkIndex == game.currentPlayerIndex)
			{
				alert("Error! Could not find another elf for CPU to use.");
			}
			else if (checkIndex >= game.players.length)
			{
				checkIndex = 0;
			}
			else
			{
				for (var i = 0; i < game.players[checkIndex].elves.length; i += 1)
				{
					if (game.activePlayerCanAffordElf(playerNum, i))
					{
						game.useElf(playerNum, i);
						i = game.players[checkIndex].elves.length;
						foundTarget = true;
					}
				}
			}
		}
	},
	
	roundEndCleanup: function()
	{
		if (game.activePlayer().ingredients.length < 3)
		{
			$( "input" ).last().prop('checked', true);
		}
		///else keep ingredients by default
		
		aux.submitPassTurn(game.activePlayerIndex);
	},
	
	playTurn: function()
	{
		var player = game.activePlayer();
		var playerNum = game.activePlayerIndex;
		var elfCount = player.elves.length;
		var elvesAreAvailable = game.elfMarket.length > 0;
		var canAffordLeftElf = false;
		var canAffordRightElf = false;
		
		
		if (elfCount > 0)
		{
			canAffordLeftElf = game.activePlayerCanAffordElf(playerNum, 0);
			
			if (elfCount > 1)
			{
				canAffordRightElf = game.activePlayerCanAffordElf(playerNum, 1);
			}
		}
		
		if (game.ingredientMarket.length > 0)
		{
			if (elfCount == 0 && elvesAreAvailable)
			{
				game.claimElfFromMarket(0);
			}
			else if (elfCount == 1 && canAffordLeftElf)
			{
				game.useElf(playerNum, 0);
			}
			else if (elfCount == 1 && elvesAreAvailable)
			{
				game.claimElfFromMarket(0);
			}
			else if (elfCount == 2 && canAffordLeftElf)
			{
				game.useElf(playerNum, 0);
			}
			else if (elfCount == 2 && canAffordRightElf)
			{
				game.useElf(playerNum, 1);
			}
			else
			{
				game.claimIngredientFromMarket(0);
			}
		}
		else
		{
			for (var i = 0; i < game.recipeMarket.length; i += 1)
			{
				if (game.playerCanBakeRecipe(i))
				{
					game.bakeCookie(i);
					i = game.recipeMarket.length;
				}
			}
		}
	},
	
};