import User from "../../models/user";
import { CREATE_USER, UPDATE_USER, SET_USERS } from "../actions/user";

const initialState = {
    users: []
};

export default ( state = initialState, action ) => {
    switch (action.type){
        case SET_USERS:
            const allUsers = action.users;
            return {
                ...state,
                users: allUsers
            }
        case CREATE_USER:
            const newUser = new User(
                action.user.authId,
                action.user.firstname,
                action.user.lastname,
                action.user.email,
                action.user.username,
                []
            );
            return {
                ...state,
                users: state.users.concat(newUser)
            };
        case UPDATE_USER:
            const userIdentifier = state.users.findIndex(user => user.authId === action.authId);
            const updatedUser = new User(
                state.users[userIdentifier].authId,
                action.user.firstname,
                action.user.lastname,
                action.user.email,
                state.users[userIdentifier].username,
                state.users[userIdentifier].friends
            );
            const updatedUsers = [...state.users];
            updatedUsers[userIdentifier] = updatedUser;
            return {
                ...state,
                users: updatedUsers
            };
        default:
            return state;
    }
};