import shopList from "../../models/shopList";
import product from "../../models/product";

export const CREATE_LIST = "CREATE_LIST";
export const SET_LISTS = "SET_LISTS";
export const EDIT_LIST = "EDIT_LIST";
export const DELETE_LIST = "DELETE_LIST";
export const ADD_PRODUCT = "ADD_PRODUCT";
export const EDIT_PRODUCT = "EDIT_PRODUCT";
export const DELETE_PRODUCT = "DELETE_PRODUCT";
export const ADD_OR_DELETE_MEMBER = "ADD_OR_DELETE_MEMBER";
export const EDIT_PRODUCT_PRICE = "EDIT_PRODUCT_PRICE";

export const fetchLists = () => {
    return async (dispatch) => {
        try {
            const responseLists = await fetch('https://shopwithme-2d872-default-rtdb.europe-west1.firebasedatabase.app/shoplists.json');

            if (!responseLists.ok) {
                throw new Error("Coś poszło nie tak!");
            }

            const resListsData = await responseLists.json();
            const allLists = [];

            for (const key in resListsData) {
                allLists.push(new shopList(resListsData[key].title, resListsData[key].creatorId, resListsData[key].members, resListsData[key].products, resListsData[key].summary));
            }

            dispatch({ type: SET_LISTS, lists: allLists });
        }
        catch (err) {
            throw err;
        }
    };
};
export const createList = (title, members = []) => {
    return async (dispatch, getState) => {
        const products = [];
        const summary = 0;
        const userId = getState().auth.userId;
        const response = await fetch('https://shopwithme-2d872-default-rtdb.europe-west1.firebasedatabase.app/shoplists.json', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: title,
                creatorId: userId,
                members: members,
                products: products,
                summary: summary
            })
        });

        if (!response.ok) {
            throw new Error("Coś poszło nie tak!");
        }

        dispatch({
            type: CREATE_LIST, shopList: {
                title: title,
                creatorId: userId,
                members: members,
                products: products,
                summary: summary
            }
        });
    };
};

export const updateList = (listTitle, newListTitle) => {
    return async (dispatch, getState) => {
        const userId = getState().auth.userId;
        try {
            const responseLists = await fetch('https://shopwithme-2d872-default-rtdb.europe-west1.firebasedatabase.app/shoplists.json');

            if (!responseLists.ok) {
                throw new Error("Coś poszło nie tak!");
            }

            const resListsData = await responseLists.json();
            
            var listId;
            for (let key in resListsData) {
                if (resListsData[key].title === listTitle && resListsData[key].creatorId === userId) {
                    listId = key;
                }
            }


            const responseUpdate = await fetch(`https://shopwithme-2d872-default-rtdb.europe-west1.firebasedatabase.app/shoplists/${listId}.json`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title: newListTitle
                })
            });

            if (!responseUpdate.ok) {
                throw new Error("Coś poszło nie tak!");
            }

            const responseUpdateLists = await fetch('https://shopwithme-2d872-default-rtdb.europe-west1.firebasedatabase.app/shoplists.json')
            const resListsUpdate = await responseUpdateLists.json();
            const allLists = [];

            for (const key in resListsUpdate) {
                allLists.push(new shopList(resListsUpdate[key].title, resListsUpdate[key].creatorId, resListsUpdate[key].members, resListsUpdate[key].products, resListsUpdate[key].summary));
            }

            dispatch({ type: EDIT_LIST, lists: allLists });

        }
        catch (err) {
            throw err;
        }
    };
}

export const deleteList = (listTitle) => {
    return async (dispatch, getState) => {
        const userId = getState().auth.userId;
        try {
            const responseLists = await fetch('https://shopwithme-2d872-default-rtdb.europe-west1.firebasedatabase.app/shoplists.json');

            if (!responseLists.ok) {
                throw new Error("Coś poszło nie tak!");
            }

            const resListsData = await responseLists.json();
            
            var listId;
            for (const key in resListsData) {
                if (resListsData[key].title === listTitle && resListsData[key].creatorId === userId) {
                    listId = key;
                }
            }

            const responseDelete = await fetch(`https://shopwithme-2d872-default-rtdb.europe-west1.firebasedatabase.app/shoplists/${listId}.json`, {
                method: 'DELETE'
            });

            if (!responseDelete.ok) {
                throw new Error("Coś poszło nie tak!");
            }



        }
        catch (err) {
            throw err;
        }

        dispatch({ type: DELETE_LIST });
    };
};

export const addProduct = (listTitle, productId, productName, amount, category) => {
    return async (dispatch, getState) => {
        const userId = getState().auth.userId;
        try {
            const responseLists = await fetch('https://shopwithme-2d872-default-rtdb.europe-west1.firebasedatabase.app/shoplists.json');

            if (!responseLists.ok) {
                throw new Error("Coś poszło nie tak!");
            }

            const resListsData = await responseLists.json();
            
            var listId;
            for (let key in resListsData) {
                if (resListsData[key].title === listTitle && resListsData[key].creatorId === userId) {
                    listId = key;
                }
            }

            const responseAdd = await fetch(`https://shopwithme-2d872-default-rtdb.europe-west1.firebasedatabase.app/shoplists/${listId}/products.json`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    productId: productId,
                    name: productName,
                    price: null,
                    amount: amount,
                    category: category,
                    buyer: null
                })
            });

            if (!responseAdd.ok) {
                throw new Error("Coś poszło nie tak!");
            }

        }
        catch (err) {
            throw err;
        }

        dispatch({ type: ADD_PRODUCT });
    };
}

