import { Modal, StyleSheet, TouchableOpacity, View, Text } from "react-native";
import { ColorGeneral } from "../const/ColorGeneral";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';

interface ModalCustomProps {
    isModalVisible: boolean;
    setIsModalVisible: (isModalVisible: boolean) => void;
    title: string;
    children: React.ReactNode;
    isAction?: boolean;
    isClose?: boolean;
    onPressAction?: () => void;
}


const ModalCustom = ({ isModalVisible, setIsModalVisible, title, children, isAction = true, isClose = true , onPressAction }: ModalCustomProps) => {
    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={isModalVisible}
            onRequestClose={() => setIsModalVisible(false)}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>{title}</Text>
                    </View>
                    
                    <View style={styles.modalBody}>
                        {children}
                    </View>

                    <View style={styles.modalFooter}>
                        {isClose && (
                                <TouchableOpacity onPress={() => setIsModalVisible(false)} style={styles.buttonClose}>
                                <Text style={styles.buttonText}>Đóng</Text>
                            </TouchableOpacity>
                        )}
                        {isAction && (
                            <TouchableOpacity 
                                onPress={() => {
                                    if (onPressAction) {
                                        onPressAction();
                                    }
                                    setIsModalVisible(false);
                                }} 
                                style={styles.buttonAction}
                            >
                                <Text style={styles.buttonText}>Thực Hiện</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: wp('80%'),
        backgroundColor: 'white',
        borderRadius: 10,
        padding: hp('2%'),
    },
    modalHeader: {
        borderBottomWidth: 1,
        borderBottomColor: '#E5E5E5',
        paddingBottom: hp('1%'),
    },
    modalTitle: {
        fontSize: wp('4.5%'),
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
    },
    modalBody: {
        gap: hp('1%'),
    },
    buttonClose: {
        width: '50%',
        padding: hp('1%'),
        borderRadius: 10,
        backgroundColor: ColorGeneral.secondary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonAction: {
        width: '50%',
        padding: hp('1%'),
        borderRadius: 10,
        backgroundColor: ColorGeneral.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: ColorGeneral.white,
        fontSize: wp('4%'),
        fontWeight: 'bold',
    },
    modalFooter: {
        marginTop: hp('2%'),
        padding: hp('1%'),
        borderTopWidth: 1,
        borderTopColor: '#E5E5E5',
        alignItems: 'center',
        justifyContent: 'space-around',
        flexDirection: 'row',
        gap: hp('1%'),
    },
});

export default ModalCustom;
