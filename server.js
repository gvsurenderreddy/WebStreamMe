var express = require('express'),
	          app = express(),
              http = require('http'),
              server = http.createServer(app),
              io = require('socket.io').listen(server),
			  util = require('util'),
			  spawn = require('child_process').spawn;


//configuration used for hosting on heroku
//since it does not support websockets
/*
io.configure( function () {
	io.set("transports",["xhr-polling"]);
	io.set("polling duration", 10);
});
*/

function startDesktopStream ( socket )
{
	//spawn child process for running bash script
	var stream = spawn('java',['screenStream']),
	    buf = new String(); //string buffer for base64 image data

	//retrive echoed data from script
	stream.stdout.on('data', function( data ){
		data = data.toString();

		//add data to buffer
		buf += data;
		
		//if buf ends with delimiter, delete it and send it to
		//client
		if ( buf.length > 4 && buf.slice(-4) == 'DONE'){
			buf = buf.slice(0,-4);
			socket.emit("imgData", { image : buf });
			buf = '';
		}
	});

	//when stream is closed record exit status for debugging
	stream.on('close', function (code) {
		if ( code != 0 ){
			util.log('stream process exited with code ' + code );
		}
	});

	//return function which can be used to kill process
	function kill () {
		stream.kill('SIGINT');
	}

	return { kill : kill };
		
}


//client connected save socket descriptor
io.sockets.on('connection', function ( socket ){
	var stream = startDesktopStream( socket );

	//when socket disconnects. kill process
	socket.on('disconnect', function (socket){
		stream.kill();
	});
});



server.listen( 8080, function () {
	util.log("server started on port 8080");
});

app.use( express.static(__dirname + '/public') );



