var game =
{
	teams: [
		new team("AMHERST", teamColors[0]),
		new team("BENTON", teamColors[1]),
		new team("NEWBURY", teamColors[2]),
		new team("SUGAR HILL", teamColors[3]),
		new team("WHITEFIELD", teamColors[4]),
		new team("FRANCONIA", teamColors[5]),
		new team("DOVER", teamColors[6]),
	],
	runners: [],
	races: [],
	
	playerName: null,
	
	player: function()
	{
		return this.runners.filter(r => r.name == this.playerName)[0];
	},
	
	currentRace: function()
	{
		return this.races.filter(r => r.runnerNames.includes(this.playerName))[0];
	},
	
	showRace: function()
	{
		game_state_manager.change_state(game_states.RACE);
	},
	
	constants: {
		runnersPerSquare: 7
	}
}

//shuffle list of teams
game.teams.sort(() => Math.random() - 0.5);

//add 7 runners per team
for (var i = 0; i < game.teams.length*7; i += 1)
{
	var newRunner = new runner();
	newRunner.teamName = game.teams[i%7].name;
}

game.playerName = game.runners[0].name;