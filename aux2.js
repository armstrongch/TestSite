var aux = {
	showMainDiv: function()
	{
		$('#auxDiv').css('display', 'none');
		$('#mainDiv').css('display', 'block');
	},
	
	gameSetup: function()
	{
		$('#auxDiv').html(
			'<p>How many players? <input type="number" min="2" max="6" id="selectPlayerCount"></p>' +
			'<p>How many human players? <input type="number" min="2" max="6" id="selectHumanCount"></p>' +
			'<button id="startGameButton" onclick="aux.startGameButtonClick()">Start Game</button>'
		);
		
		$('#selectPlayerCount')[0].value = 3;
		$('#selectHumanCount')[0].value = 3;
		
		$('#auxDiv').css('display', 'block');
		$('#mainDiv').css('display', 'none');

	},
	
	passTurn: function(playerIndex)
	{
		var player = game.players[playerIndex];
		
		var html = "<div>" + player.getHTML(game, playerIndex, true) + "</div><div>" +
			"<p>Player " + (playerIndex+1).toString() + ": What will you keep for the next round?</p>" +
			"<p><input type='radio' id='ingredients' name='keep' checked='true'/>All Ingredients</p>";
			
		for (var i = 0; i < player.elves.length; i += 1)
		{
			html += "<p><input type='radio' id='elfIndex" + i.toString() + "' name='keep'/>" + player.elves[i].getHTML().replace("<p>", "") + "</p>";
		}
		
		html += "<p><button onclick='aux.submitPassTurn()>Submit</button></p></div>";
		$('#auxDiv').html(html);
		$('#auxDiv').css('display', 'block');
		$('#mainDiv').css('display', 'none');
	},
	
	submitPassTurn: function()
	{
		alert("Test");
	}
	
	startGameButtonClick: function()
	{
		var playerCount = Math.floor(Number($('#selectPlayerCount')[0].value));
		var humanCount = Math.floor(Number($('#selectHumanCount')[0].value));
		
		if (playerCount > 0 && humanCount > 0 && humanCount <= playerCount)
		{
			game = new gameConst(playerCount, playerCount);
			draw.gameState(game, false);
			aux.showMainDiv();
		}
	}
};