var socket = io();	

socket.on('connection', function(socket){
	console.log("User connected");
});
