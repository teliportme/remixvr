var PROMPTER = function (options) {
	//declare our variables.
	var options, keys, frameRate, script, orientation, width, height, text, caret, paused, overlayStale, scriptStale,
	scrollPosY, scrollSpeed, containerElement, scriptCanvas, scriptContext, overlayCanvas, overlayContext, draw, scriptify;
	
	//if no options, great we'll do it all by ourself.
	options = options || {};
	
	keys = options.keys || {
		//setup the default keys.
		// x = 88, y = 89, 32 = space, 38 = up, u = 85, i = 73
		88: "flipHorizontal", // x
		89: "flipVertical", // y
		32: "stopStart", // space bar
		39: "getScript", // right arrow
		85: "decreaseFontSize", // u
		73: "increaseFontSize", // i
		187: 'increaseSpeed',
		189: 'decreaseSpeed',
		27: 'resetScript',
		//development
		83: 'scriptify',
		77: 'maximize' //make the prompter full window.
	};
	
	//how often do we redraw: (in milliseconds)
	frameRate = 40;
		
	//first, what text are we showing the user?
	script = scriptify("no script loaded.");
	
	//orietation is for tablet devices.
	orientation = options.orientation || 90;
	
	//default width & height, get monkeyed with when orientation changes.
	width = options.width || 900;
	height = options.height || 650;
	
	//initial text settings, can be changed anytime. classes are base, information, notice, important
	text = {
			base: {},
			information: {},
			notice: {},
			important: {}
		};
		
		text.base.x = 5;
		text.base.height = 64;
		text.base.font = "bold "+ text.base.height +"px sans-serif";
		text.base.baseline =  "top";
		text.base.style = "#fff";
		text.base.background = "#000";
		
		text.information.x = 5;
		text.information.height = 64;
		text.information.font = "bold "+ text.information.height +"px sans-serif";
		text.information.baseline = "top";
		text.information.style = "yellow";
		text.information.background = "#000";
		
		text.notice.x = 5;
		text.notice.height = 64;
		text.notice.font = "bold "+ text.notice.height +"px sans-serif";
		text.notice.baseline = "top";
		text.notice.style = "pink";
		text.notice.background = "#000";
		
		text.important.x = 5;
		text.important.height = 64;
		text.important.font = "bold "+ text.important.height +"px sans-serif";
		text.important.baseline = "top";
		text.important.style = "#000";
		text.important.background = "#fff";
		

	//caret/guidline setup.
	caret = {};
		caret.color = "yellow";
		caret.x = 10;
		caret.y = 200;
		caret.height = 40;
		caret.width = 40;
		caret.visible = true;

	//if there was a container element specified, use it, otherwise make our own
	containerElement = options.container || function(){
		var c = document.createElement('div');
		c.setAttribute('id', 'prompterContainer');
		document.body.appendChild(c);
		return c;
	}();
	
	//we're going to use two canvases, one for the script text, and one for the overlay.		
			
	// script canvas element stuff.
	scriptCanvas = options.scriptCanvas || function(){
		var c = document.createElement('canvas');
		c.setAttribute('id', 'scriptCanvas');
		c.setAttribute('class', 'scriptCan');
		c.setAttribute('height', height);
		c.setAttribute('width', width);
		containerElement.appendChild(c);
		return c;
	}();
				
	scriptContext = scriptCanvas.getContext('2d');
	
	// overlay canvas element stuff.
	overlayCanvas = options.overlayCanvas || function(){
		var c = document.createElement('canvas');
		c.setAttribute('id', 'overlayCanvas');
		c.setAttribute('class', 'overlayCan');
		c.setAttribute('height', height);
		c.setAttribute('width', width);
		containerElement.appendChild(c);
		return c;
	}();
				
	overlayContext = overlayCanvas.getContext('2d');
	
	//drawing/refreshing stuff here
	//we start out paused.
	paused = true;
	
	//we need to know if our overlay or script setup has changed and needs a redraw (ie, its stale)
	overlayStale = true;
	scriptStale = true;
	
	//position of top of text while scrolling
	scrollPosY = 0;
	scrollSpeed = -1;
	
	//draw is where the magic happens.
	draw = function(){
		
		if(overlayStale == true){
			//clean the slate if something has changed.
			overlayContext.clearRect(0,0,width, height);
			
			//if we're using a caret, draw it.
			if(caret.visible == true) {
				drawCaret();
			}
			
			//we've redrawn/refigured the overlay, so its no longer stale
			overlayStale = false;
		}
		
		if(scriptStale === true){
			scriptText = getLines(width - caret.width - 10, script);
			scriptStale = false;
		}
		
		//clear the canvas
		scriptContext.clearRect(0,0,width, height);

		var lineOffsetY = 0;

		for(var line in scriptText){
			var scrollY =  scrollPosY + lineOffsetY;
			var currentX = text.base.x + caret.width;
			
			//only show lines that are on the screen
			if(scrollY > 0 - (text.base.height * 1.25) && scrollY < height + text.base.height){
				
				for(var word in scriptText[line]){					
					//if the text has a background, draw it:
					scriptContext.fillStyle = text[scriptText[line][word].class].background;
					scriptContext.fillRect(currentX, scrollY + (text[scriptText[line][word].class].height*0.1), scriptText[line][word].width,(text[scriptText[line][word].class].height*1.1));
					
					//setup text: 
					scriptContext.font = text[scriptText[line][word].class].font;
					scriptContext.fillStyle = text[scriptText[line][word].class].style;
					scriptContext.textBaseline = text[scriptText[line][word].class].baseline;
					
					//draw the text			
					scriptContext.fillText(scriptText[line][word].word, currentX, scrollY);
					currentX+=scriptText[line][word].width;
				}
				//scriptContext.fillText(scriptText[line], text.x + caret.width, scrollY);
				
			}
			if(scrollY > height){
				continue;
			}
			lineOffsetY += (text.base.height*1.1);	
			
		}
		
		//set the starting position for the next frame
		if(!paused){
			scrollPosY += scrollSpeed;
		}
		
	};
	
	//a function to set the canvas size, at anytime
	var setCanvasSize = function(newWidth, newHeight){
		
		overlayCanvas.setAttribute('height',newHeight);
		overlayCanvas.setAttribute('width',newWidth);
		
		scriptCanvas.setAttribute('height',newHeight);
		scriptCanvas.setAttribute('width',newWidth);
		
		height = newHeight;
		width = newWidth;
	}
	
	//all of our bindable control functions:
	var controls = {
		flipHorizontal: function(){
			overlayContext.scale(-1,1);
			overlayContext.translate(-overlayCanvas.width,0);
			overlayStale = true;
			
			scriptContext.scale(-1,1);
			scriptContext.translate(-scriptCanvas.width,0);
		},
		flipVertical: function(){
			overlayContext.scale(1,-1);
			overlayContext.translate(0,-overlayCanvas.height);
			overlayStale = true;
			
			scriptContext.scale(1,-1);
		   	scriptContext.translate(0,-scriptCanvas.height);

		},
		stopStart: function(){
			paused = !paused;
		},
		getScript: function(){
			script = scriptify(getRemoteScript(options.script.url, true));
		},
		increaseSpeed: function(){
			scrollSpeed -= 1;
		},
		decreaseSpeed: function(){
			scrollSpeed += 1;
		},
		resetScript: function(){
			scrollPosY = 0;
			paused = true;
			scrollSpeed = -1;
		},
		maximize: function(){
			setCanvasSize(document.body.clientWidth,document.body.clientHeight);
			overlayStale = true;
			scriptStale = true;
			console.log(height);
		},
		increaseFontSize: function(){
			text.base.height += 2;
			text.notice.height += 2;
			text.information.height += 2;
			text.important.height += 2;

			text.base.font = "bold "+ text.base.height +"px sans-serif";
			text.information.font = "bold "+ text.information.height +"px sans-serif";
			text.notice.font = "bold "+ text.notice.height +"px sans-serif";
			text.important.font = "bold "+ text.important.height +"px sans-serif";

			//we changed something, so need to remeasure, redraw
			scriptStale = true;
		},
		decreaseFontSize: function(){
			text.base.height -= 2;
			text.notice.height -= 2;
			text.information.height -= 2;
			text.important.height -= 2;
			text.base.font = "bold "+ text.base.height +"px sans-serif";
			text.information.font = "bold "+ text.information.height +"px sans-serif";
			text.notice.font = "bold "+ text.notice.height +"px sans-serif";
			text.important.font = "bold "+ text.important.height +"px sans-serif";
			
			//we changed something, so need to remeasure, redraw
			scriptStale = true;
		}

	}

	//utility stuff here
	var getXMLHttp = function() {
	  var xmlHttp;
	
	  try {
	    //good browsers
	    xmlHttp = new XMLHttpRequest();
	  }
	  catch(e){
	    //e'rthing else
	    try {
	      xmlHttp = new ActiveXObject("Msxml2.XMLHTTP");
	    }
	    catch(e){
	      try{
	        xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
	      }
	      catch(e){
	        alert("Your browser does not support AJAX!");
	        return false;
	      }
	    }
	  }
	  return xmlHttp;
	}
	
	drawCaret = function(){
		//draw a caret
		overlayContext.fillStyle = caret.color;
		overlayContext.beginPath();
		overlayContext.moveTo(caret.x, caret.y - (caret.height/2));
		overlayContext.lineTo(caret.x + caret.width, caret.y);
		overlayContext.lineTo(caret.x, caret.y + (caret.height/2));
		overlayContext.fill();
	}
	
	getLines = function(width, script){
		//seperate obj to keep track of lines.
		var lines = {};
		
		//seomthing to keep track of line width
		var lineWidth = 0;
		
		//counters
		var i = 0;
		var lastClass = "base";
		
		for(word in script){
			//we need a way to start a new line
			var carriageReturn = function(){
				i++;
				lineWidth = 0;
			}
			
			//what kind of text are we working with here?
			var wordClass = script[word].class;
			
			//if the class changes to from important to something else or vice versa, newline
			if(lastClass != "important" && wordClass === 'important'){
				carriageReturn();
			}
			if(lastClass === "important" && wordClass != "important"){
				carriageReturn();
			}
			
			
			lines[i] = lines[i] || {};
			lines[i][word] = script[word];
			
			//we've got to measeure the text with the appropriate font.
			scriptContext.font = text[wordClass].font || text.base.font;
			scriptContext.fillStyle = text[wordClass].style;
			scriptContext.textBaseline = text[wordClass].baseline;
			
			//measure and store width
			lines[i][word].width = scriptContext.measureText(script[word].word).width
			lineWidth+= lines[i][word].width;
			
			//if we are close to the edge, newline.
			if(lineWidth >= width - (0.25*width)){
				carriageReturn();
			}
			
			lastClass = wordClass;
		}
		console.log(lines);
		return lines;
	}
	
	/*
	 * convert the script string to an object that we can more easily process into a preetty script.
	 */
	function scriptify(scriptString){
		
		scriptString = scriptString || "canvas prompter ... http://www.github.com/jakecarpenter";
		
		var script = {};
		
		//split the string on spaces
		var tempArray = scriptString.split(/( |<<|>>|\[|\]|\{|\})/im);
		
		//set the default world class.
		var wordClass = "base";
		
		for(var i = 0 ; i < tempArray.length; i++){
			/*determine the script class
			* << starts INFO >>: Yellow Text
			* 
			* {is NOTICE} : Invert, no Line break
			* 
			* [IMPORTANT] : Implies Invert & Line Break
			* 
			*/

			//check for an open << tag
			if(tempArray[i].search(/<{2}/im) >= 0){
 				wordClass = "information";
			}
			
			//check for an open { tag
			if(tempArray[i].search(/\{/img) >= 0){
 				wordClass = "notice";
			}
			
			//check for an open [ tag
			if(tempArray[i].search(/\[/img) >= 0){
 				wordClass = "important";
			}
			
			//add the class and word to the line
			if(tempArray[i] != ""){
				script[i] = {
					'word': "" + tempArray[i],
					'class': wordClass,
				}			
			}
			
			//if we recieve an end tag, go back to base class  
			if(tempArray[i].search(/\}|>>|\]/) >= 0){
 				wordClass = "base";
			}	

			
		}
		
		//return the processed object
		return script;
	}
	
	function setFontSize(size){
		text.height = size || text.height;
		text.font = "bold "+ text.height +"px sans-serif";
	}
	
	//remote text fetching, set use to true or set with setText
	function getRemoteScript(url, use){
		var xmlHttp = getXMLHttp();
		
		xmlHttp.onreadystatechange = function(){
		  if(xmlHttp.readyState == 4) {
		    if(use === true){
		    	script = scriptify(xmlHttp.responseText);
		    	//since we are getting a new script, we need to tell the render the old one is stale.
				scriptStale = true;
		    }
		    else{
   			    return xmlHttp.responseText;
		    }
		  }
		}
		
		xmlHttp.open("GET", url, true); 
		xmlHttp.send(null);	
		
		
	} 

	//view stuff here
	
	//key event stuff here
	//the commands we'll use. none by default.

	var handleKeyPress = function(e){
		e = e || window.event;
		key = e.keyCode;
		if(typeof controls[keys[key]] === 'function'){
			controls[keys[key]]();
		}
		//for dev purposes, tell us the keycodes.
		console.log(e.keyCode);
	};
	
	//initialization code.
	var init = function(){
		document.onkeydown = handleKeyPress;

		var animate = function(){
			requestAnimationFrame(draw);
			window.setTimeout(animate, frameRate);			
		}();
	};
	
	init();
	return this;
}
