function setupRunnerForRace()
{
	//reset energy
	this.energy = this.startingEnergy + this.bonusEnergy;
	this.bonusEnergy = 0;
	
	//go to starting line
	this.position = 0;
	
	//move any discarded cards to deck
	while(this.discard.length > 0)
	{
		this.deck.push(this.discard.pop());
	}
	
	//move any cards in hand to deck
	while(this.hand.length > 0)
	{
		this.deck.push(this.hand.pop());
	}
	
	//move any cards that start in hand into hand
	for (var i = this.deck.length - 1; i >= 0; i -= 1)
	{
		if (this.deck[i].startsInHand)
		{
			this.hand.push(this.deck[i]);
			this.deck.splice(i, 1);
		}
	}
	
	//shuffle deck
	this.deck.sort(() => Math.random() - 0.5);
	
	while(this.hand.length < this.startingHandSize)
	{
		this.hand.push(this.deck.pop());
	}
}

function runner()
{
	var name = runner_names.sort(() => Math.random() - 0.5).filter(n => !game.runners.some(r => r.name == n))[0];
	return new named_runner(name);
}

function named_runner(name)
{
	var uppercaseName = name.toUpperCase();
	
	if (game.runners.filter(r => r.name == uppercaseName).length > 0)
	{
		throw new Error('Runner name must be unique.');
	}
	else
	{
		this.name = uppercaseName;
		this.teamName = null;
		this.position = 0;
		this.moveDistance = 0;
		
		this.energy = 100;
		this.startingEnergy = 100;
		this.bonusEnergy = 0;
		
		this.deck = [];
		this.hand = [];
		this.discard = [];
		this.startingHandSize = 4;
		
		this.deck.push(new runCard());
		this.deck.push(new runCard());
		this.deck.push(new runCard());
		
		this.deck.push(new surgeCard());
		this.deck.push(new surgeCard());
		
		this.deck.push(new recoverCard());
		this.deck.push(new recoverCard());
		
		this.deck.push(new kickCard());
		
		this.deck.push(new coastCard());
		this.deck.push(new coastCard());
		
		this.deck.push(new reelInCard());
		this.deck.push(new reelInCard());
		
		this.deck.push(new fatigueCard());
		
		this.setupForRace = setupRunnerForRace;
		
		this.team = function()
		{
			return game.teams.filter(t => t.name == this.teamName)[0];
		}
		
		this.getCardPriority = function(card, runnersInRace)
		{
			if (!card.valid(this, runnersInRace)) { return -10000; }
			else if (card.use == useKickMethod) { return card.distance*2 + runner.position - 100; }
			else { return card.distance; }
		}
		
		this.pickCard = function(runnersInRace)
		{
			var runner = this;
			this.hand.sort(
				function(a,b) { return runner.getCardPriority(b, runnersInRace) - runner.getCardPriority(a, runnersInRace); }
			);
			return this.hand[0];
		}
		
		this.pass = false;
		this.passEnergyCost = 10;
		
		this.canvasPosition = { x: null, y: null, rad: null };
		
		this.draw = function(x, y, rad)
		{
			this.canvasPosition.x = x;
			this.canvasPosition.y = y;
			this.canvasPosition.rad = rad;
			
			var ctx = raceCanvasManager.ctx;
			
			ctx.fillStyle = this.team().color;
			ctx.beginPath();
			ctx.arc(x + rad, y + rad, rad*4/5, 0, 2*Math.PI);
			ctx.fill();
		},
		
		this.getEnergyLevelDesc = function()
		{
			var max = this.startingEnergy;
			if (this.energy > max * 0.65) { return "high"; } else if (this.energy > max * 0.35) { return "medium"; } else return "low";
		},
		
		this.getQuickRaceInfoTR = function()
		{
			var name = this.name;
			if (name == game.playerName)
			{
				name = "<b>" + this.name + " (YOU) </b>";
			}
			
			return "<tr>" +
					"<td class = 'tooltipTD'>" + name + "</td>" +
					"<td class = 'tooltipTD' style='color: " + this.team().color + "'>" + this.teamName + "</td>" +
					"<td class = 'tooltipTD'>" + this.getEnergyLevelDesc() + " energy </td>" + 
				"</tr>";
		},
		
		this.currentSpace = function()
		{
			return game.currentRace().course().spaces[this.position];
		}
		
		game.runners.push(this);
	}
}