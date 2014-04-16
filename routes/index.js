/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Goalkeeper' });
};

var mongoose = require( 'mongoose' );
var User = mongoose.model( 'User' );

exports.create = function ( req, res ){
	console.log(req.body);
  	var user = new User({
  		email : req.body.email,
		password : req.body.password
	});

  	user.save( function( err ){
  		if (err) {
  			console.log(err);
  		}
		res.redirect('/main');
	});
};