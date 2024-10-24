var kids = {
	load: function()
	{
		for (var i = 0; i < 6; i += 1)
		{
			var html = 
				`<td class='kidCardContainerTD hoverCard' onclick='kids.clickCardContainerTD(this.id)' id='kidCardContainerTD${i}'>
					<img src='Kids/TestlyCard.png' class='kidCardImg'>
					<input type='checkbox' class='kidCardCheckboxInput invisible'>
				</td>`;
			var rowIndex = 1 + Math.floor(i/3);
			$(`#kidsTR${rowIndex}`).append(html);
		}
	},
	
	finalize: function()
	{
		var selected_kids_card_image_sources = $('.kidCardCheckboxInput').filter(
				function() { return $(this).prop('checked'); }
			).parents().children('img');
		for (var i = 0; i < selected_kids_card_image_sources.length; i += 1)
		{
			var src = selected_kids_card_image_sources[i].src;
			game.kids_card_image_sources.push(src);
		}
		
		game.load();
		
		state_machine.change_state('play_game');
		//$('#kid_select_state_div').html('');
	},
	
	clickCardContainerTD: function(id)
	{
		var checkbox = $(`#${id}`).children('input').first();
		var checked = checkbox.prop('checked');
		var selected_kids_count = $('.kidCardCheckboxInput').filter(
			function() { return $(this).prop('checked'); }
		).length;
		
		if (!checked && selected_kids_count >= 3)
		{
			return;
		}
		
		checkbox.prop('checked', !checked);
		checked = !checked;
		selected_kids_count = $('.kidCardCheckboxInput').filter(
			function() { return $(this).prop('checked'); }
		).length;
		
		$('#finalizeKidsButton').prop('disabled', selected_kids_count != 3);
		
		//Deselect Kid
		if (!checked)
		{
			checkbox.addClass('invisible');
			if (selected_kids_count < 3)
			{
				$('.noHoverCard').addClass('hoverCard').removeClass('noHoverCard');
			}
		}
		else
		{
			//Select kid
			checkbox.removeClass('invisible');
			if (selected_kids_count == 3)
			{
				$('.kidCardContainerTD').filter(
					function() {
						return $(this).children('input').first().prop('checked') == false;
					}
				).addClass('noHoverCard').removeClass('hoverCard');
			}
		}
		
	}
};