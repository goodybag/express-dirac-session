# User and Session

> Looks up the session and the user in a single query

__Install:__

```
npm install express-dirac-session
```

__Usage:__

Just like standard express session middleware, but with more options

```javascript
// Tell dirac about your dal
dirac.register( require('express-dirac-session/dal') );

// Use the middleware
app.use( require('express-dirac-session')({
  secret: config.session.secret
, cookie: config.session.cookie
, resave: config.session.resave
, saveUninitialized: config.session.saveUninitialized
, queryOptions: {
    // Describe how to fetch users as a sub-query
    // Also, do a one-to-many pluck on users_groups
    one:  [ { table: 'users', alias: 'user'
            , one:    []
            , many:   []
            , pluck:  [ { table: 'users_groups', alias: 'groups', column: 'group' } ]
            }
          ]
  }
}));


///accccctuallllly
// Since express session implementations don't have access
// to req/res objects, all information needs to be
// communicated through the req.session object. We put the
// User object on
app.use( function( req, res, next ){
  req.user = req.session.canonical;
  delete req.session.canonical;
  next();
});
```