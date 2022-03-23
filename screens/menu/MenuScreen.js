import React from "react";
import { View, Text, StyleSheet } from 'react-native';

const MenuScreen = props => {
    return (
        <View style={styles.screen}>
            <Text style={{fontSize: 22}}>Praca w toku!</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
});

MenuScreen.navigationOptions = {
    headerShown: false
};

export default MenuScreen;