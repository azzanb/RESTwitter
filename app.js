const Twit = require('twit'),
	  configKey = require('./config.js'),
	  tweet = new Twit(configKey),
	  ta = require('time-ago')(), //this module will format the twitter time for tweets and messages
	  express = require('express'),
	  path = require('path'),
	  app = express(),
	  server = require('http').createServer(app),	
	  io = require('socket.io').listen(server);
	  publicPath = path.join(__dirname, './public');


app.set('views', __dirname + '/views');
app.set('view engine', 'pug'); 
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(publicPath));


io.on('connection', function(socket){
	console.log("Connected to Socket.io!");
});



//Access user's profile information
function user(req, res, next){
	tweet.get('account/verify_credentials', { skip_status: true }, function(err, data, res){
		req.data = data;	
		next();
	});
};

//Access user's statuses
function statuses(req, res, next){
	tweet.get('statuses/user_timeline', (err, statuses, res) => {
		req.statuses = statuses;
		next();
	});
};

//Access who user follows
function friends(req, res, next){
	tweet.get('friends/list', function(err, friends, res){
		req.friends = friends;
		next();
	});
};


//Access user's messages
const searchMessages = 'https://api.twitter.com/1.1/direct_messages.json?count=6';
function messages(req, res, next){
	tweet.get(searchMessages, (err, messages, res) => {
		req.messages = messages
		next();
	});
};

function followers(req, res, next){
	tweet.get('followers/list', (err, followers, res) => {
		// req.followers =followers
		// next();
		console.log(followers);
	});
}


//To access variables at the home route, makes sure to put variables of the 
//previous functions on the request object
app.get('/', user, statuses, friends, messages, (req, res) => {
	res.render('sample', {
		data: req.data,
		statuses: req.statuses,
		friends: req.friends, 
		messages: req.messages
	});
});

	

server.listen(3000, function(){
	console.log("Open your browser to localhost:3000!");
});

