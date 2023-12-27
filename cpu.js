var cpu = {
	roundEndCleanup: false,
	
	useAnotherElf: function()
	{
		var result = game.getFirst_UseOther_ValidElf();
		if (result.playerIndex != -1)
		{
			game.useElf(result.playerIndex, result.elfIndex);
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
		
		//console.log("CPU Turn: Player " + playerNum.toString());
		
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
				//console.log("   Claim Elf");
				game.claimElfFromMarket(0);
			}
			else if (elfCount == 1 && canAffordLeftElf)
			{
				//console.log("   Use Left Elf");
				game.useElf(playerNum, 0);
			}
			else if (elfCount == 1 && elvesAreAvailable)
			{
				//console.log("   Claim Elf");
				game.claimElfFromMarket(0);
			}
			else if (elfCount == 2 && canAffordLeftElf)
			{
				//console.log("   Use Left Elf");
				game.useElf(playerNum, 0);
			}
			else if (elfCount == 2 && canAffordRightElf)
			{
				//console.log("   Use Right Elf");
				game.useElf(playerNum, 1);
			}
			else
			{
				//console.log("   Claim Ingredient");
				game.claimIngredientFromMarket(0);
			}
		}
		else
		{
			//console.log("   Bake Cookies");
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