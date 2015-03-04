'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Customer = mongoose.model('Customer'),
	_ = require('lodash'),
	Twitter = require('twitter'),
	config = require('../../config/config'),
	User = mongoose.model('User'),
	Country = mongoose.model('Country'),
	passport = require('passport');

/**
 * Create a Customer
 */
exports.create = function(req, res) {
	var customer = new Customer(req.body);
	customer.user = req.user;

	customer.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(customer);
		}
	});
};

exports.create2 = function(data, user) {

for (var i = data.items.length - 1; i >= 0; i--) {
		//Things[i]
	var customer = new Customer({videos: data.items[i], user: user});
	//customer.user = req.user;
	
	customer.save(function(err) {
		if (err) {
			console.log('pailas',err);
			
		} else {
			console.log('super');
		}
	}
	);

	}	

};
/**
 * Show the current Customer
 */
exports.read = function(req, res) {
	res.jsonp(req.customer);
};

/**
 * Update a Customer
 */
exports.update = function(req, res) {
	var customer = req.customer ;

	customer = _.extend(customer , req.body);

	customer.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(customer);
		}
	});
};

/**
 * Delete an Customer
 */
exports.delete = function(req, res) {
	var customer = req.customer ;

	customer.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(customer);
		}
	});
};

/**
 * List of Customers
 */
 /*
exports.list = function(req, res) { 
	Customer.find().sort('-created').populate('user', 'displayName').exec(function(err, customers) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(customers);
		}
	});
};
*/

exports.list = function(req, res) { 

	var sort;
	var sortObject = {};

	var count = req.query.count || 5;
	var page = req.query.page || 1;

	var filter = {
		filters : {
			mandatory : {
				contains: req.query.filter
			}
		}
	};

	var pagination = {
		start : (page - 1) * count,
		count: count
	};


	if(req.query.sorting){
		var sortKey = Object.keys(req.query.sorting)[0];
		var sortValue = req.query.sorting[sortKey];
		sortObject[sortValue] = sortKey;
	} else{
		sortObject['desc'] = '_id';
	}


	var sort = {
		sort: sortObject
	};

	Customer
		.find({user: req.user})
		.filter(filter)
		.order(sort)
		.page(pagination, function(err, customers){
				if(err){
					return res.status(400).send({
						message: errorHandler.getErrorMessage(err)
					});
				} else{
					var country = [],
	tokens = [],
	videos = customers;



//User.find({provider: 'twitter'}, function(err, providerData){
              
        
        /*tokens = providerData;
        //console.dir(item);
        //console.log('que pasa ' + country[1].providerData.token);
        
        var client = new Twitter({
  			consumer_key: config.twitter.clientID,
  			consumer_secret: config.twitter.clientSecret,
  			access_token_key: tokens[0].providerData.token,
  			access_token_secret: tokens[0].providerData.tokenSecret
			});
      		
			client.get('/trends/available', function(err, payload){
			//console.log(payload);

			if(err){
				throw err;	
			} */
		 	/*var b=0;
 	 		for (i = 0; i < payload.length; i++) { 
    
    		if (payload[i].placeType.name === 'Country' && (payload[i].country) !== null){
       
       		country[b] = {'country': payload[i].country, 'woeid': payload[i].woeid};
    
      		b=b+1;
     		}
     
  			}*/

  			Country.find(function(err, country){
  				var socketio = req.app.get('socketio'); // tacke out socket instance from the app container
            	//console.log(country);
				socketio.sockets.emit('article.created', country); // emit an event for all connected clients
  			});

            //var socketio = req.app.get('socketio'); // tacke out socket instance from the app container
            	//console.log(country);
			//	socketio.sockets.emit('article.created', country); // emit an event for all connected clients
					/*
				socketio.on('connection', function(socket) {  
				console.log('esto llego');
				socket.on('countryenv', function(data) {
            		console.log('entro!!!' + data);

            	});
				});*/
				var item = { item1: 'uuu', item2: 'uuu', item3: 'uuu'};
				for (var i = videos.results.length - 1; i >= 0; i--) {
					videos.results[i].videos.kind = (videos.results[i].videos.kind,item);
				}
							
				//customers.results = {};
				//customers.results = videos.results = customers.results[0].videos.items;
				

				
				//console.log(customers);
				//return customers;
				res.jsonp(videos);
				//return customers;
  				
			//});	
  			//});
					
						}
		});
};


