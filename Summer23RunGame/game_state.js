var game_states = {
	TITLE: "TITLE",
	TEST: "TEST",
	RACE: "RACE",
};

var game_state_manager = {
	
	current_state: game_states.TEST,
	
	setup: function()
	{
		canvasScaleManager.setup();
		this.change_state(game_states.TEST);
	},
	
	change_state: function(new_state)
	{
		$('.stateDiv').css('display', 'none');
		$('#' + new_state + "_DIV").css('display', 'block');
		this.current_state = new_state;
		switch(new_state)
		{
			case game_states.TEST:
				setup_test();
				break;
			case game_states.RACE:
				raceCanvasManager.draw();
				break;
			default:
				break;
		}
	},
};

