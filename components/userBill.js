import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { View, Text, TextInput, Button, Alert } from 'react-native';

import * as shopListActions from "../store/actions/shoplist";

const UserBill = props => {

    const billList = props.billList;
    const userId = props.userId;
    const person = props.person;
    const allUsers = props.allUsers;
    const shoppingList = props.shoppingList;

    const userSummary = parseFloat(billList.find(sum => sum.userId === userId).summary);
    const average = parseFloat(shoppingList.summary / billList.length).toFixed(2);
    const personSummary = parseFloat(person.summary);

    const lessThanAverage = billList.filter(sum => sum.summary < average);
    var lessThanAverageSum = 0;
    for(let i of lessThanAverage){
        lessThanAverageSum += (average - i.summary);
    }

    if (userSummary > average) {
        if(personSummary >= average){
            return null;
        }
        else if(personSummary < average){
            return (
                <View>
                    <Text>{allUsers.users.find(user => user.authId === person.userId).firstname} {allUsers.users.find(user => user.authId === person.userId).lastname} ({allUsers.users.find(user => user.authId === person.userId).username})</Text>
                    <Text>{(((average-personSummary)/lessThanAverageSum)*(userSummary-average)).toFixed(2)}</Text>
                </View>
            )
        }
    }
    else if (userSummary < average) {
        if(personSummary <= userSummary || personSummary <= average){
            return null;
        }
        else if(personSummary > userSummary && personSummary > average){
            return (
                <View>
                    <Text>{allUsers.users.find(user => user.authId === person.userId).firstname} {allUsers.users.find(user => user.authId === person.userId).lastname} ({allUsers.users.find(user => user.authId === person.userId).username})</Text>
                    <Text>{(-1*(((average-personSummary)/lessThanAverageSum)*(userSummary-average))).toFixed(2)}</Text>
                </View>
            )
        }
    }
    else {
        return null;
    }
}

export default UserBill;