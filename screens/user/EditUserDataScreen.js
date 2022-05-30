import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { View, Text, StyleSheet, Button, TouchableOpacity, TextInput, Alert, Image, Platform, KeyboardAvoidingView, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import * as userActions from '../../store/actions/user';
import colors from "../../constants/colors";

const EditUserDataScreen = props => {

    const [isLoading, setIsLoading] = useState(false);
    const [isReloading, setIsReloading] = useState(false);
    const [error, setError] = useState();
    const dispatch = useDispatch();

    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');

    const allUsers = useSelector(state => state.users);
    const actuallUser = allUsers.users.find(user => user.authId === allUsers.userId);

    const device = Platform.OS;

    const loadInputValues = () => {
        setEmail(actuallUser.email);
        setUsername(actuallUser.username);
        setFirstName(actuallUser.firstname);
        setLastName(actuallUser.lastname);
    };

    useEffect(async () => {
        setIsLoading(true);
        await dispatch(userActions.fetchUsers()).then(() => {
            loadInputValues();
            setIsLoading(false);
        });
    }, [dispatch, isReloading]);

    useEffect(() => {
        if (error) {
            Alert.alert('Wystąpił błąd!', error, [{ text: 'Ok' }]);
        }
    }, [error]);

    const saveUserDataHandler = async () => {

        setError();
        setIsLoading(true);

        if (email.length > 0 && firstName.length > 0 && lastName.length > 0) {

            var emailRegex = /^[a-z0-9]+@[a-z0-9]+.[a-z]{2,3}$/;

            if (emailRegex.test(email)) {

                const emailsArray = [];
                for (var i = 0; i < allUsers.users.length; i++) {
                    if (allUsers.users[i].email != actuallUser.email) {
                        emailsArray.push(allUsers.users[i].email);
                    }
                }

                if (!emailsArray.includes(email)) {

                    try {
                        await dispatch(userActions.updateUser(
                            allUsers.dbname,
                            actuallUser.authId,
                            firstName.toString(),
                            lastName.toString(),
                            email.toString(),
                            actuallUser.username,
                            actuallUser.friends,
                            actuallUser.newFriends,
                            actuallUser.awaitingFriends,
                        ));
                    } catch (err) {
                        setError(err.message);
                        setIsLoading(false);
                    }
                }
                else {
                    setError("Wprowadzony adres e-mail jest już zajęty. Spróbuj ponownie!");
                }
            }
            else {
                setError("Wprowadzono nieprawidłowy adres e-mail!");
            }
        }
        else {
            setError("Pola: Imię, Nazwisko oraz E-mail nie mogą być puste!");
        }

        setIsReloading(!isReloading);
    };

    if (device === "ios") {
        return (
            <View style={styles.screen}>
                <View style={styles.screenTitle}>
                    <Image style={styles.screenTitleImg} source={require('../../assets/images/background_userdata.png')} resizeMode={"cover"} />
                </View>
                <View style={styles.menuButton}>
                    <TouchableOpacity style={styles.button} onPress={() => {
                        props.navigation.navigate("Menu")
                    }}
                    >
                        <Ionicons size={40} name={'home-outline'} color='white' />
                    </TouchableOpacity>
                </View>
                <KeyboardAvoidingView
                    behavior="padding"
                    keyboardVerticalOffset={0}
                    style={styles.formContainer}
                >
                    <ScrollView style={styles.scrollContainer}>
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Imię</Text>
                            <TextInput style={styles.input} onChangeText={text => setFirstName(text)} value={firstName} />
                        </View>
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Nazwisko</Text>
                            <TextInput style={styles.input} onChangeText={text => setLastName(text)} value={lastName} />
                        </View>
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Nazwa użytkownika</Text>
                            <TextInput style={{...styles.input, color: colors.greenMain}} onTouchEnd={() => {Alert.alert("", "Nie można zmieniać nazwy użytkownika")}} value={username} editable={false} />
                        </View>
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>E-mail</Text>
                            <TextInput style={styles.input} onChangeText={text => setEmail(text)} value={email} />
                        </View>
                    </ScrollView>
                    <View style={styles.bottomContainer}>
                        <View style={styles.actionButtonContainer}>
                            <TouchableOpacity style={styles.actionButton} onPress={() => {
                                props.navigation.navigate("Password")
                            }}>
                                <Text style={{color: 'white', fontFamily: 'roboto', fontSize: 16}}>Zmień hasło</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.actionButtonContainer}>
                            <TouchableOpacity style={styles.actionButton} onPress={() => {
                                saveUserDataHandler();
                            }}>
                                <Text style={{color: 'white', fontFamily: 'roboto', fontSize: 16}}>Zapisz</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </View>
        );
    } else {
        return (
            <View style={styles.screen}>
                <View style={styles.screenTitle}>
                    <Image style={styles.screenTitleImg} source={require('../../assets/images/background_userdata.png')} resizeMode={"cover"} />
                </View>
                <View style={styles.menuButton}>
                    <TouchableOpacity style={styles.button} onPress={() => {
                        props.navigation.navigate("Menu")
                    }}
                    >
                        <Ionicons size={40} name={'home-outline'} color='white' />
                    </TouchableOpacity>
                </View>
                <View style={styles.formContainer}>
                    <ScrollView style={styles.scrollContainer}>
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Imię</Text>
                            <TextInput style={styles.input} onChangeText={text => setFirstName(text)} value={firstName} />
                        </View>
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Nazwisko</Text>
                            <TextInput style={styles.input} onChangeText={text => setLastName(text)} value={lastName} />
                        </View>
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Nazwa użytkownika</Text>
                            <TextInput style={{...styles.input, color: colors.greenMain}} onTouchEnd={() => {Alert.alert("", "Nie można zmieniać nazwy użytkownika")}} value={username} editable={false} />
                        </View>
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>E-mail</Text>
                            <TextInput style={styles.input} onChangeText={text => setEmail(text)} value={email} />
                        </View>
                    </ScrollView>
                    <View style={styles.bottomContainer}>
                        <View style={styles.actionButtonContainer}>
                            <TouchableOpacity style={styles.actionButton} onPress={() => {
                                props.navigation.navigate("Password")
                            }}>
                                <Text style={{color: 'white', fontFamily: 'roboto', fontSize: 16}}>Zmień hasło</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.actionButtonContainer}>
                            <TouchableOpacity style={styles.actionButton} onPress={() => {
                                saveUserDataHandler();
                            }}>
                                <Text style={{color: 'white', fontFamily: 'roboto', fontSize: 16}}>Zapisz</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        );
    }
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
        top: 30
    },
    button: {
        justifyContent: 'center',
        alignItems: 'center'

    },
    formContainer: {
        width: "100%",
        height: "65%",
        alignItems: 'center',
        justifyContent: 'space-evenly',
        backgroundColor: colors.primaryColor,
    },
    scrollContainer: {
        width: '100%',
        height: "80%"
    },
    inputContainer: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 5
    },
    label: {
        fontSize: 18,
        fontFamily: 'roboto',
        color: colors.brownMain
    },
    input: {
        width: '75%',
        height: 40,
        borderBottomWidth: 2,
        borderColor: colors.brownMain,
        marginVertical: 5,
        textAlign: 'center',
        color: colors.brownMain
    },
    bottomContainer: {
        width: "100%",
        height: "20%",
        flexDirection: 'row',
        justifyContent: 'space-evenly'
    },
    actionButtonContainer: {
        width: "35%",
        height: 40,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: colors.brownMain,
        backgroundColor: colors.greenMain,
    },
    actionButton: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center'
    }
});

EditUserDataScreen.navigationOptions = {
    headerShown: false
};

export default EditUserDataScreen;