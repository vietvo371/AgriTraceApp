import AsyncStorage from "@react-native-async-storage/async-storage";
import { CommonActions, NavigationProp } from '@react-navigation/native';
import api from "./Api";
import SCREEN_NAME from "../share";
import Toast from "react-native-toast-message";

export const saveToken = async (token: string) => {
    await AsyncStorage.setItem('token', token);
}

export const getToken = async () => {
    return await AsyncStorage.getItem('token');
}

export const removeToken = async () => {
    await AsyncStorage.removeItem('token');
}

export const checkToken = async (navigation: NavigationProp<any>) => {
    try {
        const token = await getToken();
        if (token) {
            const res = await api.get('/check-login');
            if (res.data.status) {
                if (res.data.token && res.data.token !== null) {
                    await saveToken(res.data.token);
                }
                return true;
            } else {
                navigation.dispatch(
                    CommonActions.reset({
                        index: 0,
                        routes: [{ name: SCREEN_NAME.LOGIN }],
                    })
                );
                Toast.show({
                    text1: 'Vui lòng đăng nhập hệ thống!',
                    type: 'error',
                });
                return false;
            }
        }
        return false;
    } catch (error) {
        navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [{ name: SCREEN_NAME.LOGIN }],
            })
        );
        Toast.show({
            text1: 'Vui lòng đăng nhập hệ thống!',
            type: 'error',
        });
        return false;
    }
}