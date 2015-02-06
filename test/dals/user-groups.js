module.exports = {
  name: 'user_groups'
, schema: {
    id:         { type: 'serial', primaryKey: true }
  , user_id:    { type: 'int', references: { table: 'users', column: 'id' }, onDelete: 'cascade' }
  , name:       { type: 'text' }
  }
};