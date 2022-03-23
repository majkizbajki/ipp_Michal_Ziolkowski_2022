import { CREATE_USER} from "../actions/user";

const initialState = {
    user: null
};

export default ( state = initialState, action ) => {
    switch (action.type){
        case CREATE_USER:
            return {};
        default:
            return state;
    }
};