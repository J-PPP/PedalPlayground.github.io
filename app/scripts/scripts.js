$(document).ready(function(){

	// Populate Pedalboards and Pedals lists
	GetPedalData();
	GetPedalBoardData();

	// Load canvas from localStorage if it has been saved prior
	$(function() {
		if (localStorage["pedalCanvas"] != null) {
			var savedPedalCanvas = JSON.parse(localStorage["pedalCanvas"]);
			$(".canvas").html(savedPedalCanvas);
			readyCanvas();
			console.log("Canvas restored!")
		}
	});

	// Set the multiplier for converting inches to pixels
	var multiplier = "18";

	// Set grid background to one inch
	$('.canvas').css('background-size', multiplier + 'px');

	// // Make pedals draggable
	// var $draggable = $('.canvas .pedal, .canvas .pedalboard').draggabilly({
	// 	containment: '.canvas'
	// });

	// Activate canvas features


	$('body').on('click', '#clear-canvas', function(){
		$(".canvas").empty();
		savePedalCanvas();
	});

	$('body').on('click', '#add-pedal button', function(){
		var selected  	= $('#add-pedal').find(":selected");
		//var name 		= $(selected).text();
		var shortname 	= $(selected).attr("id");
		var width  	  	= $(selected).data("width") * multiplier;
		var height    	= $(selected).data("height") * multiplier;
		var image  	  	= $(selected).data("image");
		var pedal     	= '<div class="pedal '+shortname+'" style="width:'+width+'px;height:'+height+'px; background-image:url('+image+')"><a class="delete" href="#"></a><a class="rotate" href="#"></a></div>';
		$('.canvas').append(pedal);
		readyCanvas();
		return false;
	});

	$('body').on('click', '#add-pedalboard button', function(){
		var selected  = $('#add-pedalboard').find(":selected");
		var width  	  = $(selected).data("width") * multiplier;
		var height    = $(selected).data("height") * multiplier;
		var image  	  = $(selected).data("image");
		var pedal     = '<div class="pedalboard" style="width:'+width+'px;height:'+height+'px; background-image:url('+image+')"><a class="delete" href="#"></a></div>';

		$('.canvas').append(pedal);
		readyCanvas();
		return false;
	});

	// Add custom pedal
	$('body').on('click', '#add-custom-pedal .btn', function(){
		console.log("add custom pedal...");
		var width  	  = $("#add-custom-pedal .custom-width").val() * multiplier;
		var height    = $("#add-custom-pedal .custom-height").val() * multiplier;
		var image  	  = $("#add-custom-pedal .custom-color").val();
		var pedal     = '<div class="pedal pedal--custom" style="width:'+width+'px;height:'+height+'px;">\
		<a class="delete" href="#"></a>\
		<span class="pedal__box" style="background-color:'+image+';"></span>\
		<span class="pedal__jack1"></span>\
		<span class="pedal__jack2"></span>\
		<span class="pedal__knob1"></span>\
		<span class="pedal__knob2"></span>\
		<span class="pedal__led"></span>\
		<span class="pedal__switch"></span>\
		</div>';

		$('.canvas').append(pedal);
		readyCanvas();
		return false;
	});

	// Delete Pedals
	$('body').on('click', '.canvas .delete', function(){
	    $(this).parents('.pedal, .pedalboard').remove();
		readyCanvas();
	});

	// Rotate Pedals
	//$('body').on('click', '.pedal .rotate', function(){
	//	if ( $(this).hasClass("rotate-90") ) {
	//		$(this).removeClass("rotate-90");
	//		$(this).addClass("rotate-180");
	//	} else if ( $(this).hasClass("rotate-180") ) {
	//		$(this).removeClass("rotate-180");
	//		$(this).addClass("rotate-270");
	//	}  else if ( $(this).hasClass("rotate-270") ) {
	//		$(this).removeClass("rotate-270");
	//	} else {
	//		$(this).addClass("rotate-90");
	//	}
	//	return false;
	//});



}); // End Document ready

function readyCanvas(pedal) {
	var $draggable = $('.canvas .pedal, .canvas .pedalboard').draggabilly({
		containment: '.canvas'
	});

	$('.canvas .pedal, .canvas .pedalboard').draggabilly({
		containment: '.canvas'
	});

	$draggable.on( 'dragEnd', function() {
		console.log('dragEnd');
		savePedalCanvas();
	});
	$draggable.on( 'staticClick', function() {
		rotatePedal(this);
	});
	savePedalCanvas();
}

