const db = require('../users/users-model')

async function insert(user) {
    const [id] = await db('users').insert(user);
    return getById(id);
  }

  function getById(id) {
    return db('users').where('id', id).first();
  }

  function findBy(filter) {
    return db('users').where(filter)
  }

  module.exports = {
      insert, 
      getById,
      findBy
  }