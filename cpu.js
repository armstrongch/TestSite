var cpu = {
	playTurn: function()
	{
		var bestRecipeIndex = this.getBestRecipeIndex();
	},
	
	getBestRecipeIndex: function()
	{
		var best_recipeIndex = 0;
		var best_scorePerIng = 0;
		for (var i = 0; i < game.recipeMarket.length; i += 1)
		{
			var testRecipe = game.recipeMarket[i];
			var test_scorePerIng = testRecipe.points / testRecipe.ing.length;
			if (test_scorePerIng > best_scorePerIng)
			{
				best_scorePerIng = test_scorePerIng;
				best_recipeIndex = i;
			}
		}
		
		return best_recipeIndex;
	}
};