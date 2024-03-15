var terrainTypes =
{
	TRAIL: "TRAIL",
	GRASS: "GRASS",
	SAND: "SAND",
	getColor: function(type)
	{
		switch(type)
		{
			case this.GRASS: return '#6A994E';
			case this.TRAIL: return '#BC4749';
			case this.SAND: return '#F2E8CF'; 
		}
	},
	
	getRandom: function()
	{
		var randInt = Math.floor(Math.random() * 3);
		switch(randInt)
		{
			case 0: return this.GRASS;
			case 1: return this.TRAIL;
			case 2: return this.SAND;
		}
	},
	
	getEffectText: function(type)
	{
		switch(type)
		{
			case this.GRASS: return "+2 energy for non-fatigue cards";
			case this.TRAIL: return "Smooth and Fast.";
			case this.SAND: return "-100 meters distance for non-fatigue cards";
		}
	},
	
	getModifiedEnergy: function(type, energy)
	{
		switch(type)
		{
			case this.GRASS: return energy + 2;
			default: return energy;
		}
	},
	
	getModifiedDistance: function(card, type)
	{
		switch(type)
		{
			case this.SAND:
				var sampleFatigueCard = new fatigueCard();
				if (card.name == sampleFatigueCard.name)
				{
					return card.distance;
				}
				else
				{
					return card.distance - 1;
				}
				default:
					return card.distance;
		}
	}
};

function space(width, terrainType)
{
	this.width = width;
	this.terrainType = terrainType;
	this.canvasPosition = { x: null, y: null, width: null, height: null };
	this.runnerNames = [];

	this.draw = function(x, y, width, height)
	{
		this.canvasPosition.x = x;
		this.canvasPosition.y = y;
		this.canvasPosition.width = width;
		this.canvasPosition.height = height;
		
		var ctx = raceCanvasManager.ctx;
		
		ctx.fillStyle = terrainTypes.getColor(this.terrainType);
		ctx.fillRect(x, y, width, height);
		ctx.beginPath();
		
		ctx.strokeStyle = "black";
		ctx.moveTo(x, y);
		ctx.lineTo(x, y+height);
		ctx.stroke();
		
		if (this === raceCanvasManager.selectedToolTipSpace)
		{
			var sdw = raceCanvasManager.squareDrawWidth;
			for (var i = y - sdw; i < y + height; i += sdw/4)
			{
				var lineStartX = x;
				var lineStartY = i;
				
				var lineEndX = x + sdw;
				var lineEndY = i + sdw;
				
				if (lineStartY < y)
				{
					var dif = y - lineStartY;
					lineStartX += dif;
					lineStartY += dif;
				}
				
				if (lineEndY > y + height)
				{
					var dif = lineEndY - y - height;
					lineEndX -= dif;
					lineEndY -= dif;
				}
				
				ctx.moveTo(lineStartX, lineStartY);
				ctx.lineTo(lineEndX, lineEndY);
			}
			ctx.stroke();
		}

	},
	
	this.getToolTipHtml = function()
	{
		var toolTipHtmlList = [];
		
		toolTipHtmlList.push("<p>Terrain: " + this.terrainType + ": " + terrainTypes.getEffectText(this.terrainType) + "</p>");
		
		if (this.runnerNames.length > 0)
		{			
			toolTipHtmlList.push("<table>");
			
			var runners = [];
			
			this.runnerNames.forEach(function(n) {
				runners.push(game.runners.filter(r => r.name == n)[0]);
			});
			
			utility.sortRunnerListByTeamName(runners);
			
			runners.forEach(function(r) {
				toolTipHtmlList.push(r.getQuickRaceInfoTR());
			});
			
			toolTipHtmlList.push("</table>");
		}
		
		var toolTipHtml = toolTipHtmlList.join(" ");
		
		return toolTipHtml;
	}
}

function course(startWidth)
{
	this.spaces = [];
	for (var i = startWidth; i >= 3; i -= 1)
	{
		for (var j = 0; j < 3; j += 1)
		{
			this.spaces.push(new space(i, terrainTypes.GRASS));
		}
	}
	var segmentDistance = 2;
	var segmentType = terrainTypes.GRASS;
	var segmentWidth = 3;
	
	while (this.spaces.length < 100)
	{
		this.spaces.push(new space(segmentWidth, segmentType));
		segmentDistance -= 1;
		if (segmentDistance <= 0)
		{
			segmentDistance = 8 + Math.floor(Math.random()*5);
			segmentWidth = 1 + Math.floor(Math.random()*3);
			segmentType = terrainTypes.getRandom();
		}
	}
}
