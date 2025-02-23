var book =
{
	pages: ["P1", "P2", "P3", "P4", "P5"],
	guide: ["G1", "G2"],
	
	load: function()
	{
		this.show_page(0);
		this.show_guide(0);
	},
	
	show_page: function(index)
	{
		if (index >= 0 && index < this.pages.length)
		{
			$('#pageImg').attr("src", `Pages/${ this.pages[index] }.png`);
		}
	},
	
	show_guide: function(index)
	{
		if (index >= 0 && index < this.guide.length)
		{
			$('#guideImg').attr("src", `Guide/${ this.guide[index] }.png`);
		}
	}
};