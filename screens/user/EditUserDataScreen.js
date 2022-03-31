import React, { useEffect, useState } from "react";
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { View, Text, StyleSheet, Button, TouchableOpacity, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import * as userActions from '../../store/actions/user';

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

    const loadInputValues = () => {
        setEmail(actuallUser.email);
        setUsername(actuallUser.username);
        setFirstName(actuallUser.firstname);
        setLastName(actuallUser.lastname);
    };

    useEffect( async () => {
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

        try{
            await dispatch(userActions.updateUser(
                allUsers.dbname,
                actuallUser.authId,
                firstName.toString(),
                lastName.toString(),
                email.toString(),
                actuallUser.username,
                actuallUser.friends
            ));
        } catch(err) {
            setError(err.message);
            setIsLoading(false);
        }

        setIsReloading(!isReloading);
    };

    return (
        <View style={styles.screen}>
            <View style={styles.topBar}>
                <View style={styles.menuButton}>
                    <TouchableOpacity style={styles.button} onPress={() => {
                        props.navigation.goBack()
                    }}
                    >
                        <Ionicons size={60} name={'menu'} color='black' />
                    </TouchableOpacity>
                </View>
                <View style={styles.titleContainer}>
                    <Text style={{ fontSize: 22 }}>Dane użytkownika</Text>
                </View>
            </View>
            <View style={styles.formContainer}>
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
                    <TextInput style={styles.input} onChangeText={text => setUsername(text)} value={username} editable={false} />
                </View>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>E-mail</Text>
                    <TextInput style={styles.input} onChangeText={text => setEmail(text)} value={email} />
                </View>
                <View style={styles.save}>
                    <Button title="Zapisz" onPress={() => { 
                        saveUserDataHandler();
                    }} />
                </View>
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
    button: {
        justifyContent: 'center',
        alignItems: 'center'

    },
    titleContainer: {
        width: '80%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    formContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    inputContainer: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    label: {
        fontSize: 18
    },
    input: {
        width: '80%',
        height: 30,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        marginVertical: 10,
        textAlign: 'center',
    }
});

EditUserDataScreen.navigationOptions = {
    headerShown: false
};

export default EditUserDataScreen;