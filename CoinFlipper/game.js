var game =
{
	kids_card_image_sources: [],
	
	canvas: document.getElementById("kidsAndEncountersCanvas"),
	
	doodles: [],
	
	doodle_size: 24,
	
	doodle_index_at_position: function(x, y)
	{
		for (var i = 0; i < this.doodles.length; i += 1)
		{
			var test_doodle = this.doodles[i];
			if ( Math.abs(x-test_doodle.x) <= this.doodle_size/2 && Math.abs(y-test_doodle.y) <= this.doodle_size/2 )
			{
				return i;
			}
		}
		return -1;
	},
	
	add_new_doodle: function(type, x, y)
	{
		this.doodles.push(
			{ type: type, x: x, y: y }	
		);
	},
	
	draw: function()
	{	
		var ctx = this.canvas.getContext("2d");
		ctx.imageSmoothingEnabled = false;
		
		this.resize_canvas_to_css_size();
		
		ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		
		var d = this.doodle_size;
		
		for (var i = 0; i < this.doodles.length; i += 1)
		{
			var doodle = this.doodles[i];
			ctx.drawImage(this.doodle_images[doodle.type], doodle.x-d/2, doodle.y-d/2, d, d);
		}
	},
	
	doodle_images: {
		x: new Image(),
		one: new Image(),
		two: new Image(),
		three: new Image(),
		check: new Image()
	},
	
	init_images: function()
	{
		this.doodle_images.x.src = "Sprites/X_outline.png";
		this.doodle_images.one.src = "Sprites/1_outline.png";
		this.doodle_images.two.src = "Sprites/2_outline.png";
		this.doodle_images.three.src = "Sprites/3_outline.png";
		this.doodle_images.check.src = "Sprites/Check_outline.png";
	},
	
	resize_canvas_to_css_size: function()
	{
		var canvas_width_css_string = $('#kidsAndEncountersCanvas').css('width');
		var canvas_height_css_string = $('#kidsAndEncountersCanvas').css('height');
		
		var canvas_width = canvas_width_css_string.substring(0, canvas_width_css_string.length-2);
		var canvas_height = canvas_height_css_string.substring(0, canvas_height_css_string.length-2);
		
		this.canvas.width = canvas_width;
		this.canvas.height = canvas_height;
	},
	
	load: function()
	{
		document.body.addEventListener('click', this.click_canvas);
		
		for (var i = 0; i < this.kids_card_image_sources.length; i += 1)
		{	
			$('#kidsAndEncountersDiv').append(				
				`<div class ='kidCardContainerTD encounterKidCardDiv'>
					<img src='${this.kids_card_image_sources[i]}' class='kidCardImg'>
				</div>`
			);
		}
		
		this.draw();
	},
	
	click_canvas: function(event)
	{
		var mouse_x = event.clientX;
		var mouse_y = event.clientY;
		game.resize_canvas_to_css_size();
		if (mouse_y <= game.canvas.height*0.35)
		{
			var existing_doodle_index = game.doodle_index_at_position(mouse_x, mouse_y);
			if (existing_doodle_index == -1)
			{
				game.add_new_doodle("x", mouse_x, mouse_y);
			}
			else
			{
				var doodle = game.doodles[existing_doodle_index];
				switch(doodle.type)
				{
					case "x": doodle.type = "one"; break;
					case "one": doodle.type = "two"; break;
					case "two": doodle.type = "three"; break;
					case "three": doodle.type = "check"; break;
					case "check":
						game.doodles.splice(existing_doodle_index, 1);
						break;
				}
			}
		}
		game.draw();
	},
}

var coins = 
{	
	url_counter: 0,
	
	flip: function()
	{
		var src = 'HeadsCoin.gif';
		if (Math.random() <= 0.5)
		{
			src = 'TailsCoin.gif';
		}
		
		//Each gif needs a unique url so the animations play independently
		src += `?count=${this.url_counter}`
		$('#coinP').append(`<img src='${src}' style="margin: 3px;"/>`);
		this.url_counter += 1;
	},
	
	clear: function()
	{
		$('#coinP').empty();
	},
};