function savePedalCanvas() {
	console.log("Canvas Saved!");
	localStorage["pedalCanvas"] = JSON.stringify($(".canvas").html());
}

function rotatePedal(pedal) {
	if ( $(pedal).hasClass("rotate-90") ) {
		$(pedal).removeClass("rotate-90");
		$(pedal).addClass("rotate-180");
	} else if ( $(pedal).hasClass("rotate-180") ) {
		$(pedal).removeClass("rotate-180");
		$(pedal).addClass("rotate-270");
	}  else if ( $(pedal).hasClass("rotate-270") ) {
		$(pedal).removeClass("rotate-270");
	} else {
		$(pedal).addClass("rotate-90");
	}
	savePedalCanvas();
}

// function rotatePedal() {
// 	alert("rotate Pedal");
// 	if ( $(this).hasClass("rotate-90") ) {
// 		$(this).removeClass("rotate-90");
// 		$(this).addClass("rotate-180");
// 	} else if ( $(this).hasClass("rotate-180") ) {
// 		$(this).removeClass("rotate-180");
// 		$(this).addClass("rotate-270");
// 	}  else if ( $(this).hasClass("rotate-270") ) {
// 		$(this).removeClass("rotate-270");
// 	} else {
// 		$(this).addClass("rotate-90");
// 	}
// 	return false;
// }

window.Pedal = function( type, brand, name, width, height, image ){
	this.Type = type || "";
	this.Brand = brand || "";
	this.Name = name || "";
	this.Width = width || "";
	this.Height = height || "";
	this.Image = image || "";
}

window.GetPedalData = function(){
	console.log('GetPedalData');
	$.ajax({
		url: "public/data/pedals.json",
		dataType: 'text',
		type: "GET",
		success: function(data){
			data = $.parseJSON(data.replace(/\r\n/g, "").replace(/\t/g, ""));
			var pedals = [];
			for(var pedal in data){
				pedals.push( new Pedal(
					data[pedal].Type 	|| "",
					data[pedal].Brand 	|| "",
					data[pedal].Name 	|| "",
					data[pedal].Width 	|| "",
					data[pedal].Height 	|| "",
					data[pedal].Image 	|| ""
				));
			}
			console.log("Pedal data loaded");
			RenderPedals(pedals);
		}
	});
};

window.RenderPedals = function(pedals){
	console.log('RenderPedals');
	for(var i in pedals) {
		var $pedal = $("<option>"+ pedals[i].Brand + " " + pedals[i].Name +"</option>").attr('id', pedals[i].Name.toLowerCase().replace(/\s+/g, "-").replace(/'/g, ''));
		$pedal.data('width', pedals[i].Width);
		$pedal.data('height', pedals[i].Height);
		$pedal.data('height', pedals[i].Height);
		$pedal.data('image', pedals[i].Image);
		$pedal.appendTo('.pedal-list');
	}
}

window.PedalBoard = function( brand, name, width, height, image ){
	this.Brand = brand || "";
	this.Name = name || "";
	this.Width = width || "";
	this.Height = height || "";
	this.Image = image || "";
}

window.GetPedalBoardData = function(){
	console.log('GetPedalBoardData');
	$.ajax({
		url: "public/data/pedalboards.json",
		dataType: 'text',
		type: "GET",
		success: function(data){
			data = $.parseJSON(data.replace(/\r\n/g, "").replace(/\t/g, ""));
			var pedalboards = [];
			for(var pedalboard in data){
				pedalboards.push( new PedalBoard(
					data[pedalboard].Brand 	|| "",
					data[pedalboard].Name 	|| "",
					data[pedalboard].Width 	|| "",
					data[pedalboard].Height 	|| "",
					data[pedalboard].Image 	|| ""
				));
			}
			console.log("Pedalboard data loaded");
			RenderPedalBoards(pedalboards);
		}
	});
};

window.RenderPedalBoards = function(pedalboards){
	console.log('RenderPedalBoards');
	for(var i in pedalboards) {
		var $pedalboard = $("<option>"+ pedalboards[i].Brand + " " + pedalboards[i].Name +"</option>").attr('id', pedalboards[i].Name.toLowerCase().replace(/\s+/g, "-").replace(/'/g, ''));
		$pedalboard.data('width', pedalboards[i].Width);
		$pedalboard.data('height', pedalboards[i].Height);
		$pedalboard.data('height', pedalboards[i].Height);
		$pedalboard.data('image', pedalboards[i].Image);
		$pedalboard.appendTo('.pedalboard-list');
	}
}
