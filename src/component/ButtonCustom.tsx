import { Button, StyleProp, StyleSheet, Text, TextStyle, TouchableOpacity, View, ViewStyle } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

interface ButtonCustomProps {
    title: string;
    onPress?: () => void;
    buttonStyle?: StyleProp<ViewStyle>;
    textStyle?: StyleProp<TextStyle>;
}

const ButtonCustom = ({ title, onPress, buttonStyle, textStyle }: ButtonCustomProps) => {
    return (
        <TouchableOpacity style={[styles.button, buttonStyle]} onPress={onPress}>
            <Text style={[styles.buttonText, textStyle]}>{title}</Text>
        </TouchableOpacity>
    );
};





const styles = StyleSheet.create({
    button: {
        height: hp('4%'),
        backgroundColor: "#9747FF",
        borderRadius: hp('1%'),
        justifyContent: 'center',
        alignItems: 'center',
    },

    buttonText: {
        color: 'white',
        fontSize: hp('1.5%'),
        fontWeight: 'bold',
    },
});

export default ButtonCustom;
