import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { View, Text, TouchableOpacity, Button, FlatList, StyleSheet, Alert, TextInput } from 'react-native';
import { RoundedCheckbox } from "react-native-rounded-checkbox";
import { Ionicons } from '@expo/vector-icons';

import * as shopListsActions from '../../store/actions/shoplist';
import AddProductPrice from "../../components/addProductPrice";

const ShoppingListDetailsScreen = props => {

    const [isLoading, setIsLoading] = useState(false);
    const [isReloading, setIsReloading] = useState(false);
    const [intervalSwitch, setIntervalSwitch] = useState(false);
    const [error, setError] = useState();
    const dispatch = useDispatch();

    const userId = useSelector(state => state.users.userId);

    const shoppingListNav = props.navigation.state.params.list;
    const allLists = useSelector(state => state.shopLists);
    const shoppingList = allLists["shopList"].filter(list => list.members.indexOf(userId) >= 0).filter(list => list.title === shoppingListNav["title"]);

    const [productsList, setProductsList] = useState([]);
    const [checkProduct, setCheckProduct] = useState(false);
    const [checkedProduct, setCheckedProduct] = useState();

    const [newListName, setNewListName] = useState(props.navigation.getParam("newListTitle", shoppingList[0].title));

    useEffect(async () => {
        setIsLoading(true);
        await dispatch(shopListsActions.fetchLists()).then(() => {
            let productsArray = [];
            if (shoppingList[0].products !== undefined) {
                for (const key in shoppingList[0].products) {
                    productsArray.push(shoppingList[0].products[key]);
                }
            }
            setProductsList(productsArray);
            setIntervalSwitch(!intervalSwitch);
            setIsLoading(false);
        });
    }, [dispatch, isReloading]);

    useEffect(() => {
        const toggle = setInterval(() => {
            setIsReloading(!isReloading);
        }, 100);

        return () => {
            clearInterval(toggle);
            setIntervalSwitch(!intervalSwitch);
        }
    }, [intervalSwitch]);

    useEffect(() => {
        if (checkedProduct !== undefined) {
            setCheckProduct(true);
        }
    }, [checkedProduct]);

    return (
        <View style={styles.screen}>
            {checkProduct ?
                <View>
                    <AddProductPrice product={checkedProduct} listCreator={shoppingListNav["creatorId"]} listTitle={shoppingListNav["title"]} returnPage={() => {
                        setCheckProduct(false);
                    }} />
                    <View>
                        <Button title="Anuluj" onPress={() => { setCheckProduct(false) }} />
                    </View>
                </View>
                :
                <View>
                    <View style={styles.topBar}>
                        <TouchableOpacity style={styles.button} onPress={() => {
                            props.navigation.navigate("ShopListMainWindow")
                        }}
                        >
                            <Ionicons size={60} name={'arrow-back-circle-outline'} color='black' />
                        </TouchableOpacity>
                    </View>
                    <View>
                        <Text>{shoppingListNav["title"]}</Text>
                    </View>
                    <View style={styles.productsList}>
                        <TouchableOpacity onPress={() => {
                            props.navigation.navigate("AddProduct", { "list": shoppingListNav });
                        }}>
                            <Ionicons size={50} name={'search'} color='black' />
                            <Text>Wyszukaj produkt</Text>
                        </TouchableOpacity>
                        <View>
                            {productsList.length > 0 ?
                                <FlatList data={productsList} keyExtractor={item => item.productId} renderItem={itemData => (
                                    <View>
                                        <TouchableOpacity onPress={() => {
                                            props.navigation.navigate("AddProduct", { "list": shoppingListNav, "product": itemData.item });
                                        }}>
                                            <View>
                                                <RoundedCheckbox
                                                    text={itemData.item.price === undefined ? "✓" :
                                                        itemData.item.buyer === userId ? "✓" : "X"}
                                                    isChecked={itemData.item.buyer === userId ? true :
                                                        itemData.item.price === undefined ? null : true}
                                                    checkedColor={itemData.item.buyer === userId ? "green" :
                                                        itemData.item.price === undefined ? null : "red"
                                                    }
                                                    active={itemData.item.buyer === userId ? true : false}
                                                    checkedTextColor="#000"
                                                    uncheckedTextColor="#000"
                                                    onPress={async () => {
                                                        if (itemData.item.price === undefined) {
                                                            setCheckedProduct(itemData.item);
                                                        }
                                                        else {
                                                            if (itemData.item.buyer === userId) {
                                                                await dispatch(shopListsActions.editProductPrice(shoppingListNav["title"], shoppingListNav["creatorId"], itemData.item, null, "remove")).then(() => { });
                                                                await dispatch(shopListsActions.fetchLists()).then(() => {
                                                                    props.navigation.navigate("ShopListDetails");
                                                                });
                                                            }
                                                        }
                                                    }} />
                                            </View>
                                            <Text>{itemData.item.name}</Text>
                                            <Text>{itemData.item.amount}</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => {
                                            setCheckedProduct(itemData.item);
                                        }}>
                                            <Text>{itemData.item.price}</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={async () => {
                                            setIsLoading(true);
                                            await dispatch(shopListsActions.deleteProduct(shoppingListNav["title"], itemData.item)).then(() => {
                                                dispatch(shopListsActions.fetchLists());
                                                setIsLoading(false);
                                            })
                                        }}>
                                            <Ionicons name="trash-bin-outline" size={40} />
                                        </TouchableOpacity>
                                    </View>
                                )} /> :
                                null
                            }
                        </View>
                    </View>
                    {shoppingList[0] ?
                        <View>
                            <Text>Podsumowanie:</Text>
                            <Text>{shoppingList[0].summary > 0 ? parseFloat(shoppingList[0].summary).toFixed(2) : "0.00"}</Text>
                        </View>
                        :
                        null
                    }
                    <View>
                        <Button title="Podgląd szczegółów" onPress={() => {
                            props.navigation.navigate("EditShoppingList", { "list": shoppingListNav });
                        }} />
                    </View>
                    <View>
                        <Button title="Usuń" onPress={() => {
                            Alert.alert("Usuwanie listy zakupów", "Czy na pewno usunąć tą listę?", [
                                {
                                    text: "Tak", onPress: async () => {
                                        await dispatch(shopListsActions.deleteList(shoppingListNav.title)).then(() => {
                                            dispatch(shopListsActions.fetchLists());
                                            props.navigation.navigate("ShopListMainWindow");
                                        });
                                    }
                                },
                                { text: "Nie" }
                            ])
                        }} />
                    </View>
                    <View>
                        <Button title="Udostępnij" onPress={() => {
                            props.navigation.navigate("ShareShoppingList", { "list": shoppingListNav });
                        }} />
                    </View>
                </View>
            }
        </View>
    )
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
    },
    topBar: {
        width: '100%',
        flexDirection: 'row',
        paddingVertical: 50,
        paddingHorizontal: 10,
    },
    productsList: {
        height: "50%",
        paddingBottom: 20
    }
});

export default ShoppingListDetailsScreen;