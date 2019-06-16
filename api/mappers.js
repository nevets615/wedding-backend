module.exports = {
  intToBoolean
}

function intToBoolean(int) {
  return int === 1 ? true : false;
}
function userToBody(user) {
    const result = {
      ...user,
      completed: intToBoolean(user.completed)
    };
  
    if (user.guests) {
      result.guests = user.guests.map(guest => ({
        ...guest,
        completed: intToBoolean(guest.completed)
      }));
    }
  
    return result;
  }