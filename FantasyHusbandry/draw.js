var draw = {
	animal_type_select: function(in_parent_num)
	{
		var animal_type_select_html = `<select onchange='ui.show_parent_stat_values(${in_parent_num.toString()}, this)'>`;
		animal_type_select_html += `<option value="-1" disabled="true" selected="true">SELECT AN ANIMAL</option>`;
		for (var i = 0; i < Object.keys(animal_types).length; i += 1)
		{
			animal_type_select_html += `<option value="${i.toString()}">${Object.keys(animal_types)[i].replace("_", " ")}</option>`;
		}
		animal_type_select_html += "</select>";
		return animal_type_select_html;
	},
	
	animal: function(in_animal)
	{
		var name = Object.keys(animal_types)[in_animal.animal_type];
		var stat_values_html = draw.animal_stat_values(in_animal.stat_values);
		return `<div><p>${name}</p>${stat_values_html}</div>`;
	},
	
	animal_stat_values: function(in_stat_values)
	{
		var stat_values_html = "";
		for (var i = 0; i < in_stat_values.length; i += 1)
		{
			stat_values_html += draw.animal_stat_value(in_stat_values[i]);
		}
		return stat_values_html;
	},
	
	animal_stat_value: function(in_stat_value)
	{
		var stat = Object.keys(animal_stats)[in_stat_value.stat];
		var value = in_stat_value.value.toString();
		return `<p>${stat} <input name="${stat}" type="number" value="${value}"></p>`;
	}
}
