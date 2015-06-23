var colorV2U = "#606060";
var colorU2I = "#000000";
var colorV2I = "#787878";
var colorValid = "#A0A0A0";
var lineColor= "#A0A0A0";
var bgColor = "#FFFFFF";
var colorVroutes = "#A0A0A0";
var colorVroutesLine = "#000000";
var colorNVroutes = "#000000";//"A0A0A0";
var colorNVroutesLine = "#FFFFFF";


function P(x, y){
	this.x = x;
	this.y = y;
}

function Triangle(top, left, right){
	this.top = top;
	this.left = left;
	this.right = right;

	// Right slope
	this.right_m = function(){ 
		rise = this.right.y - this.top.y;
		run = this.right.x - this.top.x;
		return rise/run;
	};

	// Left slope
	this.left_m = function(){ 
		rise = this.left.y - this.top.y;
		run = this.left.x - this.top.x;
		return rise/run;
	};

	// Right y-intercept
	this.right_b = function(){ return this.right.y - this.right_m()*this.right.x; };

	// left y-intercept
	this.left_b = function(){ return this.left.y - this.left_m()*this.left.x; };


	this.inner = function(height){
		var bottom_x = this.left.x + Math.abs(this.left.x - this.right.x)/2;
		var bottom_y = this.right.y;

		var from_peak_y = this.top.y + height;

		var isect_left_x = (from_peak_y - this.left_b() )/this.left_m(); 
		if ( ! isFinite( this.left_m() ) ) isect_left_x = this.top.x;


		var isect_right_x =(from_peak_y - this.right_b() )/this.right_m(); 
		if ( ! isFinite( this.right_m() ) ) isect_right_x = this.top.x;


		var left = new P(isect_left_x, from_peak_y);
		var right = new P(isect_right_x, from_peak_y);
		var bottom = new P(bottom_x, bottom_y);

		return new Triangle(bottom, left, right);
	}

	this.split = function(height){
		var inner = this.inner(height);

		var left_t = new Triangle(inner.left, this.left, inner.top);
		var right_t = new Triangle(inner.right, inner.top, this.right);

		return [left_t, right_t]
	}
}


function Render(){
	this.ctx = document.getElementById('canvas').getContext('2d');

	var xWidth = 1400;
	//var xWidth = 2000;

	var yHeight = 700;
	//var yHeight = 400;

	this.ctx.fillStyle   = bgColor; // set canvas background color
	this.ctx.fillRect(0,   0, xWidth, yHeight);  // now fill the canvas


	this.drawLegend = function(){
		var legendSize = 20;
		var legendYMargin = 20;
		var legendXOffset = xWidth/2 - 500;
		var textYMargin= 35;
		var fontsize = 18;



		this.ctx.fillStyle=colorU2I;
		this.ctx.fillRect(50,30,legendSize,legendSize);


		this.ctx.fillStyle="000000";
		this.ctx.font=fontsize.toString()+"px Arial";
		this.ctx.fillText(" - Unknown to Invalid", 70, 45);

		this.ctx.fillStyle=colorV2I;
		this.ctx.strokeRect(50,60,legendSize,legendSize);


		this.ctx.fillStyle="000000";


		this.ctx.font=fontsize.toString()+"px Arial";
		this.ctx.fillText(" - Unknown", 70, 75);
		this.ctx.strokeStyle = "A0A0A0";

		this.ctx.fillStyle=colorVroutes;
		this.drawCircleFill(new P(60, 100), colorVroutes, colorVroutesLine );

		this.ctx.fillStyle="000000";
		this.ctx.font=fontsize.toString()+"px Arial";
		this.ctx.fillText(" - Valid Route", 70, 105);

		this.drawCircleFill(new P(60, 128), colorNVroutes, "#000000" );

		this.ctx.fillStyle="000000";
		this.ctx.font=fontsize.toString()+"px Arial";
		this.ctx.fillText(" - Invalid Route", 70, 135);


	}


	this.drawTriangleOutline = function(t){
		var ctx = this.ctx;

		ctx.lineWidth = 1;
		ctx.strokeStyle = lineColor;//"red";
		ctx.beginPath();
		ctx.moveTo(t.top.x, t.top.y);
		ctx.lineTo(t.left.x, t.left.y);
		ctx.lineTo(t.right.x, t.right.y);

		ctx.lineTo(t.top.x, t.top.y);
		ctx.stroke();
	};

	this.drawTriangleFill = function(t, color){
		var ctx = this.ctx;

		ctx.lineWidth = 1;
		ctx.strokeStyle = color;//"red";
		ctx.beginPath();
		ctx.moveTo(t.top.x, t.top.y);
		ctx.lineTo(t.left.x, t.left.y);
		ctx.lineTo(t.right.x, t.right.y);

		ctx.lineTo(t.top.x, t.top.y);
		ctx.stroke();


		ctx.fillStyle = color;//"red";
		ctx.beginPath();
		ctx.moveTo(t.top.x, t.top.y);
		ctx.lineTo(t.left.x, t.left.y);
		ctx.lineTo(t.right.x, t.right.y);

		ctx.lineTo(t.top.x, t.top.y);
		ctx.fill();
	};

	this.drawCircleFill = function(point, color, linecolor){
		var ctx = this.ctx;
		var radius = 8;

		ctx.beginPath();
		ctx.arc(point.x, point.y, radius, 0, 2 * Math.PI, false);
		ctx.fillStyle = color;
		ctx.fill();
		ctx.lineWidth = 2;
		ctx.strokeStyle = linecolor;
		ctx.stroke();
	};



	this.drawCircleOutline =  function(point, color){
		var ctx = this.ctx;

		var radius = 2;

		ctx.beginPath();
		ctx.arc(point.x, point.y, radius, 0, 2 * Math.PI, false);

		ctx.lineWidth = 1;
		ctx.strokeStyle = color;
		ctx.stroke();
	};
}


