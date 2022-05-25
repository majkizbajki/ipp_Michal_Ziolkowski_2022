import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useDispatch } from "react-redux";
import { Octicons, Ionicons, AntDesign, MaterialIcons } from "@expo/vector-icons";

import * as authActions from "../../store/actions/auth";
import { LogBox } from 'react-native';

import colors from "../../constants/colors";

LogBox.ignoreLogs(['Setting a timer']);

const MenuScreen = props => {

    const dispatch = useDispatch();

    return (
        <View style={styles.screen}>
            <View style={styles.screenTitle}>
                <Image style={styles.screenTitleImg} source={require('../../assets/images/background_menu.png')} resizeMode={"cover"} />
            </View>
            <View style={styles.buttonContainer}>
                <View style={styles.buttonView}>
                    <TouchableOpacity style={styles.button} onPress={() => {
                        props.navigation.navigate('UserData');
                    }}>
                        <Ionicons name="person-circle-outline" color={'white'} size={40} />
                        <Text style={styles.buttonText}>Dane użytkownika</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.buttonView}>
                    <TouchableOpacity style={styles.button} onPress={() => {
                        props.navigation.navigate('Lists');
                    }}>
                        <Octicons name="checklist" size={40} color="white" />
                        <Text style={styles.buttonText}>Listy zakupów</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.buttonView}>
                    <TouchableOpacity style={styles.button} onPress={() => {
                        props.navigation.navigate('Friends');
                    }}>
                        <AntDesign name="team" size={40} color="white" />
                        <Text style={styles.buttonText}>        Znajomi        </Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.buttonView}>
                    <TouchableOpacity style={styles.button} onPress={() => {
                        dispatch(authActions.logout());
                    }}>
                        <MaterialIcons name="logout" size={40} color="white" />
                        <Text style={styles.buttonText}>    Wyloguj się    </Text>
                    </TouchableOpacity>
                </View>
            </View>
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
        height: "25%",
        alignItems: 'center',
    },
    screenTitleImg: {
        width: "101%",
        height: "100%",
    },
    buttonContainer: {
        width: '100%',
        height: '75%',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        backgroundColor: colors.primaryColor,
    },
    buttonView: {
        width: "75%",
        height: 60,
        backgroundColor: colors.greenMain,
        borderWidth: 2,
        borderColor: colors.brownMain,
        overflow: 'hidden',
        borderRadius: 30
    },
    button: {
        width: "100%",
        height: "100%",
        flexDirection: "row",
        justifyContent: 'space-evenly',
        alignItems: 'center'
    },
    buttonText: {
        color: 'white',
        fontFamily: 'roboto',
        fontSize: 18
    }
});

MenuScreen.navigationOptions = {
    headerShown: false
};

export default MenuScreen;