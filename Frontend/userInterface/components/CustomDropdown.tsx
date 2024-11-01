import React, { useState } from 'react';
import { View, Text, Modal, FlatList, TouchableOpacity, StyleSheet } from 'react-native';

// Define props interface
interface DropdownItem {
    label: string;
    value: string;
}

interface CustomDropdownProps {
    items: DropdownItem[];
    onSelect: (value: string) => void;
    placeholder: string;
    selectedValue?: string;
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({ items, onSelect, placeholder, selectedValue }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedItem, setSelectedItem] = useState<string | null>(selectedValue || null);

    const handleSelect = (item: DropdownItem) => {
        setSelectedItem(item.label);
        onSelect(item.value);
        setModalVisible(false);
    };

    return (
        <View>
            <TouchableOpacity
                style={styles.dropdown}
                onPress={() => setModalVisible(true)}
            >
                <Text>{selectedItem || placeholder}</Text>
            </TouchableOpacity>
            <Modal visible={modalVisible} transparent animationType="fade">
                <TouchableOpacity
                    style={styles.modalOverlay}
                    onPress={() => setModalVisible(false)}
                >
                    <View style={styles.modalContainer}>
                        <FlatList
                            data={items}
                            keyExtractor={(item) => item.value}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={styles.item}
                                    onPress={() => handleSelect(item)}
                                >
                                    <Text>{item.label}</Text>
                                </TouchableOpacity>
                            )}
                            ListEmptyComponent={<View style={styles.emptyList} />}
                        />
                    </View>
                </TouchableOpacity>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    dropdown: {
        padding: 15,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 12,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 3,
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
        width: '80%',
        maxHeight: '50%',
        backgroundColor: '#fff',
        borderRadius: 12,
        paddingVertical: 10,
    },
    item: {
        padding: 15,
        borderBottomWidth: 1,
        borderColor: '#ddd',
    },
    emptyList: {
        height: 50, // Controls the empty box height
    },
});

export default CustomDropdown;
