import User from "../../models/user";

export const CREATE_USER = 'CREATE_USER';
export const UPDATE_USER = 'UPDATE_USER';
export const SET_USERS = 'SET_USERS';
export const UPDATE_USER_PASSWORD = 'UPDATE_USER_PASSWORD';
export const SEND_INVITATION = 'SEND_INVITATION';
export const ACCEPT_INVITATION = 'ACCEPT_INVITATION';
export const DECLINE_INVITATION = 'DECLINE_INVITATION';
export const DELETE_FRIEND = 'DELETE_FRIEND';

export const fetchUsers = () => {

    return async (dispatch, getState) => {
        const userId = getState().auth.userId;
        try {
            const response = await fetch('https://shopwithme-2d872-default-rtdb.europe-west1.firebasedatabase.app/users.json');

            if (!response.ok) {
                throw new Error("Coś poszło nie tak!");
            }

            const resData = await response.json();
            const allUsers = [];
            let dbName;

            for (const key in resData) {
                allUsers.push(new User(resData[key].authId, resData[key].firstname, resData[key].lastname, resData[key].email, resData[key].username, resData[key].friends, resData[key].newFriends, resData[key].awaitingFriends));
                if (resData[key].authId === userId) {
                    dbName = key;
                }
            }

            dispatch({ type: SET_USERS, logId: userId, dbname: dbName, users: allUsers });
        }
        catch (err) {
            throw err;
        }
    };
};

export const createUser = (firstname, lastname, email, username) => {
    return async (dispatch, getState) => {
        const friends = [];
        const newFriends = [];
        const awaitingFriends = [];
        const userId = getState().auth.userId;
        const response = await fetch('https://shopwithme-2d872-default-rtdb.europe-west1.firebasedatabase.app/users.json', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                authId: userId,
                firstname,
                lastname,
                email,
                username,
                friends,
                newFriends,
                awaitingFriends,
            })
        });

        if (!response.ok) {
            throw new Error("Coś poszło nie tak!");
        }

        const resData = await response.json();

        dispatch({
            type: CREATE_USER, logId: userId, dbname: resData.name, user: {
                authId: userId,
                firstname: firstname,
                lastname: lastname,
                email: email,
                username: username,
                friends: friends,
                newFriends: newFriends,
                awaitingFriends: awaitingFriends,
            }
        });
    };
};

export const updateUser = (dbname, authId, firstname, lastname, email, username, friends, newFriends, awaitingFriends) => {
    return async (dispatch, getState) => {
        const userId = getState().auth.userId;
        const idToken = getState().auth.token;

        const response = await fetch(`https://shopwithme-2d872-default-rtdb.europe-west1.firebasedatabase.app/users/${dbname}.json`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                firstname,
                lastname,
                email
            })
        });

        if (!response.ok) {
            throw new Error("Coś poszło nie tak!");
        }

        const responseAuth = await fetch("https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyCWHo2xsoWaeuLP841VNVSgfkuRZzG8oVE", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                idToken: idToken,
                email: email,
                returnSecureToken: true
            })
        });

        if (!responseAuth.ok) {
            throw new Error("Coś poszło nie tak AUTH!");
        }

        const resData = await responseAuth.json();
        const authState = getState().auth;
        if (resData.idToken) {
            authState.token = resData.idToken;
        }

        dispatch({
            type: UPDATE_USER, logId: userId, dbname: dbname, user: {
                authId: authId,
                firstname: firstname,
                lastname: lastname,
                email: email,
                username: username,
                friends: friends,
                newFriends: newFriends,
                awaitingFriends: awaitingFriends,
            }
        });
    }
};

export const updatePassword = (newPassword) => {
    return async (dispatch, getState) => {
        const idToken = getState().auth.token;
        const response = await fetch("https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyCWHo2xsoWaeuLP841VNVSgfkuRZzG8oVE", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                idToken: idToken,
                password: newPassword,
                returnSecureToken: true
            })
        });

        if (!response.ok) {
            throw new Error("Coś poszło nie tak!");
        }

        const resData = await response.json();
        const authState = getState().auth;
        authState.token = resData.idToken;

        dispatch({
            type: UPDATE_USER_PASSWORD
        });
    }
};

