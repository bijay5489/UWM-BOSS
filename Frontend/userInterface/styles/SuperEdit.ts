import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    radioContainer: {flexDirection: 'row', alignItems: 'flex-start', marginVertical: 15, justifyContent: "center"},
    radioButton: {flexDirection: 'row', alignItems: 'center', marginRight: 15},
    selectedRadio: {width: 20, height: 20, borderRadius: 10, backgroundColor: 'blue', marginRight: 10},
    unselectedRadio: {width: 20, height: 20, borderRadius: 10, borderWidth: 1, borderColor: 'gray', marginRight: 10},
    updateButton: {backgroundColor: 'blue', padding: 10, alignItems: 'center', borderRadius: 10, marginBottom: 10},
    buttonText: {color: 'white', fontSize: 16},
    radioOuterCircle: {width: 20, height: 20, borderRadius: 10, borderWidth: 1, borderColor: 'gray', justifyContent: 'center', alignItems: 'center', margin: 10},
    radioInnerCircle: {width: 10, height: 10, borderRadius: 5, backgroundColor: 'blue'},
    emailContainer: {flexDirection: 'row', alignItems: 'center', borderColor: 'black', borderWidth: 1, borderRadius: 10, padding: 0, marginBottom: 5, height: 35,},
    emailInput: {flex: 1, color: 'black', fontSize: 16, borderRadius: 10, borderBottomRightRadius: 0, borderTopRightRadius: 0, paddingLeft: 10, height: '100%', width: '90%',},
    emailDomain: {fontSize: 16, color: 'black', marginRight: 3,},
    helperText: {fontSize: 12, color: '#b0b0b0', marginBottom: 15,},
    verticalLine: {width: 2, height: '100%', backgroundColor: 'gray', marginHorizontal: 1,},
});

export default styles;