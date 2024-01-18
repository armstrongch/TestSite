function get_child_animal(in_parent_one, in_parent_two)
{
	var stat_values = [];

	//all_stats is a list of distinct stats possessed by one or both parents
	var all_stats_one = in_parent_one.stat_values.map((sv) => sv.stat);
	var all_stats_two = in_parent_two.stat_values.map((sv) => sv.stat);
	var all_stats = all_stats_one.concat(all_stats_two).filter((value, index, self) => self.indexOf(value) === index);

	for (var i = 0; i < all_stats.length; i += 1)
	{
		var stat = all_stats[i];
		var value_one = animal_stat_value(in_parent_one.stat_values, stat);
		var value_two = animal_stat_value(in_parent_two.stat_values, stat);
		
		if (value_one + value_two > -2)
		{
			if (value_one == -1) { value_one = value_two; }
			if (value_two == -1) { value_two = value_one; }
			
			// if only one parent has a particular stat, child has that stat value
			// if both parents have a stat, child has the average
			var average_value = Math.floor((value_one + value_two) / 2);
			
			//values have a random swing, up to 5 points in either direction
			var new_value = average_value - 5 + Math.floor(Math.random() * 11);
			
			stat_values.push(new stat_value(stat, new_value));
		}
	}
	
	var animal_type = get_child_type(in_parent_one.animal_type, in_parent_two.animal_type, stat_values);
	
	return new animal(animal_type, stat_values);
}

//returns -1 if animal does not have stat
function animal_stat_value(in_stat_values, in_stat)
{
	var has_stat = in_stat_values.filter(x => x.stat == in_stat).length > 0;
	if (has_stat)
	{
		return in_stat_values.filter(x => x.stat == in_stat)[0].value;
	}
	else
	{
		return -1;
	}
}

function get_child_type(in_parent_one_type, in_parent_two_type, in_stat_values)
{
		//If either parent is a dog or a hellhound
		if (
			in_parent_one_type == animal_types.DOG ||
			in_parent_two_type == animal_types.DOG ||
			in_parent_one_type == animal_types.HELL_HOUND ||
			in_parent_two_type == animal_types.HELL_HOUND
		)
		{
			var fire_aspect_stat = animal_stat_value(in_stat_values, animal_stats.FIRE_ASPECT);
			if (fire_aspect_stat >= 80)
			{
				return animal_types.HELL_HOUND;
			}
			else
			{
				return animal_types.DOG;
			}
		}
		else
		{
			return animal_types.SALAMANDER;
		}
}