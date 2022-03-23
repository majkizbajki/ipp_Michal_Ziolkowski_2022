export const CREATE_USER = 'CREATE_USER';

export const createUser = (firstname, lastname, email, username) => {
    return async (dispatch, getState) => {
        const userId = getState().auth.userId;
        const response = await fetch('https://shopwithme-2d872-default-rtdb.europe-west1.firebasedatabase.app/users.json', {
            method: 'POST',
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify({
                userId: userId,
                firstname,
                lastname,
                email,
                username
            })
        });

        const resData = response.json();

        dispatch({
            type: CREATE_USER, user: {
                userId: userId,
                firstname: firstname,
                lastname: lastname,
                email: email,
                username: username
            }
        });
    };
};