function buildTriangles(){
	var y_step = 25;
	//var max_depth = 8;
	var max_depth = 17-8;
	var t_height = y_step*max_depth;
	var width = 20;
	var t_side_len = Math.sqrt( width*3/4*Math.pow(t_height,2) );
	var x_trans = 50;
	var y_trans = 50;

	var t = new Triangle( new P(t_side_len/2 +x_trans, y_trans), new P(0+x_trans,t_height+y_trans), new P(t_side_len+x_trans, t_height+y_trans) );


	var stack = []
	stack.push(t);

	var triangles = [];

	for(var level = 0; level < max_depth; level+=1){

		var new_stack = [];
		while(stack.length > 0){
			var t = stack.shift();

			var scaling_factor = 1;
			//var scaling_factor = (level+1)/2.5; //can not be zero
			
			var inner = t.inner(y_step/(scaling_factor));
			var drawable_triangle =  new Triangle(t.top ,inner.left, inner.right);

			triangles.push(drawable_triangle); //save for later

			var new_tris = t.split( y_step/(scaling_factor) );

			for (i in new_tris){ new_stack.push(new_tris[i]); }
		}
		stack = new_stack;

	}

	return triangles;
}

function Interval(startAddr, stopAddr, slash, type){
	this.a = startAddr;
	this.z = stopAddr;
	this.slash = slash;
	this.type = type;

	console.assert( type == "V2U" || type == "U2I" || type == "V2I");

	this.toString = function(){
		return this.a.toString()+"-"+this.z.toString()+"\\"+this.slash;
	};
}

function IP(x1, x2, x3, x4){
	this.x1 = Number(x1);
	this.x2 = Number(x2);
	this.x3 = Number(x3);
	this.x4 = Number(x4);

	this.slash24Int = function(){
		return 256*this.x2+this.x3;
	};

	this.toString = function(){
		return this.x1+"."+this.x2+"."+this.x3+"."+this.x4;
	};
}


function getQueryString(){
	return location.search;
}


function computeWindow(newDowngrades, routes, ip, slash){
	var downgrades = newDowngrades

	var w = []
	var ds = [];

	depth = 17-8;//maxlen-slash;

	for (var level = 0; level < depth; level++){
		var mask = (0xFFFF ^ (0xFFFF >> level));

		var node = ip.slash24Int() & mask;

		var inc = 0x10000 >> level;

		for (var i = 0; i < Math.pow(2, level); i++){
			var color = null;
			var circle = null;

			for (var r in routes){
				var route = routes[r];

				if ( route.slash == (level+slash) ){

					var octet = route.ip.slash24Int() & mask;

					//TODO: add code to edge case non-octet prefixes
					if ( octet == node ){
						circle = route.valid;
					}

				}

			}

			for(var d in downgrades){

				var downgrade = downgrades[d];

				if (! (downgrade.a.x1 <= ip.x1 && ip.x1 <= downgrade.z.x1) ) continue;

				var startOctet = downgrade.a.slash24Int() & mask;
				var endOctet = downgrade.z.slash24Int() & mask;

				if ( downgrade.slash == (level+slash) ){
					
					//edge cases where the downgrade starts outside the draw window
					if ( downgrade.a.x1 < ip.x1 && ip.x1 < downgrade.z.x1 ) color = downgrade.type;
					if ( downgrade.a.x1 < ip.x1 && node <= endOctet ) color = downgrade.type;
					else if ( ip.x1 < downgrade.z.x1 && startOctet <= node ) color = downgrade.type;

					// downgrade x1 = ip x1
				 	else if( startOctet <= node  && node <= endOctet ) color = downgrade.type;
				}
			}	
			w.push( [color,circle] );

			node = node + inc;
		}
	}

	return w;
}


