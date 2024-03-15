function setup_test()
{
	var testRace = new race(
		game.teams[0].name,
		[
			game.teams[0].name,
			game.teams[1].name,
			game.teams[2].name,
			game.teams[3].name,
			game.teams[4].name,
			game.teams[5].name,
			game.teams[6].name],
		[game.runners[0].name, game.runners[1].name, game.runners[2].name, game.playerName]);
	
	
	
	game.races.push(testRace);
	game.showRace();
}