animal_types = {
	DOG: 0,
	HELL_HOUND: 1,
	SALAMANDER: 2
}

animal_stats = {
	OBEDIENCE: 0,
	HOSTILITY: 1,
	FERTILITY: 2,
	FIRE_ASPECT: 3
}

function stat_value(in_stat, in_value)
{
	this.stat = in_stat;
	this.value = in_value;
}

function get_stat_values(in_array)
{
	var stat_values = [];
	for (var i = 0; i < in_array.length; i += 2)
	{
		stat_values.push(new stat_value(in_array[i], in_array[i+1]));
	}
	return stat_values;
}

function animal(in_type, in_stat_values)
{
	this.animal_type = in_type;
	this.stat_values = in_stat_values;
}

function get_sample_animal(in_type)
{
	var stat_values = [];
	switch(in_type)
	{
		case animal_types.DOG:
			stat_values = get_stat_values([
				animal_stats.OBEDIENCE, 	55,
				animal_stats.HOSTILITY, 	25,
				animal_stats.FERTILITY, 	30,
				animal_stats.FIRE_ASPECT, 	0,
			]);
			break;
		case animal_types.HELL_HOUND:
			stat_values = get_stat_values([
				animal_stats.OBEDIENCE, 	30,
				animal_stats.HOSTILITY, 	60,
				animal_stats.FERTILITY, 	45,
				animal_stats.FIRE_ASPECT, 	85,
			]);
			break;
		case animal_types.SALAMANDER:
			stat_values = get_stat_values([
				animal_stats.OBEDIENCE, 	0,
				animal_stats.HOSTILITY, 	0,
				animal_stats.FERTILITY, 	60,
				animal_stats.FIRE_ASPECT, 	95,
			]);
			break;
	}
	return new animal(in_type, stat_values);
}