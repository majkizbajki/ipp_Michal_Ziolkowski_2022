import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { Ionicons } from "@expo/vector-icons";

import * as shopListsActions from '../../store/actions/shoplist';
import * as userActions from '../../store/actions/user';

const ShoppingListsScreen = props => {

    const [isLoading, setIsLoading] = useState();
    const [isReloading, setIsReloading] = useState(false);
    const [error, setError] = useState();
    const [userLists, setUserLists] = useState({"shopList":[]})
    const dispatch = useDispatch();

    const allUsers = useSelector(state => state.users);
    const actuallUser = allUsers.users.find(user => user.authId === allUsers.userId);

    const allLists = useSelector(state => state.shopLists);

    useEffect( async () => {
        setIsLoading(true);
        await dispatch(userActions.fetchUsers()).then(() => {
            dispatch(shopListsActions.fetchLists());
            setIsLoading(false);
        })
    }, [dispatch]);

    useEffect(() => {
        const userListsObject = {"shopList": []};
        for (let i=0;i<allLists.shopList.length; i++){
            if(allLists.shopList[i].creatorId === actuallUser.authId || allLists.shopList[i].members.indexOf(actuallUser.authId) >= 0 ){
                userListsObject.shopList.push(allLists.shopList[i]);
            }
        }
        setUserLists(userListsObject);
    }, [isReloading]);

    useEffect(() => {
        const toggle = setInterval(() => {
            setIsReloading(!isReloading);
        }, 100);

        return () => clearInterval(toggle);
    });

    useEffect(() => {
        if (error) {
            Alert.alert('Wystąpił błąd!', error, [{ text: 'Ok' }]);
        }
    }, [error]);

    return (
        <View style={styles.screen}>
            <View style={styles.topBar}>
                <View style={styles.menuButton}>
                    <TouchableOpacity style={styles.button} onPress={() => {
                        props.navigation.navigate("Menu")
                    }}
                    >
                        <Ionicons size={60} name={'menu'} color='black' />
                    </TouchableOpacity>
                </View>
                <View style={styles.titleContainer}>
                    <Text style={{ fontSize: 22 }}>Listy zakupów</Text>
                </View>
            </View>
            <View style={styles.shopListsContainer}>
                <FlatList data={userLists.shopList} keyExtractor={item => item.title} renderItem={itemData => (
                    <View>
                        <TouchableOpacity onPress={() => {
                            props.navigation.navigate("ShopListDetails", {"list": itemData.item});
                        }}>
                            <Text>{itemData.item.title}</Text>
                        </TouchableOpacity>
                    </View>
                )} />
            </View>
            <View style={styles.addButtonContainer}>
                <TouchableOpacity style={styles.addButton} onPress={() => {
                    props.navigation.navigate("CreateShopList");
                }}>
                    <Text style={{ fontSize: 40, color: 'white' }}>+</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

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
    titleContainer: {
        width: '80%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    shopListsContainer: {
        width: '100%',
        height: '60%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    addButtonContainer: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 15,
    },
    addButton: {
        width: 70,
        height: 70,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 35,
        backgroundColor: 'green',
    },

});

export default ShoppingListsScreen;