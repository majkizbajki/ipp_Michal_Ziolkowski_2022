export const SIGNUP = 'SIGNUP';
export const LOGIN = 'LOGIN';

export const signUp = (email, password) => {
    return async dispatch => {
        const response = await fetch(
            "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCWHo2xsoWaeuLP841VNVSgfkuRZzG8oVE",
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                    returnSecureToken: true
                })
            }
        );

        if(!response.ok){
            const errorResData = await response.json();
            const errorId = errorResData.error.message;
            let message = 'Ups! Coś poszło nie tak!'
            if(errorId === 'EMAIL_EXISTS') {
                message = 'Podana nazwa użytkownika jest już zajęta!';
            }
            throw new Error(message);
        }

        const resData = await response.json();

        dispatch({ type: SIGNUP, token: resData.idToken, userId: resData.localId });
    };
};

export const login = (email, password) => {
    return async dispatch => {
        const response = await fetch(
            "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyCWHo2xsoWaeuLP841VNVSgfkuRZzG8oVE",
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                    returnSecureToken: true
                })
            }
        );

        if(!response.ok){
            const errorResData = await response.json();
            const errorId = errorResData.error.message;
            let message = 'Ups! Coś poszło nie tak!'
            if(errorId === 'EMAIL_NOT_FOUND') {
                message = 'Podana nazwa użytkownika nie istnieje!';
            } else if(errorId === 'INVALID_PASSWORD') {
                message = 'Podane hasło jest nieprawidłowe!';
            }
            throw new Error(message);
        }

        const resData = await response.json();

        dispatch({ type: LOGIN, token: resData.idToken, userId: resData.localId });
    };
};