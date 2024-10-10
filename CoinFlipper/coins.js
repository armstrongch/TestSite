var coins = 
{	
	url_counter: 0,
	
	flip: function()
	{
		var src = "HeadsCoin.gif";
		if (Math.random() <= 0.5)
		{
			src = "TailsCoin.gif";
		}
		
		//Each gif needs a unique url so the animations play independently
		src += `?count=${this.url_counter}`
		$('#coinP').append(`<img src="${src}"/>`);
		this.url_counter += 1;
	},
	
	clear: function()
	{
		$('#coinP').empty();
	},
};