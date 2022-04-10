import User from "../../models/user";
import { CREATE_USER, UPDATE_USER, SET_USERS, UPDATE_USER_PASSWORD, SEND_INVITATION, ACCEPT_INVITATION, DECLINE_INVITATION, DELETE_FRIEND } from "../actions/user";

const initialState = {
    userId: null,
    dbname: null,
    users: []
};

export default (state = initialState, action) => {
    switch (action.type) {
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
                action.user.friends,
                action.user.newFriends,
                action.user.awaitingFriends
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
                action.user.friends,
                action.user.newFriends,
                action.user.awaitingFriends
            );
            const updatedUsers = [...state.users];
            for (key in updatedUsers) {
                if (updatedUsers[key].authId === action.user.authId) {
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
        case SEND_INVITATION:
            return {
                ...state,
                userId: state.userId,
                dbname: state.dbname,
                users: action.users
            }
        case ACCEPT_INVITATION:
            return {
                ...state,
                userId: state.userId,
                dbname: state.dbname,
                users: action.users
            }
        case DECLINE_INVITATION:
            return {
                ...state,
                userId: state.userId,
                dbname: state.dbname,
                users: action.users
            }
        case DELETE_FRIEND:
            return {
                ...state,
                userId: state.userId,
                dbname: state.dbname,
                users: action.users
            }
        default:
            return state;
    }
};