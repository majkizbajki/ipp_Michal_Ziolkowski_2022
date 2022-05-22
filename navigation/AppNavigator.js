import React from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import ShoppingListsScreen from '../screens/list/ShoppingListsScreen';
import EditUserDataScreen from '../screens/user/EditUserDataScreen';
import FriendsScreen from '../screens/friends/FriendsScreen';
import MenuScreen from '../screens/menu/MenuScreen';
import AuthScreen from '../screens/user/AuthScreen';
import UpdatePasswordScreen from '../screens/user/UpdatePasswordScreen';
import CreateShoppingListScreen from '../screens/list/CreateShoppingListScreen';
import ShoppingListDetailsScreen from '../screens/list/ShoppingListDetailsScreen';
import AddProduct from '../screens/list/AddProduct';
import BillScreen from '../screens/list/BillScreen';
import ShareShoppingListScreen from '../screens/list/ShareShoppingListScreen';
import StartUpScreen from '../screens/StartUpScreen';

const defaultNavOptions = {
    headerShown: false,
};

const AuthNavigator = createStackNavigator({
    Auth: AuthScreen,
},{
    defaultNavigationOptions: defaultNavOptions,
});

const EditUserDataNavigator = createStackNavigator({
    BasicData: EditUserDataScreen,
    Password: UpdatePasswordScreen
},{
    defaultNavigationOptions: defaultNavOptions,
});

const ShopListNavigator = createStackNavigator({
    ShopListMainWindow: ShoppingListsScreen,
    ShopListDetails: ShoppingListDetailsScreen,
    CreateShopList: CreateShoppingListScreen,
    AddProduct: AddProduct,
    Bill: BillScreen,
    ShareShoppingList: ShareShoppingListScreen,
},{
    defaultNavigationOptions: defaultNavOptions,
});

const MenuNavigator = createStackNavigator({
    Menu: MenuScreen,
    UserData: EditUserDataNavigator,
    Lists: ShopListNavigator,
    Friends: FriendsScreen,
},{
    defaultNavigationOptions: defaultNavOptions,
});

const MainNavigator = createSwitchNavigator({
    StartUp: StartUpScreen,
    Auth: AuthNavigator,
    Menu: MenuNavigator,
},{
    defaultNavigationOptions: defaultNavOptions,
});

export default createAppContainer(MainNavigator);