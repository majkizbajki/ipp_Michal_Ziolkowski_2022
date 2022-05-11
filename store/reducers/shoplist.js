import shopList from "../../models/shopList";
import { CREATE_LIST, SET_LISTS, DELETE_LIST, ADD_PRODUCT, DELETE_PRODUCT, EDIT_PRODUCT, ADD_OR_DELETE_MEMBER, EDIT_PRODUCT_PRICE } from "../actions/shoplist";

const initialState = {
    shopList: []
};

export default (state = initialState, action) => {
    switch (action.type) {
        case CREATE_LIST:
            const newList = new shopList(action.shopList.title, action.shopList.creatorId, action.shopList.members, action.shopList.products, action.shopList.summary);
            return {
                ...state,
                shopList: state.shopList.concat(newList),
            };
        case SET_LISTS:
            return {
                ...state,
                shopList: action.lists,
            };
        case DELETE_LIST:
            return {
                ...state,
                shopList: state.shopList,
            };
        case ADD_PRODUCT:
            return {
                ...state,
                shopList: state.shopList,
            };
        case DELETE_PRODUCT:
            return {
                ...state,
                shopList: state.shopList,
            };
        case EDIT_PRODUCT:
            return {
                ...state,
                shopList: state.shopList,
            };
        case ADD_OR_DELETE_MEMBER:
            return {
                ...state,
                shopList: state.shopList,
            };
        case EDIT_PRODUCT_PRICE:
            return {
                ...state,
                shopList: state.shopList,
            };
        default:
            return state;
    }
};