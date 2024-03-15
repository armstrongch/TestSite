var raceCanvasManager = 
{
	squareDrawWidth: 60,
	
	dimensions: {
		maxWidth: window.innerWidth * 0.6,
		maxHeight: window.innerHeight * 0.5,
	},
	
	raceCanvas: $("#raceCanvas")[0],
	ctx: this.raceCanvas.getContext("2d"),
	
	mouse: { x: null, y: null },
	
	selectedToolTipSpace: null,
	
	selectedCard: null,
	
	draw: function()
	{
		this.scaleCanvas();
		
		this.drawMapSquares();
		
		if (this.selectedCard != null)
		{
			this.drawMoveArrow();
		}
		
		this.drawToolTip();
		
		this.drawCards();
	},
	
	drawMoveArrow: function()
	{
		var playerPosition = game.player().canvasPosition;
		
		var startX = playerPosition.x + playerPosition.rad;
		var startY = playerPosition.y + playerPosition.rad;
		
		var playerSpaceIndex = game.player().position;
		var playerSpaceTargetIndex = playerSpaceIndex + terrainTypes.getModifiedDistance(this.selectedCard, game.player().currentSpace().terrainType);
		
		var targetSpace = game.currentRace().course().spaces[playerSpaceTargetIndex];
		
		var endX = targetSpace.canvasPosition.x + targetSpace.canvasPosition.width/2;
		var endY = targetSpace.canvasPosition.y + targetSpace.canvasPosition.height/2;
		
		var endToStartDirRad = utility.point_direction_rad(endX, endY, startX, startY);
		
		this.ctx.strokeStyle = "white";
		this.ctx.lineWidth = this.squareDrawWidth/6;
		
		this.ctx.beginPath();
		this.ctx.moveTo(startX, startY);
		
		var lineEndX = endX + Math.cos(endToStartDirRad)*this.squareDrawWidth/2;
		var lineEndY = endY - Math.sin(endToStartDirRad)*this.squareDrawWidth/2;
		
		this.ctx.lineTo(lineEndX, lineEndY);
		this.ctx.stroke();
		
		
		
		var finLength = this.squareDrawWidth;
		var finDir1 = endToStartDirRad + Math.PI/8;
		var finDir2 = endToStartDirRad - Math.PI/8;
		
		var finX1 = endX + Math.cos(finDir1)*finLength;
		var finY1 = endY - Math.sin(finDir1)*finLength;
		
		var finX2 = endX + Math.cos(finDir2)*finLength;
		var finY2 = endY - Math.sin(finDir2)*finLength;
		
		this.ctx.fillStyle = "white";
		this.ctx.beginPath();
		this.ctx.moveTo(endX, endY);
		this.ctx.lineTo(finX1, finY1);
		this.ctx.lineTo(finX2, finY2);
		this.ctx.closePath();
		this.ctx.fill();
	},
	
	drawCards: function()
	{
		$('#cardsDiv').html("");
		
		var playerCards = game.player().hand;
		
		for (var i = 0; i < playerCards.length; i += 1)
		{
			$('#cardsDiv').append(playerCards[i].getHTMLtoDraw());
			
			
			//var card = playerCards[i];
			//var invalidReason = card.invalidReason(player, race.runners());
			
			//this.drawCardDiv(card, invalidReason);
		}
	},
	
	handleClick: function()
	{
		this.selectedToolTipSpace = this.getToolTipSpace();
	},
	
	getToolTipSpace: function()
	{
		var courseSpaces = game.currentRace().course().spaces;
		for (var i = 0; i < courseSpaces.length; i += 1)
		{
			var space = courseSpaces[i];
			if (
				this.mouse.x >= space.canvasPosition.x &&
				this.mouse.y >= space.canvasPosition.y &&
				this.mouse.x < space.canvasPosition.x + space.canvasPosition.width &&
				this.mouse.y < space.canvasPosition.y + space.canvasPosition.height)
			{
				return space;
			}
		}
		return this.selectedToolTipSpace;
	},
	
	drawToolTip: function()
	{
		$('#toolTipDiv').html('');
		var space = this.selectedToolTipSpace;
		if (space != null)
		{
			$('#toolTipDiv').html(space.getToolTipHtml());
		}
	},
	
	drawMapSquares: function()
	{
		var course = game.currentRace().course();
		var yStart = 0;
		
		this.lastSpaceInLine = { y: null, height: null };
		
		for (var i = 0; i < 4; i += 1)
		{
			yStart = this.drawLineOfSpaces(i*25, yStart);
		}
	},
	
	drawLineOfSpaces: function(startIndex, yStart)
	{
		var course = game.currentRace().course();
		var runners = game.currentRace().runners();
		var lineNum = startIndex/25;
		var endIndex = Math.min(100 - startIndex, 25);
		
		var lineHeight = 0;
		for (var i = 0; i < endIndex; i += 1)
		{
			lineHeight = Math.max(lineHeight, course.spaces[startIndex+i].width * this.squareDrawWidth);
		}
		
		var yEnd = yStart + lineHeight;
		
		//For even-numbered lines, xstart = 0, xIncrement = squareDrawWidth
		//For odd-numbered lines, xstart = squareDrawWidth*25, xIncrement = -1*squareDrawWidth
		var xStart = 0;
		var xIncrement = this.squareDrawWidth;
		if (lineNum%2 == 1)
		{
			xStart += this.squareDrawWidth * 24;
			xIncrement = xIncrement * -1;
		}
		
		for (var i = 0; i < endIndex; i += 1)
		{
			var space = course.spaces[i + startIndex];
			var spaceHeight = space.width*this.squareDrawWidth;
			
			if (i == endIndex - 1)
			{
				this.lastSpaceInLine.y = yEnd - spaceHeight;
				this.lastSpaceInLine.height = spaceHeight;
			}
			else if (i == 0 && this.lastSpaceInLine.y != null)
			{
				this.drawLineConnector(
					this.lastSpaceInLine.y, //y1
					this.lastSpaceInLine.height, //h1
					yEnd - spaceHeight, //y2
					spaceHeight, //h2
					xStart + (lineNum%2 ? this.squareDrawWidth : 0), //x
					lineNum%2, //isClockwise
					space.terrainType); //terrainType
			}
			
			space.draw(
				xStart + i*xIncrement,
				yEnd - spaceHeight,
				this.squareDrawWidth,
				spaceHeight);
			space.runnerNames = [];
			var runnersOnSpace = runners.filter(r => r.position == i + startIndex);
			runnersOnSpace.forEach(function(r) { space.runnerNames.push(r.name); } );
			
			this.drawRunnersOnSpace(
				xStart + i*xIncrement,
				yEnd,
				runnersOnSpace
			);
		}
		
		return yEnd + this.squareDrawWidth;
	},
	
	drawLineConnector: function(y1, h1, y2, h2, x, isClockwise, terrainType)
	{
		this.ctx.beginPath();
		this.ctx.arc(
			x,
			y1 + (y2 + h2 - y1)/2,
			Math.abs(y2 + h2 - y1)/2,
			0.5*Math.PI,
			1.5*Math.PI,
			isClockwise);
		this.ctx.fillStyle = terrainTypes.getColor(terrainType);
		this.ctx.fill();
	},
	
	drawRunnersOnSpace: function(x, y2, runners)
	{
		var runnerIndex = 0;
		var yDrawPos = y2 - this.squareDrawWidth;
		//utility.sortRunnerListByPropertyValue(runners, "teamName");
		utility.sortRunnerListByTeamName(runners);
		
		while(runnerIndex < runners.length)
		{
			var maxIndex = Math.min(runnerIndex + 7, runners.length);
			var runnersToDraw = runners.slice(runnerIndex, maxIndex);
			this.drawRunnersOnSquare(x, yDrawPos, runnersToDraw);
			runnerIndex += 7;
			yDrawPos -= this.squareDrawWidth;
		}
	},
	
	drawRunnersOnSquare: function(x, y, runners)
	{
		if (runners.length > 7)
		{
			throw new Error("Too many runners on space!");
		}
		else
		{
			var centerX = x + this.squareDrawWidth/2;
			var centerY = y + this.squareDrawWidth/2;
			var runnerIndex = 0;
			
			for (var i = 2; i >= 0; i -= 1)
			{
				var xPos = x + i*this.squareDrawWidth/3;
				
				var yPos = i == 1 ? y : y + this.squareDrawWidth/6;
				var yCount = i == 1 ? 3 : 2;
				
				for (var j = 0; j < yCount; j += 1)
				{
					if (runners.length > runnerIndex)
					{
						runners[runnerIndex].draw(xPos, yPos, this.squareDrawWidth/6);
						runnerIndex += 1;
						yPos += this.squareDrawWidth/3;
					}
				}
			}
		}
	},
	
	scaleCanvas: function()
	{
		var dim = this.dimensions;
		
		this.raceCanvas.width = dim.maxWidth;
		this.raceCanvas.height = dim.maxHeight;
		
		this.ctx.translate(this.raceCanvas.width/2, this.raceCanvas.height/2);
		this.ctx.scale(canvasScaleManager.cameraZoom, canvasScaleManager.cameraZoom);
		this.ctx.translate(canvasScaleManager.cameraOffset.x - this.raceCanvas.width/2, canvasScaleManager.cameraOffset.y - this.raceCanvas.height/2);
		
		$('#toolTipDiv').css("max-height", this.raceCanvas.height);
	},
	
	handleMouseOver: function(x, y)
	{
		var redraw = (this.mouse.x != null && (this.mouse.x != x || this.mouse.y != y));
		
		this.mouse.x = x;
		this.mouse.y = y;
		
		if (redraw) { this.draw(); }
	},
};