var ing = {
	C: 0,
	O: 1,
	F: 2
};

var ingNames_NoFormat = {
	0: "CHC",
	1: "OAT",
	2: "SPK"
}

var ingNames = {
	0: "<span class='chocolate'>" + ingNames_NoFormat[0] + "</span>",
	1: "<span class='oatmeal'>" + ingNames_NoFormat[1] + "</span>",
	2: "<span class='sprinkles'>" + ingNames_NoFormat[2] + "</span>"
}

var ingFunctions = {
	
	getIngredientDeck: function(playerCount)
	{
		var ingredients = [];
		
		for (var i = 0; i < playerCount*3; i += 1)
		{
			ingredients.push(ing.C);
			ingredients.push(ing.O);
			ingredients.push(ing.F);
		}
		
		return ingredients;
	},
	
	getMostCommonMarketIngredientArray: function()
	{
		if (game.ingredientMarket.length == 0) { return []; }
		
		var counts = [];
		for (var i = 0; i < 3; i += 1)
		{
			counts.push(game.ingredientMarket.filter(x => x == i).length);
		}
		var maxCount = Math.max(...counts);
		
		var maxIngs = [];
		for (var i = 0; i < counts.length; i += 1)
		{
			if (counts[i] == maxCount) { maxIngs.push(i); }
		}
		
		return maxIngs;
	},
	
	getFewestOwnedIngredients: function()
	{
		var ingredients = game.activePlayer().ingredients;
		var counts = [];
		for (var i = 0; i < 3; i += 1)
		{
			counts.push(ingredients.filter(x => x == i).length);
		}
		var minCount = Math.min(...counts);
		
		var minIngs = [];
		for (var i = 0; i < counts.length; i += 1)
		{
			if (counts[i] == minCount) { minIngs.push(i); } 
		}
		
		return minIngs;
	}
	
}



