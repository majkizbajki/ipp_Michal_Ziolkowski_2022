import React from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import ShoppingListsScreen from '../screens/list/ShoppingListsScreen';
import EditUserDataScreen from '../screens/user/EditUserDataScreen';
import FriendsScreen from '../screens/friends/FriendsScreen';
import MenuScreen from '../screens/menu/MenuScreen';
import AuthScreen from '../screens/user/AuthScreen';

const defaultNavOptions = {
    
};

const AuthNavigator = createStackNavigator({
    Auth: AuthScreen,
});

const MenuNavigator = createStackNavigator({
    Menu: MenuScreen,
    UserData: EditUserDataScreen,
    List: ShoppingListsScreen,
    Friends: FriendsScreen,
});

const MainNavigator = createSwitchNavigator({
    Auth: AuthNavigator,
    Menu: MenuNavigator,
});

export default createAppContainer(MainNavigator);