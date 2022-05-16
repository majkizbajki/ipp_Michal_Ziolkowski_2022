import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Button, TextInput, Alert } from "react-native";
import { Ionicons, Feather, MaterialIcons } from '@expo/vector-icons';

import * as shopListsActions from '../../store/actions/shoplist';
import UserBill from "../../components/userBill";

const EditShoppingListScreen = props => {

    const [isLoading, setIsLoading] = useState(false);
    const [isReloading, setIsReloading] = useState(false);
    const [intervalSwitch, setIntervalSwitch] = useState(false);
    const [error, setError] = useState();
    const dispatch = useDispatch();

    const allUsers = useSelector(state => state.users);
    const userId = useSelector(state => state.users.userId);

    const shoppingListNav = props.navigation.state.params.list;
    //
    const [listTitle, setListTitle] = useState(props.navigation.getParam("newListTitle", shoppingListNav.title));
    //
    const allLists = useSelector(state => state.shopLists);
    const shoppingList = allLists["shopList"].filter(list => list.members.indexOf(userId) >= 0).filter(list => list.title === shoppingListNav["title"]);

    const [membersList, setMembersList] = useState([]);
    const [billList, setBillList] = useState([]);

    const [editListName, setEditListName] = useState(false);
    const [newListName, setNewListName] = useState(props.navigation.getParam("newListTitle", shoppingList[0].title));

    useEffect(async () => {
        setIsLoading(true);
        await dispatch(shopListsActions.fetchLists()).then(() => {

            const membersArray = [];
            for (let key in shoppingList[0].members) {
                membersArray.push(shoppingList[0].members[key]);
            }
            setMembersList(membersArray);

            const userBills = [];
            for (let member of membersList) {
                var summary = 0;
                for (let product in shoppingList[0].products) {
                    if (shoppingList[0].products[product].buyer === member) {
                        summary += shoppingList[0].products[product].price;
                    }
                }
                userBills.push({ "userId": member, "summary": summary });
            }
            setBillList(userBills);

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
            {editListName ?
                <View>
                    <Text>Edytuj nazwę listy</Text>
                    {/*  */}
                    <TextInput defaultValue={shoppingList[0].title} onChangeText={text => setNewListName(text)} />
                    {/* shoppingList[0].title */}
                    <Button title="Potwierdź" onPress={() => {
                        if (allLists["shopList"].filter(list => list.title === newListName).length === 0) {
                            // zmiana nazwy listy
                        }
                        else {
                            if ((allLists["shopList"].filter(list => list.title === newListName).length === 1) && (allLists["shopList"].filter(list => list.title === shoppingListNav["title"])[0].title === newListName)) {
                                setEditListName(false);
                            }
                            else {
                                Alert.alert("Ups! Wystąpił błąd", "Wprowadzona nazwa już istnieje!", ["OK"]);
                            }
                        }
                    }} />
                    <Button title="Anuluj" onPress={() => {
                        setNewListName(shoppingList[0].title);
                        setEditListName(false);
                    }} />
                </View>
                :
                <View>
                    <View>
                        <Text>Podgląd szczegółów</Text>
                    </View>
                    <View>
                        <Text>Nazwa listy zakupów:</Text>
                        <Text>{newListName}</Text>
                        <TouchableOpacity onPress={() => {
                            setEditListName(true);
                        }}>
                            <Feather name="edit" size={40} />
                        </TouchableOpacity>
                    </View>
                    <View>
                        <Text>Rachunek</Text>
                        <MaterialIcons name="attach-money" size={40} />
                        <FlatList data={billList} keyExtractor={item => item.userId} renderItem={itemData => (
                            <View>
                                <Text>{allUsers.users.find(user => user.authId === itemData.item.userId).firstname} {allUsers.users.find(user => user.authId === itemData.item.userId).lastname} ({allUsers.users.find(user => user.authId === itemData.item.userId).username})</Text>
                                {itemData.item.summary > 0 ?
                                    <Text>{itemData.item.summary}</Text>
                                    :
                                    <Text>0.00</Text>
                                }
                            </View>
                        )} />
                    </View>
                    <View>
                        <Text>Zaległości</Text>
                        <Ionicons name="wallet-outline" size={40} />
                        <FlatList data={billList} keyExtractor={item => item.userId} renderItem={itemData => (
                            itemData.item.userId === userId ?
                                null
                            :
                                <UserBill userId={userId} billList={billList} person={itemData.item} allUsers={allUsers} shoppingList={shoppingList[0]} />
                        )} />
                    </View>
                    <View>
                        <Button title="Ukryj szczegóły" onPress={async () => {
                            props.navigation.navigate("ShopListDetails", { "list": shoppingListNav });
                        }} />
                    </View>
                    <View>
                        <View>
                            <Button title="Usuń" onPress={() => { }} />
                        </View>
                        <View>
                            <Button title="Udostępnij" onPress={async () => {
                                props.navigation.navigate("ShareShoppingList", { "list": shoppingListNav });
                            }} />
                        </View>
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
});

export default EditShoppingListScreen;