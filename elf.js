var elfGiveGetMappings = 
{
	C: ing.C, //0
	O: ing.O, //1
	F: ing.F, //2
	allC: 3,
	allO: 4,
	allF: 5,
	comMkt: 6, //all of most common market ingredient
	threeLCom: 7, //3 of the ingredient you have the least of
	elf: 8, //another player's elf
	allMkt: 9, //all ingredients in market
}

var elfGiveGetTextMappings = 
{
	0: ingNames[0],
	1: ingNames[1],
	2: ingNames[2],
	3: "All " + ingNames[0],
	4: "All " + ingNames[1],
	5: "All " + ingNames[2],
	6: "All of the most common ingredient in the market.",
	7: "3 of the ingredient you have the least of.",
	8: "Use another player's elf",
	9: "All of the ingredients in the market.",
}

function elf(give, get)
{
	this.give = give;
	this.get = get;
	this.tired = false;
	
	this.giveText = [];
	for (var i = 0; i < give.length; i += 1)
	{
		this.giveText.push(elfGiveGetTextMappings[give[i]]);
	}
	
	this.getText = [];
	for (var i = 0; i < get.length; i += 1)
	{
		this.getText.push(elfGiveGetTextMappings[get[i]]);
	}
	
	this.getHTML = function()
	{
		var giveHtml = "";
		if (this.give.length > 0)
		{
			giveHtml = "Give " + this.giveText.join(" + ") + ",";
		}
		
		var getHtml = " Get: " + this.getText.join(" + ");
		
		var tiredHtml = this.tired ? "(TIRED) " : "";
		
		return "<p>ELF: " + tiredHtml + giveHtml + getHtml + "</p>";
	}
	
	this.processGive = function()
	{
		var player = game.activePlayer();
		var m = elfGiveGetMappings;
		var giveIngredients = this.give.filter(g => g <= 2).length > 0;
		//there are only 2 kinds of gives currently: individual ingredients, and ALL of an ingredient. This may need to be fleshed out in the future.
		if (giveIngredients)
		{
			for (var i = 0; i < this.give.length; i += 1)
			{
				player.ingredients.splice(player.ingredients.indexOf(this.give[i]), 1);
				game.ingredientDiscard.push(this.give[i]);
			}
		}
		else if (this.give[0] <= 5)
		{
			var allIng = 0; //all chocolate
			if (this.give[0] == m.allO) { allIng = 1; } //all oatmeal
			if (this.give[0] == m.allF) { allIng = 2; } //all frosting
			
			for (var i = player.ingredients.length - 1; i >= 0; i -= 1)
			{
				if (player.ingredients[i] == allIng)
				{
					game.ingredientDiscard.push(allIng);
					player.ingredients.splice(i, 1);
				}
			}				
		}
	};
	
	this.processGet = function(getArray)
	{
		var player = game.activePlayer();
		var m = elfGiveGetMappings;
		var getIngredients = getArray.filter(g => g <= 2).length > 0;
		var passTurn = true;
		
		if (getIngredients)
		{
			for (var i = 0; i < getArray.length; i += 1)
			{
				if (game.ingredientMarket.includes(getArray[i]))
				{
					player.ingredients.push(getArray[i]);
					game.ingredientDiscard.push(getArray[i]);
					game.ingredientMarket.splice(game.ingredientMarket.indexOf(getArray[i]), 1);
				}
			}
		}
		else
		{
			switch(getArray[0])
			{
				case 3:
				case 4:
				case 5:
					var ing = getArray[0] - 3;
					for (var i = game.ingredientMarket.length-1; i >= 0; i -= 1)
					{
						if (game.ingredientMarket[i] == ing)
						{
							player.ingredients.push(ing);
							game.ingredientMarket.splice(i, 1);
						}
					}
					break;
				case m.comMkt: //"All of the most common ingredient in the market"
					var ing = ingFunctions.getMostCommonMarketIngredientArray()[0];
					this.processGet([ing+3]);
					break;
				case m.threeLCom: //"3 of the ingredient you have the least of"
					var ing = ingFunctions.getFewestOwnedIngredients()[0];
					this.processGet([ing, ing, ing]);
					break;
				case m.elf: //"Use another player's elf"
					passTurn = false;
					if (game.activePlayer().isHuman)
					{
						draw.gameState(game, true);
					}
					else
					{
						cpu.useAnotherElf();
					}
					break;
				case m.allMkt:
					var newGetArray = [];
					for (var i = 0; i < game.ingredientMarket.length; i += 1)
					{
						newGetArray.push(game.ingredientMarket[i]);
					}
					this.processGet(newGetArray);
					break;
			}
			
		}
		
		while (game.ingredientDeck.length > 0 && game.ingredientMarket.length < 6)
		{
			game.ingredientMarket.push(game.ingredientDeck.pop());
		}
		
		return passTurn;
	}
}

function getElfDeck()
{
	var m = elfGiveGetMappings;
	
	var elves = [];
	
	elves.push(new elf([], [0,0])); //take C + C
	elves.push(new elf([], [1,1]));
	elves.push(new elf([], [2,2]));
	
	elves.push(new elf([0], [1,1,1])); //give C, get O + O + O
	elves.push(new elf([1], [2,2,2]));
	elves.push(new elf([2], [0,0,0]));
	
	elves.push(new elf([m.allC], [m.allO])); //give all C, get all O
	elves.push(new elf([m.allO], [m.allF]));
	elves.push(new elf([m.allF], [m.allC]));
	
	for (var i = 0; i < 3; i += 1) {
		elves.push(new elf([], [m.comMkt])); //get all of most common ingredient in the market
	}
	
	for (var i = 0; i < 3; i += 1) {
		elves.push(new elf([], [m.threeLCom])); //get 1 of the ingredient you have the least of
	}
	
	for (var i = 0; i < 3; i += 1) {
		elves.push(new elf([], [m.elf])); //use another player's elf
	}
	
	elves.push(new elf([0,0], [m.allMkt])); //give C + C, get all ingredients in the market
	elves.push(new elf([1,1], [m.allMkt]));
	elves.push(new elf([2,2], [m.allMkt]));
	
	return elves;
}