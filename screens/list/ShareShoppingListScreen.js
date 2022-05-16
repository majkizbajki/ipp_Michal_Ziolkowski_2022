import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Alert } from "react-native";
import { Ionicons, AntDesign } from '@expo/vector-icons';

import * as userActions from '../../store/actions/user';
import * as shopListsActions from '../../store/actions/shoplist';

const ShareShoppingListScreen = props => {

    const [isLoading, setIsLoading] = useState(false);
    const [isReloading, setIsReloading] = useState(false);
    const [intervalSwitch, setIntervalSwitch] = useState(false);
    const [error, setError] = useState();
    const dispatch = useDispatch();

    const allUsers = useSelector(state => state.users);
    const user = allUsers.users.find(user => user.authId === allUsers.userId);

    const shoppingListNav = props.navigation.state.params.list;
    const allLists = useSelector(state => state.shopLists);
    const shoppingList = allLists["shopList"].filter(list => list.members.indexOf(user.authId) >= 0).filter(list => list.title === shoppingListNav["title"]);

    const [friendsList, setFriendsList] = useState([]);

    useEffect(async () => {
        setIsLoading(true);
        await dispatch(shopListsActions.fetchLists()).then(() => { });
        await dispatch(userActions.fetchUsers()).then(() => {
            let friendsArray = [user];
            for (const key in allUsers.users) {
                if (user.friends.indexOf(allUsers.users[key].authId) >= 0) {
                    friendsArray.push(allUsers.users[key]);
                }
            }
            setFriendsList(friendsArray);
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

    return (
        <View style={styles.screen}>
            <View style={styles.topBar}>
                <TouchableOpacity style={styles.button} onPress={() => {
                    props.navigation.navigate("ShopListDetails", { "list": shoppingListNav });
                }}
                >
                    <Ionicons size={60} name={'arrow-back-circle-outline'} color='black' />
                </TouchableOpacity>
            </View>
            <View>
                <Text>Dodaj lub usuń znajomego</Text>
            </View>
            <View>
                <FlatList data={friendsList} keyExtractor={item => item.authId} renderItem={itemData => (
                    <View>
                        <Text>{itemData.item.firstname} {itemData.item.lastname} ({itemData.item.username})</Text>
                        {user.authId === shoppingList[0].creatorId ?
                            shoppingList[0].members.indexOf(itemData.item.authId) >= 0 ?
                                <TouchableOpacity onPress={() => {
                                    Alert.alert("Usuń z listy zakupów", `Czy na pewno usunąć ${itemData.item.username} z tej listy zakupów`, [{
                                        text: "Tak", onPress: async () => {
                                            let membersArray = shoppingList[0].members;
                                            membersArray.splice(membersArray.indexOf(itemData.item.authId), 1);
                                            await dispatch(shopListsActions.addOrDeleteMember(shoppingListNav.title, membersArray)).then(() => {
                                                dispatch(shopListsActions.fetchLists());
                                            });
                                        }
                                    }, { text: "Nie" }])
                                }}>
                                    <AntDesign name="deleteusergroup" size={40} />
                                </TouchableOpacity>
                                :
                                <TouchableOpacity onPress={async () => {
                                    let membersArray = shoppingList[0].members;
                                    membersArray.push(itemData.item.authId);
                                    await dispatch(shopListsActions.addOrDeleteMember(shoppingListNav.title, membersArray)).then(() => {
                                        dispatch(shopListsActions.fetchLists());
                                    });
                                }}>
                                    <AntDesign name="addusergroup" size={40} />
                                </TouchableOpacity>
                            :
                            <View>

                            </View>
                        }
                    </View>
                )} />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({

});

export default ShareShoppingListScreen;