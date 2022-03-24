import User from "../../models/user";

export const CREATE_USER = 'CREATE_USER';
export const UPDATE_USER = 'UPDATE_USER';
export const SET_USERS = 'SET_USERS';

export const fetchUsers = () => {

    return async (dispatch) => {
        try {
            const response = await fetch('https://shopwithme-2d872-default-rtdb.europe-west1.firebasedatabase.app/users.json'
            );

            if(!response.ok) {
                throw new Error("Coś poszło nie tak!");
            }

            const resData = await response.json();
            const allUsers = [];

            for (const key in resData) {
                allUsers.push(new User(resData[key].authId, resData[key].firstname, resData[key].lastname, resData[key].email, resData[key].username, resData[key].friends));
            }

            dispatch({ type: SET_USERS, users: allUsers });
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

        if(!response.ok) {
            throw new Error("Coś poszło nie tak!");
        }

        const resData = response.json();

        dispatch({
            type: CREATE_USER, user: {
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

export const updateProduct = (id, firstname, lastname, email) => {
    return async (dispatch, getState) => {
        // const token = getState().auth.token;
        const response = await fetch(`https://shopwithme-2d872-default-rtdb.europe-west1.firebasedatabase.app/users/${id}.json`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                firstname,
                lastname,
                email,
            })
        });

        if(!response.ok) {
            throw new Error("Coś poszło nie tak!");
        }

        dispatch({
            type: UPDATE_USER, authId: id, user: {
                firstname: firstname,
                lastname: lastname,
                email: email,
            }
        });
    }
};