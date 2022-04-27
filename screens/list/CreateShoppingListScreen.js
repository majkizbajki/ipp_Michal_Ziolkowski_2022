import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, TextInput, Button, FlatList, StyleSheet, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Ionicons } from "@expo/vector-icons";

import * as shopListsActions from '../../store/actions/shoplist';
import * as userActions from '../../store/actions/user';

const ListDetailsScreen = props => {

    const [isLoading, setIsLoading] = useState();
    const [error, setError] = useState();
    const [shopListTitle, setShopListTitle] = useState("");
    const dispatch = useDispatch();

    const user = useSelector(state => state.users.userId);
    const allLists = useSelector(state => state.shopLists);
    const userList = allLists.shopList.filter(list => list.creatorId === user);

    useEffect(async () => {
        setIsLoading(true);
        await dispatch(userActions.fetchUsers()).then(() => {
            dispatch(shopListsActions.fetchLists());
            setIsLoading(false);
        });
    }, []);

    const addShopList = (async (title) => {
        setIsLoading(true);
        await dispatch(shopListsActions.createList(shopListTitle)).then(() => {
            setIsLoading(false);
        });
    });

    useEffect(() => {
        if (error) {
            Alert.alert('Wystąpił błąd!', error, [{ text: 'Ok' }]);
        }
    }, [error]);

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
                <Text>Nowa lista zakupów</Text>
            </View>
            <View>
                <Text>Tytuł</Text>
                <TextInput onChangeText={text => {
                    setShopListTitle(text)
                }} />
            </View>
            <View>
                <Text>Znajomi</Text>
                <FlatList />
            </View>
            <View>
                <Button title="Dodaj" onPress={() => {
                    if(userList.filter(list => list.title === shopListTitle).length === 0){
                        addShopList(shopListTitle);
                        props.navigation.navigate("ShopListMainWindow");
                    }
                    else{
                        Alert.alert("Ups!", "Podana nazwa listy już istnieje. Zmień ją aby kontynuować.");
                    }
                }} />
            </View>
        </View>
    )
};

const styles = StyleSheet.create({
    screen: {},

});

export default ListDetailsScreen;