var raceCanvasManagerOld =
{
	squareDrawWidth: 60,
	selectedCard: null,
	drawCourseSpacesStartIndex: 0,
	
	draw: function()
	{
		this.drawCanvas();
		this.drawCards();
		this.drawRaceInfo();
	},
	
	drawRaceInfo: function()
	{
		var player = game.player();
		var race = game.currentRace();
		
		var energyText = "Energy: " + player.energy;
		
		var position = race.runners().filter(r => r.position > player.position).length + 1;
		var xthPlace = utility.ordinal_suffix_of(position) + " place";
		
		var positionText = "Position: ";
		var tied = race.runners().filter(r => r.position == player.position).length > 1;
		if (tied)
		{
			positionText += "Tied for " + xthPlace;
		}
		else
		{
			positionText += xthPlace;
		}
		positionText += " of " + race.runners().length + " total runners";
		
		utility.sortRunnerListByPropertyValue(race.runners(), "position");
		var leader = race.runners()[race.runners().length-1];
		var distanceBehind = leader.position - player.position;
		var metersBehind = distanceBehind*100;
		
		var leaderText = metersBehind.toString() + " meters behind 1st place."
		
		positionText += ", " + leaderText;
		
		var distanceInMeters = (100 - player.position)*100;
		var distanceText = "Distance Remaining: " + distanceInMeters.toString() + " meters";
		
		var passCost = player.passEnergyCost;
		var passInput = "<input type='checkbox' id='playerPassInput' name='playerPassInput'";
		if (player.pass) { passInput += " checked='true'"; }
		passInput += " >";
		
		var trafficJamText = "Spend " + player.passEnergyCost.toString() + " extra energy to move past slow runners blocking your path?" + passInput;
		
		var infoText =
			energyText + "<br/>" +
			distanceText + "<br/>" +
			positionText + "<br/>" +
			trafficJamText;
		
		$('#raceInfo').html(infoText);
	},
	
	drawCanvas: function()
	{
		var raceCanvas = $("#raceCanvas")[0];
		var ctx = raceCanvas.getContext("2d");
		var race = game.currentRace();
		
		this.scaleCanvas(raceCanvas, window.innerWidth * 0.8, window.innerHeight * 0.5, 16/9);
		
		ctx.fillStyle = "#386641";
		ctx.fillRect(0, 0, raceCanvas.width, raceCanvas.height);
		
		this.drawSquaresGrid(ctx, race);
		
		if (this.selectedCard != null)
		{
			this.drawMoveArrow(raceCanvas, ctx, this.selectedCard.distance);
		}
	},
	
	drawCards: function()
	{
		var race = game.currentRace();
		
		$('#cardsDiv').html("");
		
		var player = game.player();
		var playerCards = player.hand;
		
		for (var i = 0; i < playerCards.length; i += 1)
		{
			var card = playerCards[i];
			var invalidReason = card.invalidReason(player, race.runners());
			
			this.drawCardDiv(card, invalidReason);
		}
	},
	
	drawMoveArrow: function(canvas, ctx, distance)
	{
		ctx.strokeStyle = "white";
		ctx.lineWidth = this.squareDrawWidth/6;
		
		var playerOffset = game.player().position - this.drawCourseSpacesStartIndex;
		
		var startX = this.squareDrawWidth*(playerOffset + 0.5);
		var startY = canvas.height/2;
		var endX = startX + distance*this.squareDrawWidth;
		
		ctx.beginPath();
		ctx.moveTo(startX, startY);
		ctx.lineTo(endX - ctx.lineWidth, startY);
		ctx.stroke();
		
		var finLength = this.squareDrawWidth/3;
		ctx.fillStyle = "white";
		ctx.beginPath();
		ctx.moveTo(endX, startY);
		ctx.lineTo(endX - finLength, startY - finLength);
		ctx.lineTo(endX - finLength, startY + finLength);
		ctx.closePath();
		ctx.fill();
	},
	
	drawCardDiv: function(card, invalidReason)
	{
		var cardDiv = document.createElement("div");
		
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
		distance.innerHTML = "Distance: " + card.distance*100 + " meters";
		cardDiv.append(distance);
		
		var cost = document.createElement("p");
		cost.innerHTML = "Cost: " + card.energy + " energy";
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
		
		if (this.selectedCard === card)
		{
			cardDiv.classList.add('selectedCard');
		}
		
		$('#cardsDiv').append(cardDiv);
	},
	
	scaleCanvas: function(canvas, maxWidth, maxHeight, idealWidthToHeightRatio)
	{
		var canvasHeight = maxHeight;
		var canvasWidth = canvasHeight * idealWidthToHeightRatio;
		
		if (canvasWidth > maxWidth)
		{
			canvasWidth = maxWidth;
			canvasHeight = canvasWidth / idealWidthToHeightRatio;
		}
		
		canvas.width = canvasWidth;
		canvas.height = canvasHeight;
	},
	
	zoom: function(spaceWidthModifier)
	{
		this.squareDrawWidth += spaceWidthModifier;
		this.squareDrawWidth = Math.min(Math.max(this.squareDrawWidth, 10), 200);
		
		this.draw();
	},
	
	drawSquaresGrid: function(ctx, race)
	{
		var courseSpaceIndex = this.drawCourseSpacesStartIndex;//game.player().position;
		
		for (var i = 0; i < raceCanvas.width; i += this.squareDrawWidth)
		{
			if (courseSpaceIndex < race.course().spaces.length)
			{
				var space = race.course().spaces[courseSpaceIndex];
				var spaceWidth = space.width;
				var terrainType = space.terrainType;
				
				var runnerSquareMapping = this.getRunnerSquareMapping(spaceWidth, race.runners().filter(r => r.position == courseSpaceIndex));
				
				var yStart = raceCanvas.height/2 - spaceWidth/2*this.squareDrawWidth;
				
				for (var j = 0; j < spaceWidth; j += 1)
				{
					var spaceX = i;
					var spaceY = yStart + j*this.squareDrawWidth;
					this.drawSpace(ctx, spaceX, spaceY, terrainType);
					this.drawRunnersOnSpace(ctx, runnerSquareMapping[j], spaceX, spaceY);
				}
				
				courseSpaceIndex += 1;
			}
		}
	},
	
	drawSpace: function(ctx, x, y, terrainType)
	{
		switch(terrainType)
		{
			case terrainTypes.GRASS: ctx.fillStyle = '#6A994E'; break;
			case terrainTypes.TRAIL: ctx.fillStyle = '#BC4749'; break;
			case terrainTypes.SAND: ctx.fillStyle = '#F2E8CF'; break;
		}
		ctx.fillRect(x, y, this.squareDrawWidth, this.squareDrawWidth);
		ctx.lineWidth = 1;
		ctx.strokeStyle = "black";
		ctx.beginPath();
		ctx.rect(x, y, this.squareDrawWidth, this.squareDrawWidth);
		ctx.stroke();
	},
	
	drawRunner: function(ctx, runner, x, y)
	{
		var rad = this.squareDrawWidth/6;
		
		ctx.fillStyle = runner.team().color;
		ctx.beginPath();
		ctx.arc(x + rad, y + rad, rad*4/5, 0, 2*Math.PI);
		ctx.fill();
		
		ctx.strokeStyle = "black";
		ctx.beginPath();
		ctx.arc(x + rad, y + rad, rad*4/5, 0, 2*Math.PI);
		ctx.stroke();
	},
	
	drawRunnersOnSpace: function(ctx, runners, spaceX, spaceY)
	{
		var centerX = spaceX + this.squareDrawWidth/2;
		var centerY = spaceY + this.squareDrawWidth/2;
		var runnerIndex = 0;
		
		for (var i = 2; i >= 0; i -= 1)
		{
			var xPos = spaceX + i*this.squareDrawWidth/3;
			
			var yPos = i == 1 ? spaceY : spaceY + this.squareDrawWidth/6;
			var yCount = i == 1 ? 3 : 2;
			
			for (var j = 0; j < yCount; j += 1)
			{
				if (runners.length > runnerIndex)
				{
					this.drawRunner(ctx, runners[runnerIndex], xPos, yPos);
					runnerIndex += 1;
					yPos += this.squareDrawWidth/3;
				}
			}
		}
	},
	
	getRunnerSquareMapping: function(width, spaceRunners)
	{
		var runnersPerSquare = game.constants.runnersPerSquare;
		var occupiedSquares = Math.ceil(spaceRunners.length/runnersPerSquare);
		var squares = [];
		for (var i = 0; i < Math.floor( (width - occupiedSquares) / 2); i += 1)
		{
			squares.push([]);
		}
		
		currentSquare = [];
		//utility.sortRunnerListByPropertyValue(spaceRunners, "teamName");
		utility.sortRunnerListByTeamName(spaceRunners);
		for (var i = 0; i < spaceRunners.length; i += 1)
		{
			currentSquare.push(spaceRunners[i]);
			if ((currentSquare.length == 7) || (i == spaceRunners.length - 1 && currentSquare.length > 0))
			{
				squares.push(currentSquare.slice());
				currentSquare = [];
			}
		}
		
		while (squares.length < width)
		{
			squares.push([]);
		}
		
		return squares;
	},
	
	handleKeyPress: function(event)
	{
		switch(event.code)
		{
			case "ArrowRight":
				this.panCanvasView(1);
				break;
			case "ArrowLeft":
				this.panCanvasView(-1)
				break;
			default:
		}
	},
	
	panCanvasView: function(squareIncrement)
	{
		this.drawCourseSpacesStartIndex += squareIncrement;
		if (this.drawCourseSpacesStartIndex < 0) { this.drawCourseSpacesStartIndex = 0; }
		this.draw();
	}
};