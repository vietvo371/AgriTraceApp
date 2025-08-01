import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { DrawerItem } from "@react-navigation/drawer";
import Icon from 'react-native-vector-icons/Entypo';
import { ColorGeneral } from "../const/ColorGeneral";

type SubMenuItem = {
    label: string;
    name_icon: string;
    screen_name: string;
}

type DropdownMenuProps = {
    navigation: any;
    label: string;
    name_icon: string;
    focused: string;
    subItems: SubMenuItem[];
}

const DropdownMenu = ({ navigation, label, name_icon, focused, subItems }: DropdownMenuProps) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <View>
            <DrawerItem
                label={label}
                icon={() => (
                    <View style={styles.iconContainer}>
                        <Icon 
                            name={name_icon} 
                            style={{
                                color: subItems.some(item => item.screen_name === focused) 
                                    ? ColorGeneral.white 
                                    : ColorGeneral.black
                            }} 
                            size={24} 
                        />
                        <Icon 
                            name={isExpanded ? "chevron-down" : "chevron-right"} 
                            style={{
                                color: subItems.some(item => item.screen_name === focused) 
                                    ? ColorGeneral.white 
                                    : ColorGeneral.black
                            }} 
                            size={24} 
                        />
                    </View>
                )}
                onPress={() => setIsExpanded(!isExpanded)}
                focused={subItems.some(item => item.screen_name === focused)}
                activeBackgroundColor={ColorGeneral.primary}
                activeTintColor={ColorGeneral.white}
                style={styles.menuItem}
            />
            
            {isExpanded && (
                <View style={styles.subItemsContainer}>
                    {subItems.map((item, index) => (
                        <DrawerItem
                            key={index}
                            label={item.label}
                            icon={() => (
                                <Icon 
                                    name={item.name_icon} 
                                    style={{
                                        color: focused === item.screen_name 
                                            ? ColorGeneral.primary 
                                            : ColorGeneral.black
                                    }} 
                                    size={20} 
                                />
                            )}
                            onPress={() => navigation.navigate(item.screen_name)}
                            focused={focused === item.screen_name}
                            activeBackgroundColor={ColorGeneral.white}
                            activeTintColor={ColorGeneral.primary}
                            style={styles.subItem}
                        />
                    ))}
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    iconContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: 60,
        justifyContent: 'space-between'
    },
    subItemsContainer: {
        marginLeft: 10
    },
    subItem: {
        marginHorizontal: 0,
        marginVertical: 0,
        padding: 0,
        borderRadius: 8,
    },
    menuItem: {
        marginHorizontal: 0,
        marginVertical: 0,
        padding: 0,
        borderRadius: 8,
    }
});

export default DropdownMenu; 