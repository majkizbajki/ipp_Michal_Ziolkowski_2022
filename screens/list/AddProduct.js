import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Button, Alert, FlatList, ScrollView } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

import * as shopListsActions from '../../store/actions/shoplist';

const AddProduct = props => {

    const [isLoading, setIsLoading] = useState(false);
    const [isReloading, setIsReloading] = useState(false);
    const [intervalSwitch, setIntervalSwitch] = useState(false);
    const [error, setError] = useState();

    const [searchProduct, setSearchProduct] = useState("");
    const [searchProductList, isSearchProductList] = useState(false);
    const [amountType, setAmountType] = useState("");
    const [amount, setAmout] = useState("");
    const [category, setCategory] = useState("");
    const dispatch = useDispatch();

    const userId = useSelector(state => state.users.userId);

    const shoppingListNav = props.navigation.state.params.list;
    const allLists = useSelector(state => state.shopLists);
    const shoppingList = allLists["shopList"].filter(list => list.members.indexOf(userId) >= 0).filter(list => list.title === shoppingListNav["title"]);

    const [productsList, setProductsList] = useState([]);

    const productNav = props.navigation.state.params.product;

    useEffect(async () => {
        setIsLoading(true);
        await dispatch(shopListsActions.fetchLists()).then(() => {
            const productsArray = [];
            for (const key in shoppingList[0].products) {
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
        }, 100);

        return () => {
            clearInterval(toggle);
            setIntervalSwitch(!intervalSwitch);
        }
    }, [intervalSwitch]);

    if (productNav !== undefined) {
        useEffect(() => {
            if (productNav.amount.split(" ")[1] === "l") {
                setAmountType("l");
                setAmout(productNav.amount);
            }
            else if (productNav.amount.split(" ")[1] === "kg") {
                setAmountType("kg");
                setAmout(productNav.amount);
            }
            else if (productNav.amount.split(" ")[1] === "szt.") {
                setAmountType("szt.");
                setAmout(productNav.amount);
            }

            switch (productNav.category) {
                case "owoce":
                    setCategory("owoce");
                    break;
                case "warzywa":
                    setCategory("warzywa");
                    break;
                case "mięso":
                    setCategory("mięso");
                    break;
                case "ryby":
                    setCategory("ryby");
                    break;
                case "nabiał":
                    setCategory("nabiał");
                    break;
                case "słodycze":
                    setCategory("słodycze");
                    break;
                case "napoje":
                    setCategory("napoje");
                    break;
                case "fast food":
                    setCategory("fast food");
                    break;
                case "chemia":
                    setCategory("chemia");
                    break;
                case "alkohol":
                    setCategory("alkohol");
                    break;
                case "inne":
                    setCategory("inne");
                    break;
                default:
                    setCategory("");
            }
        }, []);
    }

    return (
        <View style={styles.screen}>
            <View style={styles.topBar}>
                <View style={styles.menuButton}>
                    <TouchableOpacity style={styles.button} onPress={() => {
                        props.navigation.navigate("ShopListDetails", { "list": shoppingListNav });
                    }}
                    >
                        <Ionicons size={60} name={'arrow-back-circle-outline'} color='black' />
                    </TouchableOpacity>
                </View>
                <View style={styles.titleContainer}>
                    <Text style={{ fontSize: 22 }}>{productNav === undefined ? "Dodaj produkt do listy" : "Edytuj produkt z listy"}</Text>
                </View>
            </View>
            <View style={styles.searchProduct}>
                {productNav === undefined ? (
                    <TextInput style={styles.input} placeholder="Wyszukaj produkt lub wpisz jego nazwę" onChangeText={text => {
                        setSearchProduct(text);
                        if (text.length == 0) {
                            isSearchProductList(false);
                        } else {
                            isSearchProductList(true);
                        }
                    }} />
                ) : (
                    <Text>{productNav.name}</Text>
                )}
            </View>
            <View>
                <Text>Ilość</Text>
                <View>
                    <Button title="kilogramy" color={amountType == "kg" ? "red" : ""} onPress={() => {
                        setAmountType("kg");
                        setAmout(amount + " " + amountType);
                    }} />
                </View>
                <View>
                    <Button title="litry" color={amountType == "l" ? "red" : ""} onPress={() => {
                        setAmountType("l")
                        setAmout(amount + " " + amountType);
                    }} />
                </View>
                <View>
                    <Button title="sztuki" color={amountType == "szt." ? "red" : ""} onPress={() => {
                        setAmountType("szt.")
                        setAmout(amount + " " + amountType);
                    }} />
                </View>
                <View>
                    <TextInput defaultValue={productNav === undefined ? null : productNav.amount.split(" ")[0]} placeholder={amountType == "" ? "Wybierz jednostkę miary" : "Wpisz ilość"} keyboardType="decimal-pad" onChangeText={(text) => {
                        let re = /\d+\.{0,1}\d{0,2}/;
                        let number = text.replace(/[, -]/g, ".")
                        if (number.match(re) !== null) {
                            setAmout(number.match(re)[0] + " " + amountType);
                        }
                    }} />
                </View>
            </View>
            <View>
                <Text>Kategoria</Text>
                <ScrollView style={styles.category}>
                    <View>
                        <Button title="owoce" color={category == "owoce" ? "red" : ""} onPress={() => {
                            setCategory("owoce");
                        }} />
                    </View>
                    <View>
                        <Button title="warzywa" color={category == "warzywa" ? "red" : ""} onPress={() => {
                            setCategory("warzywa");
                        }} />
                    </View>
                    <View>
                        <Button title="mięso" color={category == "mięso" ? "red" : ""} onPress={() => {
                            setCategory("mięso");
                        }} />
                    </View>
                    <View>
                        <Button title="ryby" color={category == "ryby" ? "red" : ""} onPress={() => {
                            setCategory("ryby");
                        }} />
                    </View>
                    <View>
                        <Button title="nabiał" color={category == "nabiał" ? "red" : ""} onPress={() => {
                            setCategory("nabiał");
                        }} />
                    </View>
                    <View>
                        <Button title="słodycze" color={category == "słodycze" ? "red" : ""} onPress={() => {
                            setCategory("słodycze");
                        }} />
                    </View>
                    <View>
                        <Button title="napoje" color={category == "napoje" ? "red" : ""} onPress={() => {
                            setCategory("napoje");
                        }} />
                    </View>
                    <View>
                        <Button title="fast food" color={category == "fast food" ? "red" : ""} onPress={() => {
                            setCategory("fast food");
                        }} />
                    </View>
                    <View>
                        <Button title="chemia" color={category == "chemia" ? "red" : ""} onPress={() => {
                            setCategory("chemia");
                        }} />
                    </View>
                    <View>
                        <Button title="alkohol" color={category == "alkohol" ? "red" : ""} onPress={() => {
                            setCategory("alkohol");
                        }} />
                    </View>
                    <View>
                        <Button title="inne" color={category == "inne" ? "red" : ""} onPress={() => {
                            setCategory("inne");
                        }} />
                    </View>
                </ScrollView>
            </View>
            <View>
                {productNav === undefined ?
                    (<Button title="Dodaj" onPress={async () => {
                        if (searchProduct !== "" && amount !== "" && category !== "") {
                            if (productsList.filter(list => list.productId === searchProduct.toLowerCase()).length === 0 || productsList.filter(list => list.name.toLowerCase() === searchProduct.toLowerCase()).length === 0) {
                                await dispatch(shopListsActions.addProduct(shoppingListNav.title, searchProduct.toLowerCase(), searchProduct, amount, category)).then(() => {
                                    dispatch(shopListsActions.fetchLists());
                                    props.navigation.navigate("ShopListDetails", { "list": shoppingListNav });
                                });
                            }
                            else {
                                Alert.alert("Ups! Wystąpił błąd!", "Produkt o tej nazwie jest już na liście.", [{ text: "OK", onPress: () => { props.navigation.navigate("ShopListDetails", { "list": shoppingListNav }); } }]);
                            }
                        }
                        else {
                            Alert.alert("Ups! Wystąpił błąd!", "Niepoprawnie wprowadzone dane produktu.", [{ text: "OK" }]);
                        }
                    }} />) :
                    (<Button title="Edytuj" onPress={async () => {
                        let re = /\d+\.{0,1}\d{0,2}/;
                        let number = amount.replace(/[, -]/g, ".")
                        if (amount !== "" && category !== "" && number.match(re) !== null) {
                            setAmout(number.match(re)[0] + " " + amountType);
                            await dispatch(shopListsActions.updateProduct(shoppingListNav.title, productNav, amount, category)).then(() => {
                                dispatch(shopListsActions.fetchLists());
                                props.navigation.navigate("ShopListDetails", { "list": shoppingListNav });
                            });
                        }
                        else {
                            Alert.alert("Ups! Wystąpił błąd!", "Niepoprawnie wprowadzone dane produktu.", [{ text: "OK" }]);
                        }
                    }} />)
                }
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
    menuButton: {
        width: '20%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    button: {
        justifyContent: 'center',
        alignItems: 'center'

    },
    titleContainer: {
        width: '80%',
        alignItems: 'center',
        justifyContent: 'center',
    },


    category: {
        height: "35%",
        marginVertical: 15,
    },
});

export default AddProduct;