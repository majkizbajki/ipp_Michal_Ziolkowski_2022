import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, FlatList } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

import * as userActions from '../../store/actions/user';

const FriendsScreen = props => {
    
    const [isLoading, setIsLoading] = useState(false);
    const [isReloading, setIsReloading] = useState(false);
    const [intervalSwitch, setIntervalSwitch] = useState(false);
    const [error, setError] = useState();
    const dispatch = useDispatch();

    const [friendsList, isFriendsList] = useState(true);                // current friends

    const [showInvitation, setShowInvitation] = useState(false);        // show search view with users

    const [searchFriend, setSearchFriend] = useState("");               // search string
    const [searchFriendsList, setSearchFriendsList] = useState([]);     // array with regex users
    const [alreadyInvitedFriends, setAlreadyInvitedFriends] = useState([]);     // already invited users

    const [invitationFriends, setInvitationFriends] = useState([]);     // awaiting invitations

    const allUsers = useSelector(state => state.users);
    const actuallUser = allUsers.users.find(user => user.authId === allUsers.userId);

    useEffect(async () => {
        setIsLoading(true);
        await dispatch(userActions.fetchUsers()).then(() => {
            setInvitationFriends(actuallUser.newFriends);
            setAlreadyInvitedFriends(actuallUser.awaitingFriends);
            setIntervalSwitch(!intervalSwitch);
            setIsLoading(false);
        });
    }, [dispatch, isReloading]);

    var regex = new RegExp(searchFriend, "i");
    const updateSearching = () => {
        setSearchFriendsList([]);
        let newFriendsArray = [];
        for (var user of allUsers.users) {
            if (regex.test(user.username) && user.username != actuallUser.username && !actuallUser.friends.includes(user.authId)) {
                newFriendsArray.push(user);
            }
        }
        setSearchFriendsList(newFriendsArray);
    }

    useEffect(() => {
        regex = new RegExp(searchFriend, "i");
        updateSearching();
    }, [searchFriend]);

    const sendInvitation = async (userFrom, userTo) => {
        if (!alreadyInvitedFriends.includes(userTo.authId) && !actuallUser.friends.includes(userTo.authId)) {
            setIsLoading(true);
            await dispatch(userActions.sendInvitation(userFrom, userTo)).then(() => {
                setIsLoading(false);
            });
        }
    }

    const acceptInvitation = async (userFrom, userTo) => {
        setIsLoading(true);
        await dispatch(userActions.acceptInvitation(userFrom, userTo)).then(() => {
            setIsLoading(false);
        });
    }

    const declineInvitation = async (userFrom, userTo) => {
        setIsLoading(true);
        await dispatch(userActions.declineInvitation(userFrom, userTo)).then(() => {
            setIsLoading(false);
        });
    }

    const deleteFriend = async (friend) => {
        setIsLoading(true);
        await dispatch(userActions.deleteFriend(friend)).then(() => {
            setIsLoading(false);
        });
    }

    useEffect(() => {
        if (error) {
            Alert.alert('Wystąpił błąd!', error, [{ text: 'Ok' }]);
        }
    }, [error]);

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
                <View style={styles.menuButton}>
                    <TouchableOpacity style={styles.button} onPress={() => {
                        props.navigation.navigate("Menu")
                    }}
                    >
                        <Ionicons size={60} name={'menu'} color='black' />
                    </TouchableOpacity>
                </View>
                <View style={styles.titleContainer}>
                    <Text style={{ fontSize: 22 }}>Znajomi</Text>
                </View>
            </View>
            <View style={styles.searchFriend}>
                <TextInput style={styles.input} placeholder="Wyszukaj znajomych" onChangeText={text => {
                    setSearchFriend(text);
                    if (text.length == 0) {
                        isFriendsList(true);
                    } else {
                        isFriendsList(false);
                    }
                }} />
            </View>
            {friendsList ? (
                <View>
                    <TouchableOpacity style={styles.showInvitation} onPress={() => {
                        setShowInvitation(!showInvitation);
                    }}
                    >
                        <Text>Oczekujące zaproszenia ({invitationFriends.length}) </Text>
                        <Ionicons size={38} name={showInvitation ? 'chevron-up' : 'chevron-down'} color='black' />
                    </TouchableOpacity>
                    {showInvitation ? (
                        <FlatList data={invitationFriends} keyExtractor={item => item} renderItem={itemData => (
                            <View>
                                <Text>{allUsers.users.find(user => user.authId === itemData.item).firstname} {allUsers.users.find(user => user.authId === itemData.item).lastname} ({allUsers.users.find(user => user.authId === itemData.item).username})</Text>
                                <TouchableOpacity onPress={() => {
                                    acceptInvitation(itemData.item, actuallUser);
                                }}>
                                    <Ionicons size={38} name={"person-add-outline"} color='black' />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => {
                                    declineInvitation(itemData.item, actuallUser);
                                }}>
                                    <Ionicons size={38} name={"person-remove-outline"} color='black' />
                                </TouchableOpacity>
                            </View>
                        )} />
                    ) :
                        null
                    }
                </View>
            ) : null}
            {friendsList ?
                <FlatList data={actuallUser.friends} keyExtractor={item => item} renderItem={itemData => (
                    <View>
                        <Text>{allUsers.users.find(user => user.authId === itemData.item).firstname} {allUsers.users.find(user => user.authId === itemData.item).lastname} ({allUsers.users.find(user => user.authId === itemData.item).username})</Text>
                        <TouchableOpacity onPress={() => {
                            deleteFriend(allUsers.users.find(user => user.authId === itemData.item));
                        }}>
                            <Ionicons size={38} name={"person-remove-outline"} color='black' />
                        </TouchableOpacity>
                    </View>
                )} /> :
                <FlatList data={searchFriendsList} keyExtractor={item => item.authId} renderItem={itemData => (
                    <View>
                        <Text>{itemData.item.username}</Text>
                        <TouchableOpacity onPress={() => {
                            sendInvitation(actuallUser, itemData.item);
                        }}>
                            <MaterialIcons size={38} name={(alreadyInvitedFriends.includes(itemData.item.authId) || actuallUser.friends.includes(itemData.item.authId)) ? "done" : "add-circle-outline"} color='black' />
                        </TouchableOpacity>
                    </View>
                )} />
            }
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
    button: {
        justifyContent: 'center',
        alignItems: 'center'

    },
    titleContainer: {
        width: '80%',
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default FriendsScreen;