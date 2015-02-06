module.exports = {
  name: 'users'
, schema: {
    id:         { type: 'serial', primaryKey: true }
  , email:      { type: 'text' }
  , password:   { type: 'text' }
  }
};