const db = require('../database/dbConfig');
const mappers = require('./mappers');

module.exports = {
  get,
  getUsersGuests
}
function get(id) {
    let query = db("users as p");
  
    if (id) {
      query.where("p.id", id).first();
  
      const promises = [query, this.getUserGuests(id)]; // [ users, guests ]
  
      return Promise.all(promises).then(function(results) {
        let [user, guests] = results;
  
        if (user) {
          user.guests = guests;
  
          return mappers.userToBody(user);
        } else {
          return null;
        }
      });
    }
  
    return query.then(users => {
      return users.map(user => mappers.userToBody(user));
    });
  }
  function getUsersGuests(userId) {
    return db('guest')
      .where('user_id', userId)
      .then(guests => guests.map(guest => mappers.guestToBody(guest)));
  }