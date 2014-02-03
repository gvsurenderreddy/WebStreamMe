
/* 
	use your local port. I use one specific to my laptop
	but the standard is http://localhost
*/
//var socket = io.connect('manuels-macbook-pro.local/');
var socket = io.connect('http://localhost');


//construct url for img source from base64 string
var image_src = function (base64OfImg) {
	return 'data:image/png;base64,' + base64OfImg;
}

//image object we will continue reusing in canvas
var image = new Image();

//when image loaded from socket
image.onload = function () {
	//remove current picture
	project.activeLayer.removeChildren();
	
	//setup new picture
	var raster = new Raster(image);
	//scale image to fit in canvas
	raster.fitBounds(view.bounds, true);
	//draw picture
	view.draw();
};

//when we recieve image data, start loading it
socket.on('imgData', function(data) {	
	//console.log("GOT IT");
	image.src = image_src(data.image);
})