/**
 * Customer middleware
 */
exports.customerByID = function(req, res, next, id) { 
	Customer.findById(id).populate('user', 'displayName').exec(function(err, customer) {
		if (err) return next(err);
		if (! customer) return next(new Error('Failed to load Customer ' + id));
		req.customer = customer ;
		next();
	});
};

/**
 * Customer authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.customer.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};

//var country;

exports.countryTwitter = function(data, user, socket) {

	var country = '',
	params = '',
	tokens = [],
	i;



User.find({provider: 'twitter', _id: user}, function(err, providerData){
              
        
        tokens = providerData;
        //console.dir(item);
        //console.log(providerData.providerData.token);
        
        var client = new Twitter({
  			consumer_key: config.twitter.clientID,
  			consumer_secret: config.twitter.clientSecret,
  			access_token_key: providerData[0].providerData.token,
  			access_token_secret: providerData[0].providerData.tokenSecret
			});
        
        client.get('/trends/place',{id: data}, function(err, payload){
    	//console.log(payload[0].trends.length);
    	if(err){
				throw err;	
			} else {
    	for (var i = 0 ; i < payload[0].trends.length; i++) {
                //mensaje.text(data[0].trends[i].name);
  
                country =  country + payload[0].trends[i].name + ' ';
                
              }
    		}
    	socket.emit('trendenv',country);
    	//country = payload;
    	//console.log(payload);
    	//console.log(country[0].trends);
    	//module.exports.myObj = country;
    	
 		 }); 

               
    });

	
	
  //return tokens;
};

exports.sendTwitter = function(data, user, socket) {


	User.find({provider: 'twitter', _id: user}, function(err, providerData){
	var client = new Twitter({
  			consumer_key: config.twitter.clientID,
  			consumer_secret: config.twitter.clientSecret,
  			access_token_key: providerData[0].providerData.token,
  			access_token_secret: providerData[0].providerData.tokenSecret
			});
     //console.log(providerData[1]+' data');   	
	client.post('statuses/update', {status: data },  function(error, data,response){

  				//if(error) throw error; h  º1GVGVGVGVGVGVGVBHGJHJKHJH
  				if(!error){
  					console.log('Tweet enviado',error);  // Tweet body.
  					socket.emit('mensagge','send');
  				}else{
  					socket.emit('mensagge',error);
  					console.log('error',error);		
  					}
  				//console.log(response);
  				//console.log(response);  // Raw response object.

				});

  });

};
/*
exports.countryTwitter = function(req, res) { 
//console.info('XXXXX ' + TwitterStrategy);


//console.log('kkkkkk' + users);

//User.find({provider: 'twitter'}).limit(1);

var country = [],
	tokens = [],
	i;



User.find({provider: 'twitter'}, function(err, providerData){
              
        //console.log('Find: ' + providerData);
        tokens = providerData;
        //console.dir(item);
        //console.log('que pasa ' + country[1].providerData.token);
        var client = new Twitter({
  			consumer_key: config.twitter.clientID,
  			consumer_secret: config.twitter.clientSecret,
  			access_token_key: tokens[1].providerData.token,
  			access_token_secret: tokens[1].providerData.tokenSecret
			});
      		
			client.get('/trends/available', function(err, payload){
			
		 	var b=0;
 	 		for (i = 0; i < payload.length; i++) { 
    
    		if (payload[i].placeType.name === 'Country' && (payload[i].country) !== null){
       
       		country[b] = {"country": payload[i].country, "woeid": payload[i].woeid};
    //country.country[i] = {'country' : payload[i].country, 'woeid' : payload[i].woeid};
    //country.woeid[i] = payload[i].woeid;
      		b=b+1;
     		}
     
  			}
            console.info(country);
  			res.jsonp(country);
			});	
  			});

};*/