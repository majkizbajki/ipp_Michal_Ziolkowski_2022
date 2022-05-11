import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from "react-native";
import { Ionicons } from '@expo/vector-icons';

import * as shopListsActions from '../../store/actions/shoplist';

const EditShoppingListScreen = props => {

    const [isLoading, setIsLoading] = useState(false);
    const [isReloading, setIsReloading] = useState(false);
    const [intervalSwitch, setIntervalSwitch] = useState(false);
    const [error, setError] = useState();
    const dispatch = useDispatch();

    const userId = useSelector(state => state.users.userId);

    const shoppingListNav = props.navigation.state.params.list;
    const allLists = useSelector(state => state.shopLists);
    const shoppingList = allLists["shopList"].filter(list => list.members.indexOf(userId) >= 0).filter(list => list.title === shoppingListNav["title"]);

    const [membersList, setMembersList] = useState([]);

    useEffect(async () => {
        setIsLoading(true);
        await dispatch(shopListsActions.fetchLists()).then(() => {
            const membersArray = [];
            for (const key in shoppingList[0].members) {
                membersArray.push(shoppingList[0].members[key]);
            }
            setMembersList(membersArray);
            setIntervalSwitch(!intervalSwitch);
            setIsLoading(false);
        });
    }, [dispatch, isReloading]);

    useEffect(() => {
        const toggle = setInterval(() => {
            setIsReloading(!isReloading);
        }, 500);

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
                <Text>Edytuj listę zakupów</Text>
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

export default EditShoppingListScreen;