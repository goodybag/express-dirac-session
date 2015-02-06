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
  secret: 'blah'
          // two weeks
, cookie: { maxAge: 14 * 24 * 60 * 60 * 1000 }
, resave: true
, saveUninitialized: true
  // This is optional - by default, we just look up all properties on the user
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
```