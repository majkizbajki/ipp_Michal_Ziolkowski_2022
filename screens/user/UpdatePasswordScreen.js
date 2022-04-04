import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { View, Text, TextInput, Button, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from "@expo/vector-icons";

import * as userActions from "../../store/actions/user";

const UpdatePasswordScreen = props => {

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();
    const dispatch = useDispatch();

    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");

    // const allUsers = useSelector(state => state.users);
    // const actuallUser = allUsers.users.find(user => user.authId === allUsers.userId);

    useEffect( async () => {
        setIsLoading(true);
        await dispatch(userActions.fetchUsers()).then(() => {
            setIsLoading(false);
        });
    }, [dispatch]);

    useEffect(() => {
        if (error) {
            Alert.alert('Wystąpił błąd!', error, [{ text: 'Ok' }]);
        }
    }, [error]);

    const saveNewPasswordHandler = async () => {

        setError();
        setIsLoading(true);

        try{
            await dispatch(userActions.updatePassword(newPassword));
            props.navigation.navigate("BasicData");
        } catch(err) {
            setError(err.message);
            setIsLoading(false);
        }
    };
    
    return (
        <View style={styles.screen}>
            <View style={styles.topBar}>
                <TouchableOpacity style={styles.button} onPress={() => {
                    props.navigation.navigate("BasicData")
                }}
                >
                    <Ionicons size={60} name={'arrow-back-circle-outline'} color='black' />
                </TouchableOpacity>
            </View>
            <View>
                <Text>Zmiana hasła</Text>
            </View>
            <View>
                <Text>Nowe hasło</Text>
                <TextInput onChangeText={text => {
                    setNewPassword(text)
                }} />
            </View>
            <View>
                <Text>Powtórz nowe hasło</Text>
                <TextInput onChangeText={text => {
                    setConfirmNewPassword(text)
                }} />
            </View>
            <View>
                <Button title="Zapisz" onPress={() => {
                    saveNewPasswordHandler()
                }} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({

});

export default UpdatePasswordScreen;