function display(intervals, routes, triIP, triSlash){

	var w = computeWindow(intervals, routes, triIP, triSlash);

	this.ctx = document.getElementById('canvas').getContext('2d');

	var r = new Render();
	r.drawLegend();
	var triangles = buildTriangles();

	var triNum = 0;

	var cirlesToDraw = []; // draw circles last so they are on top

	for (var t in w){

		if (w[triNum][0] == "V2U"){
			console.assert(triangles[t]!=null);
			r.drawTriangleFill(triangles[t], colorV2U);

		} else 	if (w[triNum][0] == "U2I"){
			console.assert(triangles[t]!=null);
			r.drawTriangleFill(triangles[t], colorU2I);
		} else 	if (w[triNum][0] == "V2I"){
			console.assert(triangles[t]!=null);
			r.drawTriangleFill(triangles[t], colorV2I);

		} else {
			console.assert(triangles[t]!=null)
			r.drawTriangleOutline(triangles[t] );
		}	

		if (w[triNum][1] != null){
			if ( w[triNum][1] == "TRUE" ){
				cirlesToDraw.push( [triangles[t].top, colorVroutes, colorVroutesLine] )
			} else {
				cirlesToDraw.push( [triangles[t].top, colorNVroutes, colorNVroutesLine] )
			}
		}

		triNum++;
	} 

	for (var c in cirlesToDraw){
		var circle = cirlesToDraw[c]
		r.drawCircleFill( circle[0], circle[1], circle[2] );
	}
}

function getPrefixIntervalSet(downgrade){

	var effects = downgrade["EFFECT"];
	var type = downgrade["CHANGE"].replace("+", "").replace("-", "");
	var intervals = []

	for (i in effects){

		var effect = effects[i];
		var slash = parseInt(effect.split("/")[1])-8;
		var range = effect.split(" ")[0];

		if (range != "empty"){

			var aStr = range.split("-")[0].replace("[", "");
			var bStr = range.split("-")[1].replace("]", "");
			// var ipA = new IP(Number(aStr.split(".")[0]), Number(aStr.split(".")[1]), Number(aStr.split(".")[2]), Number(aStr.split(".")[3]));
			// var ipB = new IP(Number(bStr.split(".")[0]), Number(bStr.split(".")[1]), Number(bStr.split(".")[2]), Number(bStr.split(".")[3]));

			var ipA = new IP(Number(aStr.split(".")[1]), Number(aStr.split(".")[2]), Number(aStr.split(".")[3]), Number(0));
			var ipB = new IP(Number(bStr.split(".")[1]), Number(bStr.split(".")[2]), Number(bStr.split(".")[3]), Number(0));

			intervals.push( new Interval(ipA, ipB, slash, type) );
		}
	}
	return intervals;
}

var intervals = []; //TODO: turn this into a class variable
var triSlash = 8;

function intervalClicked( rootOctet ){
	var triIP = new IP(rootOctet,  0, 0, 0);
			
	display(intervals, triIP, triSlash);
}

function isBlank( str ){ return str.trim().length == 0; }

function displayTable( data ){
		$('#downgrades-table').dataTable( {
        "aaData": data,
        "aoColumns": [
            { "sTitle": "Downgrade Type", "sClass": "center", "sWidth":"5%" },
            { "sTitle": "Prefix",  "sWidth":"20%"},
            { "sTitle": "AS", "sClass": "center", "sWidth":"10%" },
            { "sTitle": "Path", "sWidth": "40%"},
        ],
        "bDestroy": true
    	} ); 

    	$('#downgrades-table').css('width', '100%');


}


function Route(jsonRoute){	
	this.slash = parseInt(jsonRoute['PREFIX'].split("/")[1])-8;
	var prefixStr = jsonRoute['PREFIX'].split("/")[0];


	this.ip = new IP(Number(prefixStr.split(".")[1]), Number(prefixStr.split(".")[2]), Number(prefixStr.split(".")[3]), Number(0));

	this.AS = jsonRoute['AS'];
	this.valid = jsonRoute['VALID'];
}


function processDowngrades(){

	var json = $("#json-downgrades-input").val().split("\n");

	var input = [];
	for( j in json ){		
		if( isBlank( json[j] ) ) continue;
		input.push( jQuery.parseJSON( json[j] ) );
	}


	intervals = [];
	var triIP = null;
	if ($("#octet").val() != "") triIP =  new IP(parseInt($("#octet").val()), 0, 0, 0);

	var tableOutput = [];

	for (d in input){
		var downgrade = input[d];
		var intervalSet = getPrefixIntervalSet(downgrade);

		for (i in intervalSet){
			var interval = intervalSet[i];
			var row = [downgrade["CHANGE"], interval.toString(), downgrade["ROA"]["AS"], downgrade["ROA"]["PATH"]];

			if (triIP == null) {
				triIP = new IP(interval.a.x1, 0, 0, 0);
			}

			tableOutput.push(row);
			intervals.push(interval);
		}

	}


	var json = $("#json-route-input").val().split("\n");
	var routes = []
	for( j in json ){		
		if( isBlank( json[j] ) ) continue;
		routes.push( new Route( jQuery.parseJSON( json[j] ) ) );
	}

	displayTable(tableOutput);
	display(intervals, routes, triIP, triSlash);
}