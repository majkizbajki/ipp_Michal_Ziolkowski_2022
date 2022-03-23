import React from "react";
import { View, Text, StyleSheet } from 'react-native';

const ShoppingListsScreen = props => {
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

export default ShoppingListsScreen;