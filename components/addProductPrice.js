import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { View, Text, TextInput, Button, Alert } from 'react-native';

import * as shopListActions from "../store/actions/shoplist";

const AddProductPrice = props => {

    const dispatch = useDispatch();

    const [productPrice, setProductPrice] = useState();

    return (
        <View>
            <Text>{props.product["name"]}</Text>
            {props.product["price"] === undefined ?
                <TextInput placeholder="Wprowadź cenę" onChangeText={text => {
                    setProductPrice(text);
                }} />
                :
                <TextInput placeholder={"Aktualna cena: " + props.product["price"]} onChangeText={text => {
                    setProductPrice(text);
                }} />
            }
            <Button title="Zatwierdź" onPress={async () => {
                if (productPrice !== undefined) {
                    let re = /\d+\.{0,1}\d{0,2}/;
                    let number = productPrice.replace(/[, -]/g, ".")
                    if (number.match(re) !== null) {
                        if (props.product["price"] === undefined){
                            await dispatch(shopListActions.editProductPrice(props.listTitle, props.listCreator, props.product, number, "add")).then(() => { });
                        }
                        else {
                            await dispatch(shopListActions.editProductPrice(props.listTitle, props.listCreator, props.product, number, "edit")).then(() => { });
                        }
                        await dispatch(shopListActions.fetchLists()).then(() => {
                            props.returnPage();
                        });
                    }
                    else {
                        Alert.alert("Ups! Wystąpił błąd!", "Niepoprawnie wprowadzona cena produktu.", [{ text: "OK" }]);
                    }
                }
                else {
                    Alert.alert("Ups! Wystąpił błąd!", "Niepoprawnie wprowadzona cena produktu.", [{ text: "OK" }]);
                }
            }} />
        </View>
    )
}

export default AddProductPrice;