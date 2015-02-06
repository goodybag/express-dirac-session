/**
 * User and Session
 * * WARNING:
 *   We use session.user.id to identify the user. You should
 *   only _ever_ set user.id when you are absolutely positive
 *   that that is the user you're dealing with. This is pretty
 *   much when the provide a valid username/password combo.
 */

var session = require('express-session');
var _       = require('lodash');
var async   = require('async');
var dirac   = require('dirac');
var Store   = require('./store')( session );

module.exports = function( options ){
  options = _.defaults( options || {}, {
    queryOptions: {
      one: [{ table: 'users', alias: 'user' }]
    }
  , dals: dirac.dals
  });

  if ( !options.secret ){
    throw new Error('Missing required property `secret`');
  }

  if ( !options.cookie ){
    throw new Error('Missing required property `cookie`');
  }

  // Instead of self-registering, we'll rely on db
  // to register the dal independently
  var dal = dirac.dals.dirac_session;

  var dSession = session({
    store:  new Store({
              dal:          dal
            , queryOptions: options.queryOptions
            })
  , secret: options.secret
  , cookie: options.cookie
  , resave: options.resave
  , saveUninitialized: options.saveUninitialized
  });

  var cParser = require('cookie-parser')( options.secret );

  return function( req, res, next ){
    async.series([
      cParser.bind( null, req, res )
    , dSession.bind( null, req, res )
    ], function( error ){
      if ( error ) return next( error );

      req.user = req.session.canonical;
      delete req.session.canonical;

      next();
    });
  };
};
