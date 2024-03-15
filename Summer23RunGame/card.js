var invalidCardReasons =
{
	ENERGY: "ENERGY",
	SPECIAL: "SPECIAL",
	NONE: "NONE"
};

function genericGetInvalidReasonMethod(runner, runnersInRace)
{
	var calculatedEnergy = terrainTypes.getModifiedEnergy(runner.currentSpace().terrainType, this.energy);
	if (runner.energy < calculatedEnergy) { return invalidCardReasons.ENERGY; }
	else { return invalidCardReasons.NONE; }
}

function genericUseMethod(runner)
{
	runner.moveDistance = terrainTypes.getModifiedDistance(this, runner.currentSpace().terrainType);
	runner.energy -= this.energy;
	
	if (this.discardAfterPlaying)
	{
		var cardIndex = runner.hand.indexOf(this);
		runner.discard.push(runner.hand[cardIndex]);
		runner.hand.splice(cardIndex, 1);
	}
}

function useRecoverMethod(runner)
{
	genericUseMethod.call(this, runner);
	runner.energy += 10;
}

function useKickMethod(runner)
{
	genericUseMethod.call(this, runner);
	runner.energy = 0;
}

function coastGetInvalidReasonMethod(runner, runnersInRace)
{
	if (runnersInRace.filter(r => r.name != runner.name && r.position == runner.position).length > 0)
	//at least one other runner shares a space
	{
		return genericGetInvalidReasonMethod.call(this, runner, runnersInRace);
	}
	else
	{
		return invalidCardReasons.SPECIAL;
	}
}

function reelInGetInvalidReasonMethod(runner, runnersInRace)
{
	if (runnersInRace.filter(r => r.name != runner.name 
		&& r.position > runner.position //at least one other runner is ahead
		&& r.position <= runner.position + 3 //but <= 300 meters ahead
		).length > 0
	)
	{
		return genericGetInvalidReasonMethod.call(this, runner, runnersInRace);
	}
	else
	{
		return invalidCardReasons.SPECIAL;
	}
}

function card(name, distance, energy, specialText, getInvalidReasonMethod, useMethod, discardAfterPlaying, startsInHand)
{
	this.name = name;
	this.distance = distance;
	this.energy = energy;
	this.specialText = specialText;
	this.invalidReason = getInvalidReasonMethod;
	this.valid = function(runner, runnersInRace) { return this.invalidReason(runner, runnersInRace) == invalidCardReasons.NONE; }
	this.use = useMethod;
	this.discardAfterPlaying = discardAfterPlaying;
	this.startsInHand = startsInHand;
	
	this.getHTMLtoDraw = function()
	{
		var cardDiv = document.createElement("div");
		var card = this;
		var invalidReason = this.invalidReason(game.player(), game.currentRace().runners())
		
		var name = document.createElement("p");
		name.setAttribute('style', 'text-align: center');
		name.innerHTML = card.name;
		cardDiv.append(name);
		
		if (invalidReason == invalidCardReasons.NONE)
		{
			cardDiv.addEventListener("click", function() {
				game.player().pass = $('#playerPassInput').is(':checked');
				if (raceCanvasManager.selectedCard != card)
				{
					raceCanvasManager.selectedCard = card;
					raceCanvasManager.draw();
				}
				else
				{
					raceCanvasManager.selectedCard.use(game.player());
					raceCanvasManager.selectedCard = null;
					game.currentRace().processTurn();
				}
			});
			cardDiv.setAttribute('class', 'card selectableCard');
		}
		else
		{
			cardDiv.setAttribute('class', 'card invalidCard');
		}
		
		var distance = document.createElement("p");
		distance.innerHTML = "Distance: " + terrainTypes.getModifiedDistance(this, game.player().currentSpace().terrainType)*100 + " meters";
		cardDiv.append(distance);
		
		var cost = document.createElement("p");
		cost.innerHTML = "Cost: " + terrainTypes.getModifiedEnergy(game.player().currentSpace().terrainType, this.energy) + " energy";
		if (invalidReason == invalidCardReasons.ENERGY)
		{
			cost.setAttribute('class', 'invalidCardAttribute');
		}
		cardDiv.append(cost);
		
		var special = document.createElement("p");
		special.innerHTML = "Special: " + card.specialText;
		if (invalidReason == invalidCardReasons.SPECIAL)
		{
			special.setAttribute('class', 'invalidCardAttribute');
		}
		cardDiv.append(special);
		
		if (raceCanvasManager.selectedCard === card)
		{
			cardDiv.classList.add('selectedCard');
		}
		
		return cardDiv;
		
		//$('#cardsDiv').append(cardDiv);
		//return "hello";
	};
}

function runCard() { 
	
	var distance = 7 + Math.floor(Math.random()*3); //7 - 9
	var cost = 9 + Math.floor(Math.random()*3); //9 - 11
	
	return new card("Run", distance, cost,"None",
		genericGetInvalidReasonMethod, genericUseMethod, true, false);
}

function surgeCard() { return new card(
	"Surge", 14, 25, "None",
	genericGetInvalidReasonMethod, genericUseMethod, true, false); }

function fatigueCard() { return new card(
	"Fatigue", 6, 0, "Always in your starting hand. Never discarded after use.",
	genericGetInvalidReasonMethod, genericUseMethod, false, true); }

function recoverCard() { return new card(
	"Recover", 6, 5, "Gain 10 energy",
	genericGetInvalidReasonMethod, useRecoverMethod, true, false); }

function kickCard() { return new card(
	"Kick", 16, 15, "Uses all of your remaining energy",
	genericGetInvalidReasonMethod, useKickMethod, true, false); }

function coastCard() { return new card(
	"Coast", 7, 5, "Cannot be used while running alone.",
	coastGetInvalidReasonMethod, genericUseMethod, true, false); }

function reelInCard() { return new card(
	"Reel In", 10, 10, "Can only be used if the next runner ahead is less than 300 meters away.",
	reelInGetInvalidReasonMethod, genericUseMethod, true, false); }
