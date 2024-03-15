var utility =
{
	point_direction: function(x1, y1, x2, y2)
	{
		return this.point_direction_rad(x1, y1, x2, y2) * 180 / Math.PI;
	},
	
	point_direction_rad: function(x1, y1, x2, y2)
	{
		return Math.atan2(y1 - y2, x2 - x1);
	},
	
	sortRunnerListByPropertyValue: function(runnerList, propertyNameAsString)
	{
		runnerList.sort((a,b) => (a[propertyNameAsString] > b[propertyNameAsString]) ? 1 : ((b[propertyNameAsString] > a[propertyNameAsString]) ? -1 : 0));
	},
	
	sortRunnerListByTeamName: function(runnerList)
	{
		var countPerTeam = [];
		var maxCount = 1;
		for (var i = 0; i < runnerList.length; i += 1)
		{
			var runner = runnerList[i];
			var teamName = runner.teamName;
			if (countPerTeam.filter(c => c.teamName == teamName).length > 0)
			{
				var cpt = countPerTeam.filter(c => c.teamName == teamName)[0];
				cpt.count += 1;
				if (cpt.count > maxCount) { maxCount = cpt.count; }
			}
			else
			{
				countPerTeam.push({ teamName: teamName, count: 1 });
			}
		}
		
		var nextSortOrder = 0;
		while(maxCount > 0)
		{
			for (var i = 0; i < countPerTeam.length; i += 1)
			{
				var cpt = countPerTeam[i];
				if (cpt.count == maxCount)
				{
					cpt.sortOrder = nextSortOrder;
					nextSortOrder += 1;
				}
			}
			maxCount -= 1;
		}
		
		runnerList.sort((a,b) => 
			(
				countPerTeam.filter(c => c.teamName == a.teamName)[0].sortOrder <
				countPerTeam.filter(c => c.teamName == b.teamName)[0].sortOrder
			) ? -1 : (
				(
					countPerTeam.filter(c => c.teamName == a.teamName)[0].sortOrder >
					countPerTeam.filter(c => c.teamName == b.teamName)[0].sortOrder
				) ? 1 : 0
			));
	},	
	
	sortRunnerListByMoveDistanceDescending: function(runnerList)
	{
		runnerList.sort((a,b) => (a.moveDistance > b.moveDistance) ? -1 : ((b.moveDistance > a.moveDistance) ? 1 : 0));
	},
	
	//From: https://stackoverflow.com/questions/13627308/add-st-nd-rd-and-th-ordinal-suffix-to-a-number
	ordinal_suffix_of: function(i) 
	{
		var j = i % 10,
			k = i % 100;
		if (j == 1 && k != 11) {
			return i + "st";
		}
		if (j == 2 && k != 12) {
			return i + "nd";
		}
		if (j == 3 && k != 13) {
			return i + "rd";
		}
		return i + "th";
	}
};