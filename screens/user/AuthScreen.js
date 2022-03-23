import React, { useState, useEffect } from "react";
import { View, StyleSheet, Button, ScrollView, TextInput, ActivityIndicator, Alert } from 'react-native';
import { useDispatch } from 'react-redux';

import * as authActions from '../../store/actions/auth';

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

    useEffect(() => {
        if (error) {
            Alert.alert('Wystąpił błąd!', error, [{ text: 'Ok' }]);
        }
    }, [error]);

    const authHandler = async () => {
        let action;
        if (isLoginScreen) {
            action = authActions.login(email, password);
        } else {
            action = authActions.signUp(email, password);
        }

        setError();
        setIsLoading(true);

        try {
            await dispatch(action);
            props.navigation.navigate('Menu');
        } catch (err) {
            setError(err.message);
            setIsLoading(false);
        }
    };

    return (
        <View style={styles.screen}>
            <View style={styles.container}>
                <ScrollView style={styles.scroll} showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}>
                    <View style={styles.buttonContainer}>
                        <Button title="Logowanie" onPress={() => {
                            setIsLoginScreen(true);
                            setEmail('');
                            setPassword('');
                        }} />
                        <Button title="Rejestracja" onPress={() => {
                            setIsLoginScreen(false);
                            setEmail('');
                            setPassword('');
                        }} />
                    </View>
                    {isLoginScreen
                        ?
                        <View style={styles.login}>
                            <View style={styles.inputContainer}>
                                <TextInput style={styles.input}
                                    placeholder="Nazwa użytkownika"
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    onChangeText={text => {
                                        setEmail(text);
                                    }}
                                    value={email}
                                />
                                <TextInput style={styles.input}
                                    placeholder="Hasło"
                                    secureTextEntry={true}
                                    autoCapitalize="none"
                                    onChangeText={text => {
                                        setPassword(text)
                                    }}
                                    value={password}
                                />
                            </View>
                            <View>
                                {isLoading
                                    ?
                                    <ActivityIndicator />
                                    :
                                    <Button
                                        title="Zaloguj się"
                                        onPress={authHandler}
                                    />
                                }
                            </View>
                        </View>
                        :
                        <View style={styles.login}>
                            <View style={styles.inputContainer}>
                                <TextInput style={styles.input}
                                    placeholder="Imię"
                                    onChangeText={text => {
                                        setFirstName(text);
                                    }}
                                    value={firstName}
                                />
                                <TextInput style={styles.input}
                                    placeholder="Nazwisko"
                                    onChangeText={text => {
                                        setLastName(text);
                                    }}
                                    value={lastName}
                                />
                                <TextInput style={styles.input}
                                    placeholder="E-mail"
                                    onChangeText={text => {
                                        setEmail(text);
                                    }}
                                    value={email}
                                />
                                <TextInput style={styles.input}
                                    placeholder="Nazwa użytkownika"
                                    onChangeText={text => {
                                        setUsername(text);
                                    }}
                                    value={username}
                                />
                                <TextInput style={styles.input}
                                    placeholder="Hasło"
                                    onChangeText={text => {
                                        setPassword(text);
                                    }}
                                    secureTextEntry={true}
                                    value={password}
                                />
                                <TextInput style={styles.input}
                                    placeholder="Powtórz hasło"
                                    onChangeText={text => {
                                        setRepeatPassword(text);
                                    }}
                                    secureTextEntry={true}
                                    value={repeatPassword}
                                />
                            </View>
                            <View>
                                {isLoading
                                    ?
                                    <ActivityIndicator />
                                    :
                                    <Button
                                        title="Zarejestruj się"
                                        onPress={authHandler}
                                    />
                                }
                            </View>
                        </View>
                    }
                </ScrollView>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        width: '100%',
    },
    buttonContainer: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    inputContainer: {
        width: '100%',
        marginVertical: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    input: {
        width: '75%',
        fontSize: 18,
        marginVertical: 15,
        textAlign: 'center',
    }
});

AuthScreen.navigationOptions = {
    headerShown: false
};

export default AuthScreen;