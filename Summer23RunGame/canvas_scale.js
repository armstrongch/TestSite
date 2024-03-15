//mostly stolen from here: https://codepen.io/chengarda/pen/wRxoyB
var canvasScaleManager = 
{
	cameraOffset: { x: 0, y: 0 },
	cameraZoom: 1,
	
	MAX_ZOOM: 2,
	MIN_ZOOM: 0.5,
	SCROLL_SENSITIVITY: -0.0005,
	
	dragStart: {},

	setup: function()
	{
		raceCanvasManager.raceCanvas.addEventListener('mousedown', canvasScaleManager.onPointerDown);
		raceCanvasManager.raceCanvas.addEventListener('touchstart', (e) => canvasScaleManager.handleTouch(e, canvasScaleManager.onPointerDown));
		raceCanvasManager.raceCanvas.addEventListener('mouseup', canvasScaleManager.onPointerUp);
		raceCanvasManager.raceCanvas.addEventListener('touchend',  (e) => canvasScaleManager.handleTouch(e, canvasScaleManager.onPointerUp));
		raceCanvasManager.raceCanvas.addEventListener('mousemove', canvasScaleManager.onPointerMove);
		raceCanvasManager.raceCanvas.addEventListener('touchmove', (e) => canvasScaleManager.handleTouch(e, onPointerMove));
		raceCanvasManager.raceCanvas.addEventListener('wheel', (e) => canvasScaleManager.adjustZoom(e.deltaY*canvasScaleManager.SCROLL_SENSITIVITY));
	},
	
	onPointerDown: function(e)
	{
		canvasScaleManager.isDragging = true;
		var loc = canvasScaleManager.getEventLocation(e);
		canvasScaleManager.dragStart.x = loc.x / canvasScaleManager.cameraZoom - canvasScaleManager.cameraOffset.x;
		canvasScaleManager.dragStart.y = loc.y / canvasScaleManager.cameraZoom - canvasScaleManager.cameraOffset.y;
		
		raceCanvasManager.handleClick();
	},
	
	onPointerUp: function(e)
	{
		canvasScaleManager.isDragging = false;
		canvasScaleManager.initialPinchDistance = null;
		canvasScaleManager.lastZoom = canvasScaleManager.cameraZoom;
		raceCanvasManager.draw();
	},
	
	handleTouch: function(e, singleTouchHandler)
	{
		if ( e.touches.length == 1 )
		{
			singleTouchHandler(e);
		}
		else if (e.type == "touchmove" && e.touches.length == 2)
		{
			canvasScaleManager.isDragging = false;
			canvasScaleManager.handlePinch(e);
		}
	},
	
	adjustZoom: function(zoomAmount, zoomFactor)
	{
		if (!canvasScaleManager.isDragging)
		{
			if (zoomAmount)
			{
				canvasScaleManager.cameraZoom += zoomAmount;
			}
			else if (zoomFactor)
			{
				canvasScaleManager.cameraZoom = zoomFactor*canvasScaleManager.lastZoom;
			}
			
			canvasScaleManager.cameraZoom = Math.min( canvasScaleManager.cameraZoom, canvasScaleManager.MAX_ZOOM );
			canvasScaleManager.cameraZoom = Math.max( canvasScaleManager.cameraZoom, canvasScaleManager.MIN_ZOOM );
			
			raceCanvasManager.draw();
		}
	},
	
	onPointerMove: function(e)
	{
		var eventLocation = canvasScaleManager.getEventLocation(e);
		var zoom = canvasScaleManager.cameraZoom;
		var offset = canvasScaleManager.cameraOffset;
		
		if (canvasScaleManager.isDragging)
		{
			offset.x = eventLocation.x/zoom - canvasScaleManager.dragStart.x;
			offset.y = eventLocation.y/zoom - canvasScaleManager.dragStart.y;
			raceCanvasManager.draw();
		}
		else
		{
			var rawX = eventLocation.x;
			var rawY = eventLocation.y;
			
			var canvasOffsetX = raceCanvasManager.raceCanvas.offsetLeft;
			var canvasOffsetY = raceCanvasManager.raceCanvas.offsetTop;
			
			var offsetX = canvasScaleManager.cameraOffset.x;
			var offsetY = canvasScaleManager.cameraOffset.y;
			var zoom = canvasScaleManager.cameraZoom;
			var halfWidth = raceCanvasManager.raceCanvas.width/2;
			var halfHeight = raceCanvasManager.raceCanvas.height/2;
			
			rawX -= canvasOffsetX;
			rawY -= canvasOffsetY;
			
			var x = rawX - halfWidth;
			x = x / zoom;
			x = x - offsetX + halfWidth;

			var y = rawY - halfHeight;
			y = y / zoom;
			y = y - offsetY + halfHeight;
			
			raceCanvasManager.handleMouseOver(x, y);
		}
	},
	
	handlePinch: function(e)
	{
		e.preventDefault()
		
		let touch1 = { x: e.touches[0].clientX, y: e.touches[0].clientY }
		let touch2 = { x: e.touches[1].clientX, y: e.touches[1].clientY }
		
		// This is distance squared, but no need for an expensive sqrt as it's only used in ratio
		let currentDistance = (touch1.x - touch2.x)**2 + (touch1.y - touch2.y)**2
		
		if (canvasScaleManager.initialPinchDistance == null)
		{
			canvasScaleManager.initialPinchDistance = currentDistance
		}
		else
		{
			canvasScaleManager.adjustZoom( null, currentDistance/canvasScaleManager.initialPinchDistance )
		}
	},
	
	getEventLocation: function(e)
	{
		if (e.touches && e.touches.length == 1)
		{
			return { x:e.touches[0].clientX, y: e.touches[0].clientY }
		}
		else if (e.clientX && e.clientY)
		{
			return { x: e.clientX, y: e.clientY }        
		}
	}
};