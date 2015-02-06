console.log('Ensure you\'ve created database eds_test');

var app = require('express')();
var dirac = require('dirac');

var testUser = {
  email: 'test@test.com'
, password: 'password'
};

dirac.use( dirac.relationships() );
dirac.use( dirac.dir( __dirname + '/dals' ) );
dirac.register( require('../dal') );

dirac.init('postgres://localhost:5432/eds_test');

app.use( require('../')({
  secret:             'byaaaaahhhhhhhh'
, resave:             false
, cookie:             { maxAge: 14 * 24 * 60 * 60 * 1000 }
, saveUninitialized:  true
}));

app.get('/', function( req, res ){
  res.json({
    session: req.session
  , user: req.user
  });
});

app.get('/login', function( req, res ){
  dirac.dals.users.findOne( { email: testUser.email }, function( error, user ){
    if ( error ){
      res.setStatus(500);
      return res.json( error );
    }

    req.session.user = { id: user.id };

    req.session.save( function( error ){
      if ( error ){
        return res.setStatus(500).json({ message: 'error saving session', details: error });
      }

      res.json( user );
    });
  });
});

app.get('/logout', function( req, res ){
  req.session.destroy( function( error ){
    if ( error ){
      return res.setStatus(500).json({ message: 'error destroying session', details: error });
    }

    res.sendStatus(204);
  });
});

dirac.sync({ force: true }, function( error ){
  if ( error ) throw error;

  dirac.dals.users.remove( {}, function( error ){
    if ( error ) throw error;

    dirac.dals.users.insert( testUser, function( error, user ){
      if ( error ) throw error;

      app.listen(4000, function(){
        console.log('Test user', user);
        console.log("Test server listening on port 4000");
      });
    });
  });
});