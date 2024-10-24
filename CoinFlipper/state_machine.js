var state_machine = {
	change_state: function(state)
	{
		$("div[class='stateDiv']").css('display', 'none');
		$(`#${state}_state_div`).css('display', 'inline-block');
	}
};