function recipe(ing, points)
{
	this.ing = ing;
	this.ingNames = [];
	for (var i = 0; i < ing.length; i += 1)
	{
		this.ingNames.push(ingNames[ing[i]]);
	}
	this.points = points;
	this.roundsAvailable = 3;
	this.getHTML = function()
	{
		return "<p>RECIPE: Spend " + this.ingNames.join(" + ") + " to gain <span class='points'>" + this.points.toString() + " points.</span> Expires in " + this.roundsAvailable.toString() + " rounds.</p>";
	}
}

function getRecipeDeck()
{
	var recipes = [];
	
	recipes.push(new recipe([0,0], 1));
	recipes.push(new recipe([1,1], 1));
	recipes.push(new recipe([2,2], 1));
	
	recipes.push(new recipe([0,1], 2));
	recipes.push(new recipe([1,2], 2));
	recipes.push(new recipe([2,0], 2));
	
	recipes.push(new recipe([0,0,0], 2));
	recipes.push(new recipe([1,1,1], 2));
	recipes.push(new recipe([2,2,2], 2));
	
	recipes.push(new recipe([0,1,2], 3));
	
	return recipes;
}