export const sendInvitation = (userFrom, userTo) => {
    return async (dispatch, getState) => {
        try {
            const responseAllUsers = await fetch('https://shopwithme-2d872-default-rtdb.europe-west1.firebasedatabase.app/users.json');

            if (!responseAllUsers.ok) {
                throw new Error("Coś poszło nie tak!");
            }

            const resData = await responseAllUsers.json();
            const allUsers = [];

            for (const key in resData) {
                allUsers.push(new User(resData[key].authId, resData[key].firstname, resData[key].lastname, resData[key].email, resData[key].username, resData[key].friends, resData[key].newFriends, resData[key].awaitingFriends));
            }

            // RECIPIENT
            var recipientDatabaseId;
            for (const key in resData) {
                if (resData[key].authId === userTo.authId) {
                    recipientDatabaseId = key;
                }
            }

            const recipientUser = allUsers.find(user => user.authId === userTo.authId);
            recipientUser.newFriends.push(userFrom.authId);
            for (const key in allUsers) {
                if (allUsers[key].authId === userTo.authId) {
                    allUsers[key] = recipientUser;
                }
            }

            const responseRecipientUser = await fetch(`https://shopwithme-2d872-default-rtdb.europe-west1.firebasedatabase.app/users/${recipientDatabaseId}.json`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    newFriends: recipientUser.newFriends
                })
            });

            if (!responseRecipientUser.ok) {
                throw new Error("Coś poszło nie tak!");
            }

            // SENDER
            var senderDatabaseId;
            for (const key in resData) {
                if (resData[key].authId === userFrom.authId) {
                    senderDatabaseId = key;
                }
            }

            const senderUser = allUsers.find(user => user.authId === userFrom.authId);
            senderUser.awaitingFriends.push(userTo.authId);
            for (const key in allUsers) {
                if (allUsers[key].authId === userFrom.authId) {
                    allUsers[key] = senderUser;
                }
            }

            const responseSenderUser = await fetch(`https://shopwithme-2d872-default-rtdb.europe-west1.firebasedatabase.app/users/${senderDatabaseId}.json`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    awaitingFriends: senderUser.awaitingFriends
                })
            });

            if (!responseSenderUser.ok) {
                throw new Error("Coś poszło nie tak!");
            }

            dispatch({ type: SEND_INVITATION, users: allUsers });
        }
        catch (err) {
            throw err;
        }
    };
}

export const acceptInvitation = (userFrom, userTo) => {
    return async (dispatch, getState) => {
        try {
            const responseAllUsers = await fetch('https://shopwithme-2d872-default-rtdb.europe-west1.firebasedatabase.app/users.json');

            if (!responseAllUsers.ok) {
                throw new Error("Coś poszło nie tak!");
            }

            const resData = await responseAllUsers.json();
            const allUsers = [];

            for (const key in resData) {
                allUsers.push(new User(resData[key].authId, resData[key].firstname, resData[key].lastname, resData[key].email, resData[key].username, resData[key].friends, resData[key].newFriends, resData[key].awaitingFriends));
            }

            // RECIPIENT
            var recipientDatabaseId;
            for (const key in resData) {
                if (resData[key].authId === userTo.authId) {
                    recipientDatabaseId = key;
                }
            }

            const recipientUser = allUsers.find(user => user.authId === userTo.authId);
            recipientUser.newFriends = recipientUser.newFriends.filter(item => item !== userFrom);
            recipientUser.awaitingFriends = recipientUser.awaitingFriends.filter(item => item !== userFrom);
            recipientUser.friends.push(userFrom);
            for (const key in allUsers) {
                if (allUsers[key].authId === userTo.authId) {
                    allUsers[key] = recipientUser;
                }
            }

            const responseRecipientUser = await fetch(`https://shopwithme-2d872-default-rtdb.europe-west1.firebasedatabase.app/users/${recipientDatabaseId}.json`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    friends: recipientUser.friends,
                    awaitingFriends: recipientUser.awaitingFriends,
                    newFriends: recipientUser.newFriends
                })
            });

            if (!responseRecipientUser.ok) {
                throw new Error("Coś poszło nie tak!");
            }

            // SENDER
            var senderDatabaseId;
            for (const key in resData) {
                if (resData[key].authId === userFrom) {
                    senderDatabaseId = key;
                }
            }

            const senderUser = allUsers.find(user => user.authId === userFrom);
            senderUser.newFriends = senderUser.newFriends.filter(item => item !== userTo.authId);
            senderUser.awaitingFriends = senderUser.awaitingFriends.filter(item => item !== userTo.authId);
            senderUser.friends.push(userTo.authId);
            for (const key in allUsers) {
                if (allUsers[key].authId === userFrom) {
                    allUsers[key] = senderUser;
                }
            }

            const responseSenderUser = await fetch(`https://shopwithme-2d872-default-rtdb.europe-west1.firebasedatabase.app/users/${senderDatabaseId}.json`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    friends: senderUser.friends,
                    newFriends: senderUser.newFriends,
                    awaitingFriends: senderUser.awaitingFriends
                })
            });

            if (!responseSenderUser.ok) {
                throw new Error("Coś poszło nie tak!");
            }

            dispatch({ type: ACCEPT_INVITATION, users: allUsers });
        }
        catch (err) {
            throw err;
        }
    };
}

