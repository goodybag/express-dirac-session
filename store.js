/**
 * Store
 */

var util  = require('util');
var dirac = require('dirac');

module.exports = function( session ){
  util.inherits( Store, session.Store );

  function Store( options ){
    if ( !(options.dal instanceof dirac.DAL) ){
      throw new Error('Missing required option: `dal`');
    }

    this.options = options;
    this.dal = options.dal;
  }

  Store.prototype.get = function( sid, callback ){
    var $query = {
      sid: sid
    , expires_at: { $gt: new Date() }
    };

    this.dal.findOne( $query, this.options.queryOptions, function( error, result ){
      if ( error || !result ) return callback( error );

      result.data.canonical = result.user;

      return callback( null, result.data );
    });
  };

  Store.prototype.set = function( sid, data, callback ){
    var $where = { sid: sid };

    var $update = {
      sid:        sid
    , data:       data
    , expires_at: data.cookie._expires
    , user_id:    data.user ? data.user.id : null
    };

    var options = { returning: ['*'] };

    this.dal.update( $where, $update, options, function( error, results ){
      if ( error ) return callback( error );

      if ( Array.isArray( results ) && results[0] ) return callback();

      this.dal.insert( $update, function( error, result ){
        if ( error ) return callback( error );

        callback();
      });
    }.bind( this ));
  };

  Store.prototype.destroy = function( sid, callback ){
    this.dal.remove( { sid: sid }, callback );
  };

  return Store;
};