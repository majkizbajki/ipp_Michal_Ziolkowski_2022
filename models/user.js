class User {
    constructor(authId, firstname, lastname, email, username, friends = []) {
        this.authId = authId;
        this.firstname = firstname;
        this.lastname = lastname;
        this.email = email;
        this.username = username;
        this.friends = friends;
    }
}

export default User;