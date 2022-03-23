import React from "react";
import { View, Text, StyleSheet } from 'react-native';

const EditUserDataScreen = props => {
    return (
        <View style={styles.screen}>
            <Text>Auth</Text>
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

export default EditUserDataScreen;