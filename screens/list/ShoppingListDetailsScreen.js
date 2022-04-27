import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { View, Text, TouchableOpacity, Button, FlatList, StyleSheet, Alert } from 'react-native';
import { RoundedCheckbox } from "react-native-rounded-checkbox";
import { Ionicons } from '@expo/vector-icons';

import * as shopListsActions from '../../store/actions/shoplist';

const ShoppingListDetailsScreen = props => {

    const [isLoading, setIsLoading] = useState(false);
    const [isReloading, setIsReloading] = useState(false);
    const [intervalSwitch, setIntervalSwitch] = useState(false);
    const [error, setError] = useState();
    const dispatch = useDispatch();

    const userId = useSelector(state => state.users.userId);

    const shoppingListNav = props.navigation.state.params.list;
    const allLists = useSelector(state => state.shopLists);
    const shoppingList = allLists["shopList"].filter(list => list.creatorId === userId).filter(list => list.name === shoppingListNav["name"]);

    const [productsList, setProductsList] = useState([]);

    useEffect(async () => {
        setIsLoading(true);
        await dispatch(shopListsActions.fetchLists()).then(() => {
            const productsArray = [];
            for (const key in shoppingList[0].products){
                productsArray.push(shoppingList[0].products[key]);
            }
            setProductsList(productsArray);
            setIntervalSwitch(!intervalSwitch);
            setIsLoading(false);
        });
    }, [dispatch, isReloading]);

    useEffect(() => {
        const toggle = setInterval(() => {
            setIsReloading(!isReloading);
        }, 1000);

        return () => {
            clearInterval(toggle);
            setIntervalSwitch(!intervalSwitch);
        }
    }, [intervalSwitch]);

    return (
        <View style={styles.screen}>
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
            <View>
                <TouchableOpacity onPress={() => {
                    props.navigation.navigate("AddProduct", { "list": shoppingListNav });
                }}>
                    <Ionicons size={50} name={'search'} color='black' />
                    <Text>Wyszukaj produkt</Text>
                </TouchableOpacity>
                <View>
                    <FlatList data={productsList} keyExtractor={item => item.productId} renderItem={itemData => (
                        <View>
                            <TouchableOpacity onPress={() => { }}>
                                <View>
                                    <RoundedCheckbox text="✓" checkedColor="green" checkedTextColor="#000" uncheckedTextColor="#000" onPress={() => {}} />
                                </View>
                                <Text>{itemData.item.name}</Text>
                                <Text>{itemData.item.amount}</Text>
                                <Text>{itemData.item.price}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={ async () => {
                                setIsLoading(true);
                                await dispatch(shopListsActions.deleteProduct(shoppingListNav["title"],itemData.item)).then(() => {
                                    dispatch(shopListsActions.fetchLists());
                                    setIsLoading(false);
                                })
                            }}>
                                <Ionicons name="trash-bin-outline" size={40} />
                            </TouchableOpacity>
                        </View>
                    )} />
                </View>
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
});

export default ShoppingListDetailsScreen;