import { StyleSheet, Text, TextInput, View } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

interface InputCustomProps {
    title?: string;
    placeholder?: string;
    value?: string;
    disabled?: boolean;
    onChangeText?: (text: string) => void;
    is_password?: boolean;
    type_input?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
    multiline?: boolean;
    numberOfLines?: number;
    style?: any;
}

const InputCustom = ({ 
    title, 
    placeholder, 
    value, 
    onChangeText, 
    is_password, 
    type_input, 
    disabled,
    multiline,
    numberOfLines,
    style 
}: InputCustomProps) => {
    return (
        <View style={styles.formContainer}>
            {title && <Text style={styles.titleInput}>{title}</Text>}
            <TextInput 
                placeholder={placeholder} 
                style={[styles.input, multiline && styles.multilineInput, style]}
                value={value} 
                onChangeText={onChangeText} 
                secureTextEntry={is_password} 
                keyboardType={type_input}
                editable={!disabled}
                multiline={multiline}
                numberOfLines={numberOfLines}
                textAlignVertical={multiline ? 'top' : 'center'}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    formContainer: {
        marginTop: hp('1%'),
    },
    titleInput: {
        fontSize: hp('1.8%'),
        fontWeight: 'bold',
        color: '#666',
        marginBottom: hp('0.5%'),
    },
    input: {
        borderRadius: hp('0.5%'),
        padding: hp('1.5%'),
        backgroundColor: '#f2f4f4',
        fontSize: hp('1.8%'),
        borderWidth: 1,
        borderColor: '#ddd',
    },
    multilineInput: {
        minHeight: hp('12%'),
        textAlignVertical: 'top',
    },
});

export default InputCustom;