export const declineInvitation = (userFrom, userTo) => {
    return async (dispatch, getState) => {
        try {
            const responseAllUsers = await fetch('https://shopwithme-2d872-default-rtdb.europe-west1.firebasedatabase.app/users.json');

            if (!responseAllUsers.ok) {
                throw new Error("Coś poszło nie tak!");
            }

            const resData = await responseAllUsers.json();
            const allUsers = [];

            for (const key in resData) {
                allUsers.push(new User(resData[key].authId, resData[key].firstname, resData[key].lastname, resData[key].email, resData[key].username, resData[key].friends, resData[key].newFriends, resData[key].awaitingFriends));
            }

            // RECIPIENT
            var recipientDatabaseId;
            for (const key in resData) {
                if (resData[key].authId === userTo.authId) {
                    recipientDatabaseId = key;
                }
            }

            const recipientUser = allUsers.find(user => user.authId === userTo.authId);
            recipientUser.newFriends = recipientUser.newFriends.filter(item => item !== userFrom);
            recipientUser.awaitingFriends = recipientUser.awaitingFriends.filter(item => item !== userFrom);
            for (const key in allUsers) {
                if (allUsers[key].authId === userTo.authId) {
                    allUsers[key] = recipientUser;
                }
            }

            const responseRecipientUser = await fetch(`https://shopwithme-2d872-default-rtdb.europe-west1.firebasedatabase.app/users/${recipientDatabaseId}.json`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    newFriends: recipientUser.newFriends
                })
            });

            if (!responseRecipientUser.ok) {
                throw new Error("Coś poszło nie tak!");
            }

            // SENDER
            var senderDatabaseId;
            for (const key in resData) {
                if (resData[key].authId === userFrom) {
                    senderDatabaseId = key;
                }
            }

            const senderUser = allUsers.find(user => user.authId === userFrom);
            senderUser.newFriends = senderUser.newFriends.filter(item => item !== userTo.authId);
            senderUser.awaitingFriends = senderUser.awaitingFriends.filter(item => item !== userTo.authId);
            for (const key in allUsers) {
                if (allUsers[key].authId === userFrom) {
                    allUsers[key] = senderUser;
                }
            }

            const responseSenderUser = await fetch(`https://shopwithme-2d872-default-rtdb.europe-west1.firebasedatabase.app/users/${senderDatabaseId}.json`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    awaitingFriends: senderUser.awaitingFriends
                })
            });

            if (!responseSenderUser.ok) {
                throw new Error("Coś poszło nie tak!");
            }

            dispatch({ type: DECLINE_INVITATION, users: allUsers });
        }
        catch (err) {
            throw err;
        }
    };
}

export const deleteFriend = (friend) => {
    return async (dispatch, getState) => {
        const userId = getState().auth.userId;
        try {
            const responseAllUsers = await fetch('https://shopwithme-2d872-default-rtdb.europe-west1.firebasedatabase.app/users.json');

            if (!responseAllUsers.ok) {
                throw new Error("Coś poszło nie tak!");
            }

            const resData = await responseAllUsers.json();
            const allUsers = [];

            for (const key in resData) {
                allUsers.push(new User(resData[key].authId, resData[key].firstname, resData[key].lastname, resData[key].email, resData[key].username, resData[key].friends, resData[key].newFriends, resData[key].awaitingFriends));
            }

            // USER
            var userDatabaseId;
            for (const key in resData) {
                if (resData[key].authId === userId) {
                    userDatabaseId = key;
                }
            }

            const actuallUser = allUsers.find(user => user.authId === userId);
            actuallUser.friends = actuallUser.friends.filter(item => item !== friend.authId);
            for (const key in allUsers) {
                if (allUsers[key].authId === userId) {
                    allUsers[key] = actuallUser;
                }
            }

            const responseRecipientUser = await fetch(`https://shopwithme-2d872-default-rtdb.europe-west1.firebasedatabase.app/users/${userDatabaseId}.json`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    friends: actuallUser.friends
                })
            });

            if (!responseRecipientUser.ok) {
                throw new Error("Coś poszło nie tak!");
            }

            // friend
            var friendDatabaseId;
            for (const key in resData) {
                if (resData[key].authId === friend.authId) {
                    friendDatabaseId = key;
                }
            }

            const friendUser = allUsers.find(user => user.authId === friend.authId);
            friendUser.friends = friendUser.friends.filter(item => item !== userId);
            for (const key in allUsers) {
                if (allUsers[key].authId === friend.authId) {
                    allUsers[key] = friendUser;
                }
            }

            const responseSenderUser = await fetch(`https://shopwithme-2d872-default-rtdb.europe-west1.firebasedatabase.app/users/${friendDatabaseId}.json`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    friends: friendUser.friends
                })
            });

            if (!responseSenderUser.ok) {
                throw new Error("Coś poszło nie tak!");
            }

            dispatch({ type: DELETE_FRIEND, users: allUsers });
        }
        catch (err) {
            throw err;
        }
    };
}