import User from "../../models/user";

export const CREATE_USER = 'CREATE_USER';
export const UPDATE_USER = 'UPDATE_USER';
export const SET_USERS = 'SET_USERS';
export const UPDATE_USER_PASSWORD = 'UPDATE_USER_PASSWORD';

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
                allUsers.push(new User(resData[key].authId, resData[key].firstname, resData[key].lastname, resData[key].email, resData[key].username, resData[key].friends));
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
            }
        });
    };
};

export const updateUser = (dbname, authId, firstname, lastname, email, username, friends) => {
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
        if(resData.idToken) {
            authState.token = resData.idToken;
        }

        dispatch({
            type: UPDATE_USER, logId: userId, dbname: dbname, user: {
                authId: authId,
                firstname: firstname,
                lastname: lastname,
                email: email,
                username: username,
                friends: friends
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