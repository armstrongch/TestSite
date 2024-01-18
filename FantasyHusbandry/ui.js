var ui = {
	show_parent_stat_values: function(in_parent_num, in_select_element)
	{
		var animal_type = parseInt(in_select_element.value);
		var sample_animal = get_sample_animal(animal_type);
		var stat_values_html = draw.animal_stat_values(sample_animal.stat_values);
		var elementId = in_parent_num == 1 ? "parentOneStatValuesP" : "parentTwoStatValuesP";
		$('#'+elementId).html(stat_values_html);
		
		if ($('#parentOneSelectTypeP')[0].children[0].value > -1 && $('#parentTwoSelectTypeP')[0].children[0].value > -1)
		{
			$('#generateChildButton')[0].disabled = false;
		}
	},
	
	show_child_animal: function()
	{
		var parent_animal_one = ui.get_parent_animal(1);
		var parent_animal_type = ui.get_parent_animal(2);
		var child_animal = get_child_animal(parent_animal_one, parent_animal_type);
		var child_html = draw.animal(child_animal);
		$('#childDiv').html(child_html);
	},
	
	get_parent_animal: function(in_parent_num)
	{
		var type_element_id = in_parent_num == 1 ? "parentOneSelectTypeP" : "parentTwoSelectTypeP";
		
		var animal_type = parseInt($('#' + type_element_id)[0].children[0].value);
		
		var stats_element_id = in_parent_num == 1 ? "parentOneStatValuesP" : "parentTwoStatValuesP";
		
		var animal_stat_values = [];
		
		var stat_child_elements = $('#' + stats_element_id)[0].children;
		for (var i = 0; i < stat_child_elements.length; i += 1)
		{
			var stat_name = stat_child_elements[i].children[0].name;
			var stat = animal_stats[stat_name];
			
			var value = parseInt(stat_child_elements[i].children[0].value);
			animal_stat_values.push(new stat_value(stat, value));
		}
		
		return new animal(animal_type, animal_stat_values);
	},
	
	test: function() { alert("test"); },
};