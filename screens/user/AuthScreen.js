import React, { useState, useEffect } from "react";
import { View, StyleSheet, Button, ScrollView, TextInput, ActivityIndicator, Alert, Image, Platform, KeyboardAvoidingView, TouchableOpacity, Text } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import colors from "../../constants/colors";

import * as authActions from '../../store/actions/auth';
import * as userActions from '../../store/actions/user';

import SwitchSelector from "react-native-switch-selector";

const AuthScreen = props => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();
    const [isLoginScreen, setIsLoginScreen] = useState(true);
    const dispatch = useDispatch();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [username, setUsername] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');

    const allUsers = useSelector(state => state.users.users);

    const device = Platform.OS;

    useEffect(() => {
        setIsLoading(true);
        dispatch(userActions.fetchUsers()).then(() => {
            setIsLoading(false);
        });
    }, [dispatch]);

    useEffect(() => {
        if (error) {
            Alert.alert('Wystąpił błąd!', error, [{ text: 'Ok' }]);
        }
    }, [error]);

    const authHandler = async () => {
        if (isLoginScreen) {
            if (username.length > 0 && password.length > 0) {
                let isCorrect = true;
                if (allUsers.filter(user => user.username === username).length === 0) {
                    Alert.alert("Ups! Wystąpił problem!", "Podana nazwa użytkownika nie istnieje :( Spróbuj ponownie!");
                    isCorrect = false;
                }
                if (isCorrect) {
                    const userEmail = allUsers.find(user => user.username === username);
                    let action = authActions.login(userEmail.email, password);

                    setError();
                    setIsLoading(true);

                    try {
                        await dispatch(action).then(() => {
                            dispatch(userActions.fetchUsers());
                            props.navigation.navigate('Menu');
                        });
                    } catch (err) {
                        setError(err.message);
                        setIsLoading(false);
                    }
                }
            } else {
                Alert.alert("Ups! Wystąpił problem!", "Sprawdź czy uzupełniłeś wszystkie pola i spróbuj ponownie.");
            }
        } else {
            if (firstName.length > 0 && lastName.length > 0 && email.length > 0 && username.length > 0 && password.length > 0 && repeatPassword.length > 0) {
                let isCorrect = true;
                var decimal=  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/;
                if(!password.match(decimal)){
                    Alert.alert("Ups! Wystąpił problem!", "Hasło powinno zawierać od 8 do 15 liter, posiadać małą literę, wielką literę, cyfrę oraz znak specjalny!");
                    isCorrect = false;
                }
                if (password !== repeatPassword) {
                    Alert.alert("Ups! Wystąpił problem!", "Sprawdź poprawność podanych haseł!");
                    isCorrect = false;
                }
                let regex = new RegExp("([!#-'*+/-9=?A-Z^-~-]+(\.[!#-'*+/-9=?A-Z^-~-]+)*|\"\(\[\]!#-[^-~ \t]|(\\[\t -~]))+\")@([!#-'*+/-9=?A-Z^-~-]+(\.[!#-'*+/-9=?A-Z^-~-]+)*|\[[\t -Z^-~]*])");
                if(!regex.test(email)){
                    Alert.alert("Ups! Wystąpił problem!", "Podany adres email jest niepoprawny. Spróbuj ponownie!");
                    isCorrect = false;
                }
                if (allUsers.filter(user => user.email === email).length > 0) {
                    Alert.alert("Ups! Wystąpił problem!", "Podany adres email jest już zajęty :( Spróbuj ponownie!");
                    isCorrect = false;
                }
                if (allUsers.filter(user => user.username === username).length > 0) {
                    Alert.alert("Ups! Wystąpił problem!", "Podana nazwa użytkownika jest już zajęta :( Spróbuj ponownie!");
                    isCorrect = false;
                }
                if (isCorrect) {
                    let action = authActions.signUp(email, password);

                    setError();
                    setIsLoading(true);

                    try {
                        await dispatch(action).then(() => { });
                        await dispatch(userActions.createUser(firstName, lastName, email, username)).then(() => {
                            dispatch(userActions.fetchUsers());
                            props.navigation.navigate('Menu');
                        });
                    } catch (err) {
                        setError(err.message);
                        setIsLoading(false);
                    }
                }
            } else {
                Alert.alert("Ups! Wystąpił problem!", "Sprawdź czy uzupełniłeś wszystkie pola i spróbuj ponownie!");
            }
        }
    };

    if (device === "ios") {
        return (
            <KeyboardAvoidingView
                behavior="padding"
                keyboardVerticalOffset={0}
                style={styles.screen}
            >
                <View style={styles.appTitle}>
                    <Image style={styles.appTitleImg} source={require('../../assets/images/background_auth.png')} resizeMode={"cover"} />
                </View>
                <View style={styles.container}>
                    <View style={styles.buttonContainer}>
                        <SwitchSelector
                            initial={1}
                            options={[{ label: "Logowanie", value: false }, { label: "Rejestracja", value: true }]}
                            onPress={value => {
                                setEmail('');
                                setUsername('');
                                setPassword('');
                                setFirstName('');
                                setLastName('');
                                setPassword('');
                                setRepeatPassword('');
                                setIsLoginScreen(value);
                            }}
                            textColor={'white'}
                            selectedColor={colors.greenMain}
                            buttonColor={colors.greenMain}
                            backgroundColor={colors.greenSecondary}
                            height={50}
                            fontSize={18}
                            textStyle={styles.authTypeText}
                            borderWidth={2}
                            valuePadding={5}
                            borderColor={colors.brownMain}
                            hasPadding
                        />
                    </View>
                    <View style={styles.scrollContainer}>
                        <ScrollView style={styles.scroll} contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }} showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}>
                            {isLoginScreen
                                ?
                                <View style={styles.login}>
                                    <View style={styles.inputContainer}>
                                        <View style={styles.inputView}>
                                            <TextInput style={styles.input}
                                                placeholder="Nazwa użytkownika"
                                                placeholderTextColor={colors.brownMain}
                                                autoCapitalize="none"
                                                autoCorrect={false}
                                                onChangeText={text => {
                                                    setUsername(text);
                                                }}
                                                value={username}
                                            />
                                        </View>
                                        <View style={styles.inputView}>
                                            <TextInput style={styles.input}
                                                placeholder="Hasło"
                                                placeholderTextColor={colors.brownMain}
                                                secureTextEntry={true}
                                                autoCapitalize="none"
                                                onChangeText={text => {
                                                    setPassword(text)
                                                }}
                                                value={password}
                                            />
                                        </View>
                                    </View>
                                </View>
                                :
                                <View style={styles.register}>
                                    <View style={styles.inputContainer}>
                                        <View style={styles.inputView}>
                                            <TextInput style={styles.input}
                                                placeholder="Imię"
                                                placeholderTextColor={colors.brownMain}
                                                onChangeText={text => {
                                                    setFirstName(text);
                                                }}
                                                value={firstName}
                                            />
                                        </View>
                                        <View style={styles.inputView}>
                                            <TextInput style={styles.input}
                                                placeholder="Nazwisko"
                                                placeholderTextColor={colors.brownMain}
                                                onChangeText={text => {
                                                    setLastName(text);
                                                }}
                                                value={lastName}
                                                secureTextEntry={false}
                                            />
                                        </View>
                                        <View style={styles.inputView}>
                                            <TextInput style={styles.input}
                                                placeholder="E-mail"
                                                placeholderTextColor={colors.brownMain}
                                                onChangeText={text => {
                                                    setEmail(text);
                                                }}
                                                value={email}
                                            />
                                        </View>
                                        <View style={styles.inputView}>
                                            <TextInput style={styles.input}
                                                placeholder="Nazwa użytkownika"
                                                placeholderTextColor={colors.brownMain}
                                                onChangeText={text => {
                                                    setUsername(text);
                                                }}
                                                value={username}
                                            />
                                        </View>
                                        <View style={styles.inputView}>
                                            <TextInput style={styles.input}
                                                placeholder="Hasło"
                                                placeholderTextColor={colors.brownMain}
                                                onChangeText={text => {
                                                    setPassword(text);
                                                }}
                                                secureTextEntry={true}
                                                value={password}
                                            />
                                        </View>
                                        <View style={styles.inputView}>
                                            <TextInput style={styles.input}
                                                placeholder="Powtórz hasło"
                                                placeholderTextColor={colors.brownMain}
                                                onChangeText={text => {
                                                    setRepeatPassword(text);
                                                }}
                                                secureTextEntry={true}
                                                value={repeatPassword}
                                            />
                                        </View>
                                    </View>
                                </View>
                            }
                        </ScrollView>
                    </View>
                    {isLoginScreen ?
                        <View style={styles.auth}>
                            {isLoading
                                ?
                                <ActivityIndicator />
                                :
                                <TouchableOpacity onPress={authHandler} style={styles.authButton}>
                                    <Text style={styles.authText}>Zaloguj się</Text>
                                </TouchableOpacity>
                            }
                        </View>
                        :
                        <View style={styles.auth}>
                            {isLoading
                                ?
                                <ActivityIndicator />
                                :
                                <TouchableOpacity style={styles.authButton} onPress={authHandler}>
                                    <Text style={styles.authText}>Zarejestruj</Text>
                                </TouchableOpacity>
                            }
                        </View>
                    }
                </View>
            </KeyboardAvoidingView >
        );
    } else {
        return (
            <View style={styles.screen}>
                <View style={styles.appTitle}>
                    <Image style={styles.appTitleImg} source={require('../../assets/images/background_auth.png')} resizeMode={"cover"} />
                </View>
                <View style={styles.container}>
                    <View style={styles.buttonContainer}>
                        <SwitchSelector
                            initial={1}
                            options={[{ label: "Logowanie", value: false }, { label: "Rejestracja", value: true }]}
                            onPress={value => {
                                setIsLoginScreen(value);
                                setEmail('');
                                setUsername('');
                                setPassword('');
                            }}
                            textColor={'white'}
                            selectedColor={colors.greenMain}
                            buttonColor={colors.greenMain}
                            backgroundColor={colors.greenSecondary}
                            height={50}
                            fontSize={18}
                            textStyle={styles.authTypeText}
                            borderWidth={2}
                            valuePadding={5}
                            borderColor={colors.brownMain}
                            hasPadding
                        />
                    </View>
                    <View style={styles.scrollContainer}>
                        <ScrollView style={styles.scroll} contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }} showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}>
                            {isLoginScreen
                                ?
                                <View style={styles.login}>
                                    <View style={styles.inputContainer}>
                                        <View style={styles.inputView}>
                                            <TextInput style={styles.input}
                                                placeholder="Nazwa użytkownika"
                                                placeholderTextColor={colors.brownMain}
                                                autoCapitalize="none"
                                                autoCorrect={false}
                                                onChangeText={text => {
                                                    setUsername(text);
                                                }}
                                                value={username}
                                            />
                                        </View>
                                        <View style={styles.inputView}>
                                            <TextInput style={styles.input}
                                                placeholder="Hasło"
                                                placeholderTextColor={colors.brownMain}
                                                secureTextEntry={true}
                                                autoCapitalize="none"
                                                onChangeText={text => {
                                                    setPassword(text)
                                                }}
                                                value={password}
                                            />
                                        </View>
                                    </View>
                                </View>
                                :
                                <View style={styles.register}>
                                    <View style={styles.inputContainer}>
                                        <View style={styles.inputView}>
                                            <TextInput style={styles.input}
                                                placeholder="Imię"
                                                placeholderTextColor={colors.brownMain}
                                                onChangeText={text => {
                                                    setFirstName(text);
                                                }}
                                                value={firstName}
                                            />
                                        </View>
                                        <View style={styles.inputView}>
                                            <TextInput style={styles.input}
                                                placeholder="Nazwisko"
                                                placeholderTextColor={colors.brownMain}
                                                onChangeText={text => {
                                                    setLastName(text);
                                                }}
                                                value={lastName}
                                                secureTextEntry={false}
                                            />
                                        </View>
                                        <View style={styles.inputView}>
                                            <TextInput style={styles.input}
                                                placeholder="E-mail"
                                                placeholderTextColor={colors.brownMain}
                                                onChangeText={text => {
                                                    setEmail(text);
                                                }}
                                                value={email}
                                            />
                                        </View>
                                        <View style={styles.inputView}>
                                            <TextInput style={styles.input}
                                                placeholder="Nazwa użytkownika"
                                                placeholderTextColor={colors.brownMain}
                                                onChangeText={text => {
                                                    setUsername(text);
                                                }}
                                                value={username}
                                            />
                                        </View>
                                        <View style={styles.inputView}>
                                            <TextInput style={styles.input}
                                                placeholder="Hasło"
                                                placeholderTextColor={colors.brownMain}
                                                onChangeText={text => {
                                                    setPassword(text);
                                                }}
                                                secureTextEntry={true}
                                                value={password}
                                            />
                                        </View>
                                        <View style={styles.inputView}>
                                            <TextInput style={styles.input}
                                                placeholder="Powtórz hasło"
                                                placeholderTextColor={colors.brownMain}
                                                onChangeText={text => {
                                                    setRepeatPassword(text);
                                                }}
                                                secureTextEntry={true}
                                                value={repeatPassword}
                                            />
                                        </View>
                                    </View>
                                </View>
                            }
                        </ScrollView>
                    </View>
                    {isLoginScreen ?
                        <View style={styles.auth}>
                            {isLoading
                                ?
                                <ActivityIndicator />
                                :
                                <TouchableOpacity onPress={authHandler} style={styles.authButton}>
                                    <Text style={styles.authText}>Zaloguj się</Text>
                                </TouchableOpacity>
                            }
                        </View>
                        :
                        <View style={styles.auth}>
                            {isLoading
                                ?
                                <ActivityIndicator />
                                :
                                <TouchableOpacity style={styles.authButton} onPress={authHandler}>
                                    <Text style={styles.authText}>Zarejestruj</Text>
                                </TouchableOpacity>
                            }
                        </View>
                    }
                </View>
            </View >
        );
    }

};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: colors.brownMain,
    },
    appTitle: {
        width: "100%",
        height: "50%",
    },
    appTitleImg: {
        width: "100%",
        height: "100%",
    },
    container: {
        width: '100%',
        height: '50%',
        alignItems: 'center',
        backgroundColor: colors.primaryColor
    },
    buttonContainer: {
        width: '80%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: "center"
    },
    authTypeText: {
        fontFamily: 'roboto'
    },
    scrollContainer: {
        width: '100%',
        height: 180,
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 15,
        marginTop: 10
    },
    scroll: {
        width: "80%",
        marginTop: 10,
        marginBottom: 5
    },
    login: {
        width: "80%",
        justifyContent: 'center',
        alignItems: 'center',
    },
    register: {
        width: "80%",
        justifyContent: 'center',
        alignItems: 'center',
    },
    inputContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
    inputView: {
        width: "100%",
    },
    input: {
        fontSize: 16,
        marginVertical: 20,
        textAlign: 'center',
        color: colors.brownMain,
        borderBottomWidth: 1,
        borderColor: colors.brownMain,

    },
    auth: {
        width: '50%',
        height: 45,
        borderRadius: 45,
        borderWidth: 2,
        borderColor: colors.brownMain,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.greenMain,
        marginTop: 10
    },
    authButton: {

    },
    authText: {
        color: 'white',
        fontFamily: 'roboto',
        fontSize: 18
    }
});

AuthScreen.navigationOptions = {
    headerShown: false
};

export default AuthScreen;