function race(hostTeamName, teamNames, individualRunnerNames)
{
	this.hostTeamName = hostTeamName;
	this.runnerNames = [];
	
	for (var i = 0; i < game.runners.length; i += 1)
	{
		var testRunner = game.runners[i];
		if (teamNames.includes(testRunner.teamName) || individualRunnerNames.includes(testRunner.name))
		{
			if (!this.runnerNames.includes(testRunner.name))
			{
				testRunner.setupForRace();
				this.runnerNames.push(testRunner.name);
			}
		}
	}
	
	this.course = function()
	{
		return game.teams.filter(t => t.name == this.hostTeamName)[0].homeCourse;
	}
	
	this.runners = function()
	{
		return game.runners.filter(r => this.runnerNames.includes(r.name));
	}
	
	this.show = function()
	{
		game_state_manager.change_state(game_states.RACE);
	}
	
	this.complete = false;
	
	this.processTurn = function()
	{
		var raceRunners = this.runners();
		for (var i = 0; i < raceRunners.length; i += 1)
		{
			if (raceRunners[i].moveDistance == 0)
			{
				var cpuRunner = raceRunners[i];
				var cpuRunnerCard = cpuRunner.pickCard(this.runners());
				cpuRunnerCard.use(cpuRunner);
			}
		}
		
		var raceRunnerList = this.runners();
		utility.sortRunnerListByMoveDistanceDescending(raceRunnerList);
		
		while (raceRunnerList.filter(r => r.moveDistance > 0).length > 0)
		{
			var testRunner = raceRunnerList.filter(r => r.moveDistance > 0)[0];
			var targetPosition = testRunner.position + testRunner.moveDistance;
			
			var runnersAtTargetPosition = raceRunnerList.filter(r => r.moveDistance == 0 && r.position == targetPosition).length;
			var spaceWidth = this.course().spaces[targetPosition].width;
			if (runnersAtTargetPosition + 1 <= spaceWidth*game.constants.runnersPerSquare)
			{
				testRunner.position = targetPosition;
				testRunner.moveDistance = 0;
			}
			else
			{
				throw new Error("Too many runners on space behavior not implemented!");
			}
		}
		
		raceCanvasManager.selectedToolTipSpace = null;
		raceCanvasManager.draw();
	}
}