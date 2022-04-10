class User {
    constructor(authId, firstname, lastname, email, username, friends = [], newFriends = [], awaitingFriends = []) {
        this.authId = authId;
        this.firstname = firstname;
        this.lastname = lastname;
        this.email = email;
        this.username = username;
        this.friends = friends;
        this.newFriends = newFriends;
        this.awaitingFriends = awaitingFriends;
    }
}

export default User;