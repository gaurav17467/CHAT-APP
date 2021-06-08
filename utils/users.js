const users = [];

//join user to chat 

function userJoin(id,username,room){
    const user={id,username,room};

    users.push(user);

    return user;
}
 
//GET current user

function getCurrentUser(id) {
    return users.find(user => user.id === id);
  }

//USER LEAVES CHAT

function userLeave(id) {
    const index=users.findIndex(user=> user.id===id)

    if(index!== -1){
        return users.splice(index,1)[0]
        //splice function gives an array of removed items
    }
}

//GET ROOM USERS
function getRoomUsers(room){
    return users.filter(user=>user.room===room);
}

module.exports = {
    userJoin,
    getCurrentUser,
    userLeave,
    getRoomUsers
  };