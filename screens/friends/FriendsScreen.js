import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, FlatList, Image, Platform, KeyboardAvoidingView } from 'react-native';
import { Entypo, Ionicons, MaterialIcons } from '@expo/vector-icons';

import * as userActions from '../../store/actions/user';
import colors from "../../constants/colors";

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
        }, 100);

        return () => {
            clearInterval(toggle);
            setIntervalSwitch(!intervalSwitch);
        }
    }, [intervalSwitch]);

    const friendsListContent = (
        <View style={{ ...styles.friendsListContainer, height: showInvitation ? "0%" : "60%" }}>
            <View style={styles.friendsListTitle}>
                <Text style={styles.friendsListTitleText}>Lista znajomych</Text>
            </View>
            <View style={styles.friendsListFlatListContainer}>
                <FlatList scrollEnabled={true} contentContainerStyle={styles.friendsListFlatList} data={actuallUser.friends} keyExtractor={item => item} renderItem={itemData => (
                    <View style={styles.friendsListItemContainer}>
                        <Text style={{ color: 'white', fontFamily: 'roboto', fontSize: 14 }}>{allUsers.users.find(user => user.authId === itemData.item).firstname} {allUsers.users.find(user => user.authId === itemData.item).lastname} ({allUsers.users.find(user => user.authId === itemData.item).username})</Text>
                        <TouchableOpacity onPress={() => {
                            deleteFriend(allUsers.users.find(user => user.authId === itemData.item));
                        }}>
                            <Ionicons size={38} name={"person-remove-outline"} color={'white'} />
                        </TouchableOpacity>
                    </View>
                )} />
            </View>
        </View>
    );

    const searchFriendContent = (
        <View style={styles.searchFriendFlatListContainer}>
            <FlatList contentContainerStyle={styles.searchFriendFlatList} data={searchFriendsList} keyExtractor={item => item.authId} renderItem={itemData => (
                <View style={styles.searchFriendItemContainer}>
                    <View style={styles.searchFriendItemTextContainer}>
                        <Text style={styles.searchFriendItemText}>{itemData.item.username}</Text>
                    </View>
                    <TouchableOpacity onPress={() => {
                        sendInvitation(actuallUser, itemData.item);
                    }}>
                        <MaterialIcons size={38} name={(alreadyInvitedFriends.includes(itemData.item.authId) || actuallUser.friends.includes(itemData.item.authId)) ? "done" : "add-circle-outline"} color={colors.brownMain} />
                    </TouchableOpacity>
                </View>
            )} />
        </View>
    );

    const awaitingInvitationsListContent = (
        <View style={styles.awaitingInvitationsListContainer}>
            <FlatList contentContainerStyle={styles.flatListInvitations} data={invitationFriends} keyExtractor={item => item} renderItem={itemData => (
                <View style={styles.awaitingInvitationsListItem}>
                    <View>
                        <Text style={styles.newInvitationText}>{allUsers.users.find(user => user.authId === itemData.item).firstname} {allUsers.users.find(user => user.authId === itemData.item).lastname} ({allUsers.users.find(user => user.authId === itemData.item).username})</Text>
                    </View>
                    <View style={styles.newInvitationAccept}>
                        <TouchableOpacity onPress={() => {
                            acceptInvitation(itemData.item, actuallUser);
                        }}>
                            <Ionicons size={38} name={"person-add-outline"} color={'white'} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.newInvitationDecline}>
                        <TouchableOpacity onPress={() => {
                            declineInvitation(itemData.item, actuallUser);
                        }}>
                            <Ionicons size={38} name={"person-remove-outline"} color={'white'} />
                        </TouchableOpacity>
                    </View>
                </View>
            )} />
        </View>
    );

    const emptyAwaitingInvitationsListContent = (
        <View style={styles.awaitingInvitationsListContainer}>
            <View style={styles.emptyAwaitingInvitationsList}>
                <Text style={styles.emptyAwaitingInvitationsListText}>Aktualnie nie masz nowych zaproszeń</Text>
            </View>
        </View>
    );

    const screenContent = (
        <View style={styles.friendsContainer}>
            <View style={styles.searchFriendContainer}>
                <View style={styles.searchIcon}>
                    <Entypo name="magnifying-glass" size={34} color={colors.brownMain} />
                </View>
                <View style={styles.searchFriend}>
                    <TextInput style={styles.input} placeholder="Wyszukaj znajomych" placeholderTextColor={colors.brownMain} onChangeText={text => {
                        setSearchFriend(text);
                        if (text.length == 0) {
                            isFriendsList(true);
                        } else {
                            isFriendsList(false);
                        }
                    }} />
                </View>
            </View>
            {friendsList ?
                <View style={styles.awaitingInvitations}>
                    <View style={styles.awaitingInvitationsButton}>
                        <TouchableOpacity style={styles.showInvitation} onPress={() => {
                            setShowInvitation(!showInvitation);
                        }}
                        >
                            <Ionicons size={38} name={showInvitation ? 'chevron-up' : 'chevron-down'} color={colors.brownMain} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.awaitingInvitationsTextContainer}>
                        <Text style={styles.awaitingInvitationsText}>Oczekujące zaproszenia ({invitationFriends.length}) </Text>
                    </View>
                </View>
                :
                null
            }
            {friendsList ?
                showInvitation ?
                    invitationFriends.length > 0 ?
                        awaitingInvitationsListContent
                        :
                        emptyAwaitingInvitationsListContent
                    :
                    null
                :
                null
            }
            {friendsList ?
                friendsListContent
                :
                searchFriendContent
            }
        </View>
    );

    return (
        <View style={styles.screen}>
            <View style={styles.screenTitle}>
                <Image style={styles.screenTitleImg} source={require('../../assets/images/background_friends.png')} resizeMode={"cover"} />
            </View>
            <View style={styles.menuButton}>
                <TouchableOpacity style={styles.button} onPress={() => {
                    props.navigation.navigate("Menu")
                }}
                >
                    <Ionicons size={40} name={'home-outline'} color='white' />
                </TouchableOpacity>
            </View>
            {Platform.OS === "ios" ?
                <KeyboardAvoidingView style={styles.friends}>
                    {screenContent}
                </KeyboardAvoidingView>
                :
                <View style={styles.friends}>
                    {screenContent}
                </View>}
        </View>
    );
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: colors.brownMain,
    },
    screenTitle: {
        width: "100%",
        height: "35%",
        alignItems: 'center',
    },
    screenTitleImg: {
        width: "101%",
        height: "100%",
    },
    menuButton: {
        width: '15%',
        justifyContent: 'center',
        alignItems: 'center',
        position: "absolute",
        left: 20,
        top: 35
    },
    button: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    friends: {
        width: "100%",
        height: "65%"
    },
    friendsContainer: {
        width: "100%",
        height: "100%",
        alignItems: 'center',
        backgroundColor: colors.primaryColor,
    },
    searchFriendContainer: {
        width: "90%",
        height: "10%",
        alignItems: 'center',
        justifyContent: 'space-evenly',
        flexDirection: 'row',
        marginBottom: 10,
        borderBottomWidth: 2,
        borderColor: colors.brownMain,
    },
    searchFriend: {
        width: "70%",
        height: "100%",
        alignItems: 'center',
        justifyContent: 'center',
    },
    input: {
        color: colors.brownMain,
        fontFamily: 'roboto',
        fontSize: 16
    },
    awaitingInvitationsContainer: {
        width: "100%",
        backgroundColor: 'blue'
    },
    awaitingInvitations: {
        width: '100%',
        height: 65,
        flexDirection: 'row',
        justifyContent: "center"
    },
    awaitingInvitationsTextContainer: {
        width: '70%',
        height: 65,
        justifyContent: 'center',
        alignItems: 'center',
    },
    awaitingInvitationsText: {
        color: colors.brownMain,
        fontFamily: 'roboto',
        fontSize: 16
    },
    awaitingInvitationsButton: {
        width: '15%',
        height: 65,
        justifyContent: 'center',
        alignItems: 'center',
    },
    awaitingInvitationsListContainer: {
        width: '100%',
        height: '75%',
    },
    flatListInvitations: {
        width: '100%',
        alignItems: 'center'
    },
    awaitingInvitationsListItem: {
        width: '95%',
        height: 60,
        alignItems: 'center',
        justifyContent: 'space-evenly',
        flexDirection: 'row',
        marginVertical: 5,
        backgroundColor: colors.greenMain,
        borderWidth: 2,
        borderColor: colors.brownMain,
        borderRadius: 20
    },
    newInvitationText: {
        color: 'white',
        fontFamily: 'roboto',
        fontSize: 14
    },
    newInvitationAccept: {
        width: '13%'
    },
    newInvitationDecline: {
        width: '13%'
    },
    emptyAwaitingInvitationsList: {
        width: '100%',
        height: '100%',
        alignItems: 'center'
    },
    emptyAwaitingInvitationsListText: {
        color: colors.brownMain,
        fontFamily: 'roboto',
        fontSize: 14
    },
    friendsListContainer: {
        marginTop: 20,
        width: '80%',
        backgroundColor: colors.greenMain,
        borderWidth: 2,
        borderColor: colors.brownMain,
        borderRadius: 20,
        overflow: 'hidden'
    },
    friendsListTitle: {
        width: "100%",
        height: '25%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    friendsListTitleText: {
        color: 'white',
        fontSize: 18,
        fontFamily: 'roboto'
    },
    friendsListFlatListContainer: {

    },
    friendsListFlatList: {
        width: '100%',
        height: '75%',
        alignItems: 'center'
    },
    friendsListItemContainer: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        paddingVertical: 10,
        borderTopWidth: 2,
        borderColor: colors.brownMain
    },
    searchFriendFlatListContainer: {
        width: '100%',
        height: '80%',
        alignItems: 'center',
        marginTop: 20
    },
    searchFriendFlatList: {
        width: "100%",
        height: "100%"
    },
    searchFriendItemContainer: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        marginVertical: 10
    },
    searchFriendItemTextContainer: {
        width: '40%'
    },
    searchFriendItemText: {
        fontFamily: 'roboto',
        fontSize: 14,
        color: colors.brownMain
    }
});

export default FriendsScreen;