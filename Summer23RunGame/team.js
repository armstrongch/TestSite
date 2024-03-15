var teams = [];

function team(teamName, teamColor)
{
	this.name = teamName;
	this.homeCourse = new course(7);
	this.color = teamColor;
}

var teamColors = [
	'#FFB300',
	'#143D8D',
	'#E87722',
	'#CC0000',
	'#602D89',
	'#D4BF91',
	'#00694E'
];