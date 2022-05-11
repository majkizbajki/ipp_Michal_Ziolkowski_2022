import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, TextInput, Button, FlatList, StyleSheet, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Ionicons, AntDesign } from "@expo/vector-icons";

import * as shopListsActions from '../../store/actions/shoplist';
import * as userActions from '../../store/actions/user';

const ListDetailsScreen = props => {

    const [isLoading, setIsLoading] = useState(false);
    const [isReloading, setIsReloading] = useState(false);
    const [error, setError] = useState();
    const [shopListTitle, setShopListTitle] = useState("");
    const dispatch = useDispatch();

    const allUsers = useSelector(state => state.users);
    const user = allUsers.users.find(user => user.authId === allUsers.userId);

    const allLists = useSelector(state => state.shopLists);
    const userList = allLists.shopList.filter(list => list.members.indexOf(user.authId) >= 0);

    const [friendsList, setFriendsList] = useState([]);
    const [membersList, setMembersList] = useState([user.authId]);


    useEffect(async () => {
        setIsLoading(true);
        await dispatch(userActions.fetchUsers()).then(() => {
            dispatch(shopListsActions.fetchLists());
            let friendsArray = [];
            for (const key in allUsers.users) {
                if (user.friends.indexOf(allUsers.users[key].authId) >= 0) {
                    friendsArray.push(allUsers.users[key]);
                }
            }
            setFriendsList(friendsArray);
            setIsLoading(false);
        });
    }, [isReloading]);

    const addShopList = (async (title, members) => {
        setIsLoading(true);
        await dispatch(shopListsActions.createList(title, members)).then(() => {
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
                <FlatList data={friendsList} keyExtractor={item => item.authId} renderItem={itemData => (
                    <View>
                        <Text>{itemData.item.firstname} {itemData.item.lastname} ({itemData.item.username})</Text>
                        {membersList.indexOf(itemData.item.authId) >= 0 ?
                            <TouchableOpacity onPress={async () => {
                                setIsReloading(true);
                                await setMembersList(membersList.filter(item => item !== itemData.item.authId));
                                setIsReloading(false);
                            }}>
                                <AntDesign name="deleteusergroup" size={40} />
                            </TouchableOpacity>
                        :
                            <TouchableOpacity onPress={async () => {
                                setIsReloading(true);
                                let membersArray = membersList;
                                membersArray.push(itemData.item.authId);
                                await setMembersList(membersArray);
                                setIsReloading(false);
                            }}>
                                <AntDesign name="addusergroup" size={40} />
                            </TouchableOpacity>
                        }
                    </View>
                )} />
            </View>
            <View>
                <Button title="Dodaj" onPress={() => {
                    if (userList.filter(list => list.title === shopListTitle).length === 0 && shopListTitle.length !== 0) {
                        addShopList(shopListTitle, membersList);
                        props.navigation.navigate("ShopListMainWindow");
                    }
                    else if (shopListTitle.length === 0) {
                        Alert.alert("Ups!", "Wprowadź nazwę listy zakupów.");
                    }
                    else {
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