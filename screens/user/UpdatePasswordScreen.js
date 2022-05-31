import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { View, Text, TextInput, ScrollView, TouchableOpacity, StyleSheet, Alert, Image, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from "@expo/vector-icons";

import * as userActions from "../../store/actions/user";
import colors from "../../constants/colors";

const UpdatePasswordScreen = props => {

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();
    const dispatch = useDispatch();

    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");

    const device = Platform.OS;

    useEffect(async () => {
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

        if (newPassword === confirmNewPassword) {

            var regex = /^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9!@#$%^&*]{8,}$/;

            if (regex.test(newPassword)) {

                try {
                    await dispatch(userActions.updatePassword(newPassword));
                    props.navigation.navigate("BasicData");
                } catch (err) {
                    setError(err.message);
                    setIsLoading(false);
                }
            }
            else {
                setError("Wprowadzone hasło musi mieć minimalną długość 8 znaków, w tym jedną dużą literę, jedną małą literę, jedną cyfrę oraz jeden znak specjalny (!@#$%^&*)!");
            }
        }
        else {
            setError("Wprowadzone hasła różnią się od siebie!");
        }

    };

    if (device === "ios") {
        return (
            <View style={styles.screen}>
                <View style={styles.screenTitle}>
                    <Image style={styles.screenTitleImg} source={require('../../assets/images/background_password.png')} resizeMode={"cover"} />
                </View>
                <View style={styles.backButton}>
                    <TouchableOpacity style={styles.button} onPress={() => {
                        props.navigation.navigate("BasicData")
                    }}
                    >
                        <Ionicons size={60} name={'arrow-back-circle-outline'} color='white' />
                    </TouchableOpacity>
                </View>
                <KeyboardAvoidingView
                    behavior="padding"
                    keyboardVerticalOffset={0}
                    style={styles.formContainer}
                >
                    <View style={styles.scrollContainer}>
                        <ScrollView style={styles.scroll}>
                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>Nowe hasło</Text>
                                <TextInput secureTextEntry={true} style={styles.input} onChangeText={text => {
                                    setNewPassword(text)
                                }} />
                            </View>
                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>Powtórz nowe hasło</Text>
                                <TextInput secureTextEntry={true} style={styles.input} onChangeText={text => {
                                    setConfirmNewPassword(text)
                                }} />
                            </View>
                        </ScrollView>
                    </View>
                    <View style={styles.actionButtonContainer}>
                        <TouchableOpacity style={styles.actionButton} onPress={() => {
                            saveNewPasswordHandler();
                        }}>
                            <Text style={{ color: 'white', fontFamily: 'roboto', fontSize: 16 }}>Zapisz</Text>
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
            </View>
        );
    } else {
        return (
            <View style={styles.screen}>
                <View style={styles.screenTitle}>
                    <Image style={styles.screenTitleImg} source={require('../../assets/images/background_password.png')} resizeMode={"cover"} />
                </View>
                <View style={styles.backButton}>
                    <TouchableOpacity style={styles.button} onPress={() => {
                        props.navigation.navigate("BasicData")
                    }}
                    >
                        <Ionicons size={60} name={'arrow-back-circle-outline'} color='white' />
                    </TouchableOpacity>
                </View>
                <View style={styles.formContainer}>
                    <View style={styles.scrollContainer}>
                        <ScrollView style={styles.scroll}>
                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>Nowe hasło</Text>
                                <TextInput secureTextEntry={true} style={styles.input} onChangeText={text => {
                                    setNewPassword(text)
                                }} />
                            </View>
                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>Powtórz nowe hasło</Text>
                                <TextInput secureTextEntry={true} style={styles.input} onChangeText={text => {
                                    setConfirmNewPassword(text)
                                }} />
                            </View>
                        </ScrollView>
                    </View>
                    <View style={styles.actionButtonContainer}>
                        <TouchableOpacity style={styles.actionButton} onPress={() => {
                            saveNewPasswordHandler();
                        }}>
                            <Text style={{ color: 'white', fontFamily: 'roboto', fontSize: 16 }}>Zapisz</Text>
                        </TouchableOpacity>
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
    backButton: {
        width: '15%',
        justifyContent: 'center',
        alignItems: 'center',
        position: "absolute",
        left: 20,
        top: 20
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
        height: "70%"
    },
    scroll: {
        width: '100%',
        height: "100%",
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

export default UpdatePasswordScreen;