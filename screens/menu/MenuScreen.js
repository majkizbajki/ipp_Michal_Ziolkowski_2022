import React from "react";
import { View, Text, StyleSheet, Button } from 'react-native';
import { useDispatch, useSelector } from "react-redux";

import * as authActions from "../../store/actions/auth";

const MenuScreen = props => {

    const dispatch = useDispatch();

    return (
        <View style={styles.screen}>
            <View style={styles.titleContainer}>
                <Text style={{fontSize: 22}}>Menu główne</Text>
            </View>
            <View>
                <Button title="Dane użytkownika" onPress={() => {
                    props.navigation.navigate('UserData');
                }} />
            </View>
            <View>
                <Button title="Listy zakupów" onPress={() => {
                    props.navigation.navigate('Lists');
                }} />
            </View>
            <View>
                <Button title="Znajomi" onPress={() => {
                    props.navigation.navigate('Friends');
                }} />
            </View>
            <View>
                <Button title="Wyloguj" onPress={() => {
                    dispatch(authActions.logout());
                }} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
    },
    titleContainer: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 50,
    }
});

MenuScreen.navigationOptions = {
    headerShown: false
};

export default MenuScreen;