export const updateProduct = (listTitle, product, amount, category) => {
    return async (dispatch, getState) => {
        const userId = getState().auth.userId;
        try {
            const responseLists = await fetch('https://shopwithme-2d872-default-rtdb.europe-west1.firebasedatabase.app/shoplists.json');

            if (!responseLists.ok) {
                throw new Error("Coś poszło nie tak!");
            }

            const resListsData = await responseLists.json();
            
            var listId;
            for (let key in resListsData) {
                if (resListsData[key].title === listTitle && resListsData[key].creatorId === userId) {
                    listId = key;
                }
            }

            var productId;
            for (let productKey in resListsData[listId].products){
                if (resListsData[listId].products[productKey].productId === product.productId){
                    productId = productKey;
                }
            }


            const responseUpdate = await fetch(`https://shopwithme-2d872-default-rtdb.europe-west1.firebasedatabase.app/shoplists/${listId}/products/${productId}.json`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    amount: amount,
                    category: category
                })
            });

            if (!responseUpdate.ok) {
                throw new Error("Coś poszło nie tak!");
            }



        }
        catch (err) {
            throw err;
        }

        dispatch({ type: EDIT_PRODUCT });
    };
}

export const deleteProduct = (listTitle, product) => {
    return async (dispatch, getState) => {
        const userId = getState().auth.userId;
        try {
            const responseLists = await fetch('https://shopwithme-2d872-default-rtdb.europe-west1.firebasedatabase.app/shoplists.json');

            if (!responseLists.ok) {
                throw new Error("Coś poszło nie tak!");
            }

            const resListsData = await responseLists.json();
            
            var listId;
            for (let key in resListsData) {
                if (resListsData[key].title === listTitle && resListsData[key].creatorId === userId) {
                    listId = key;
                }
            }
            
            var prodId;
            for (let prod in resListsData[listId].products) {
                if (resListsData[listId].products[prod].productId === product.productId) {
                    prodId = prod;
                }
            }

            const responseDelete = await fetch(`https://shopwithme-2d872-default-rtdb.europe-west1.firebasedatabase.app/shoplists/${listId}/products/${prodId}.json`, {
                method: 'DELETE'
            });

            if (!responseDelete.ok) {
                throw new Error("Coś poszło nie tak!");
            }

        }
        catch (err) {
            throw err;
        }

        dispatch({ type: DELETE_PRODUCT });
    };
}

export const addOrDeleteMember = (listTitle, membersList) => {
    return async (dispatch, getState) => {
        const userId = getState().auth.userId;
        try {
            const responseLists = await fetch('https://shopwithme-2d872-default-rtdb.europe-west1.firebasedatabase.app/shoplists.json');

            if (!responseLists.ok) {
                throw new Error("Coś poszło nie tak!");
            }

            const resListsData = await responseLists.json();
            
            var listId;
            for (let key in resListsData) {
                if (resListsData[key].title === listTitle && resListsData[key].creatorId === userId) {
                    listId = key;
                }
            }

            const responseAddMember = await fetch(`https://shopwithme-2d872-default-rtdb.europe-west1.firebasedatabase.app/shoplists/${listId}.json`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    members: membersList
                })
            });

            if (!responseAddMember.ok) {
                throw new Error("Coś poszło nie tak!");
            }

        }
        catch (err) {
            throw err;
        }

        dispatch({ type: ADD_OR_DELETE_MEMBER });
    };
}

export const editProductPrice = (listTitle, listCreator, product, productPrice, buy) => {
    return async (dispatch, getState) => {
        const userId = getState().auth.userId;
        try {
            const responseLists = await fetch('https://shopwithme-2d872-default-rtdb.europe-west1.firebasedatabase.app/shoplists.json');

            if (!responseLists.ok) {
                throw new Error("Coś poszło nie tak!");
            }

            const resListsData = await responseLists.json();
            
            var listId;
            for (let key in resListsData) {
                if (resListsData[key].title === listTitle && resListsData[key].creatorId === listCreator) {
                    listId = key;
                }
            }
            
            var prodId;
            for (let prod in resListsData[listId].products) {
                if (resListsData[listId].products[prod].productId === product.productId) {
                    prodId = prod;
                }
            }

            const responseList = await fetch(`https://shopwithme-2d872-default-rtdb.europe-west1.firebasedatabase.app/shoplists/${listId}.json`);
            if (!responseList.ok) {
                throw new Error("Coś poszło nie tak!");
            }

            const resList = await responseList.json();

            var setPrice;
            var setBuyer;
            var setSummary = parseFloat(resList.summary);

            if(buy === "add"){
                setPrice = parseFloat(productPrice);
                setBuyer = userId;
                setSummary = parseFloat(setSummary) + parseFloat(productPrice);
            }
            else if (buy === "edit"){
                setPrice = parseFloat(productPrice);
                setBuyer = userId;
                setSummary = parseFloat(setSummary) + (parseFloat(productPrice) - parseFloat(product.price));
            }
            else if (buy === "remove"){
                setPrice = null;
                setBuyer = null;
                setSummary = parseFloat(setSummary) - parseFloat(product.price);
            }

            const responseEditPrice = await fetch(`https://shopwithme-2d872-default-rtdb.europe-west1.firebasedatabase.app/shoplists/${listId}/products/${prodId}.json`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    price: setPrice,
                    buyer: setBuyer
                })
            });

            if (!responseEditPrice.ok) {
                throw new Error("Coś poszło nie tak!");
            }

            const responseEditSummary = await fetch(`https://shopwithme-2d872-default-rtdb.europe-west1.firebasedatabase.app/shoplists/${listId}.json`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    summary: setSummary
                })
            });

            if (!responseEditSummary.ok) {
                throw new Error("Coś poszło nie tak!");
            }
        }
        catch (err) {
            throw err;
        }

        dispatch({ type: EDIT_PRODUCT_PRICE });
    };
}