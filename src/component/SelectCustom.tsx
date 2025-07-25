import { StyleSheet, Text, View } from "react-native";
import { SelectList } from "react-native-dropdown-select-list"
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

interface SelectItem {
    label: string;
    value: string | number;
}

interface SelectCustomProps {
    title: string;
    placeholder: string;
    data: SelectItem[];
    setSelected: (value: string) => void;
    value?: string;
    onChangeText?: (value: string) => void;
}

const SelectCustom = ({ title, placeholder, data, setSelected}: SelectCustomProps) => {
    return (
        <View style={styles.formContainer}>
            {title && <Text style={styles.titleInput}>{title}</Text>}
            <SelectList 
                setSelected={(val: any) => setSelected(val)} 
                data={data} 
                save="key"
                boxStyles={{
                    borderWidth: 1,
                    borderColor: '#E5E5E5',
                    borderRadius: 8,
                    marginVertical: hp('1%'),
                    padding: hp('1.5%'),
                    backgroundColor: '#f2f4f4',
                }}
                inputStyles={{
                    fontSize: wp('4%'),
                    color: '#333',
                }}
                dropdownStyles={{
                    borderWidth: 1,
                    borderColor: '#E5E5E5',
                    borderRadius: 8,
                }}
                dropdownItemStyles={{
                    paddingVertical: hp('1%'),
                    borderBottomWidth: 1,
                    borderBottomColor: '#E5E5E5',
                }}
                dropdownTextStyles={{
                    fontSize: wp('4%'),
                    color: '#333',
                }}
                placeholder={placeholder}
                searchPlaceholder="Tìm kiếm..."
            />
        </View>
        
    )
}

const styles = StyleSheet.create({
    formContainer: {
        marginTop: hp('2%'),
    },
    titleInput: {
        fontSize: hp('1.8%'),
        fontWeight: 'bold',
    },
});


export default SelectCustom;
