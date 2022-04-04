import User from "../../models/user";
import { CREATE_USER, UPDATE_USER, SET_USERS, UPDATE_USER_PASSWORD } from "../actions/user";

const initialState = {
    userId: null,
    dbname: null,
    users: []
};

export default ( state = initialState, action ) => {
    switch (action.type){
        case SET_USERS:
            const allUsers = action.users;
            return {
                ...state,
                userId: action.logId,
                dbname: action.dbname,
                users: allUsers,
            }
        case CREATE_USER:
            const newUser = new User(
                action.user.authId,
                action.user.firstname,
                action.user.lastname,
                action.user.email,
                action.user.username,
                action.user.friends
            );
            return {
                ...state,
                userId: action.logId,
                dbname: action.dbname,
                users: state.users.concat(newUser)
            };
        case UPDATE_USER:
            // const userIdentifier = state.users.findIndex(user => user.authId === action.logId);
            const updatedUser = new User(
                action.user.authId,
                action.user.firstname,
                action.user.lastname,
                action.user.email,
                action.user.username,
                action.user.friends
            );
            const updatedUsers = [...state.users];
            for (key in updatedUsers){
                if(updatedUsers[key].authId === action.user.authId){
                    updatedUsers[key] = updatedUser;
                }
            }
            return {
                ...state,
                userId: action.logId,
                dbname: action.dbname,
                users: updatedUsers
            };
        case UPDATE_USER_PASSWORD:
            return {
                ...state,
            }
        default:
            return state;
    }
};