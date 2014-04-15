
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
  	username : req.body.username,
  	password : req.body.password
  });

  user.save( function( err ){
    res.redirect(req.originalUrl);
  });
};