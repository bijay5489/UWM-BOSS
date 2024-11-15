import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    createAccountButton: {backgroundColor: 'blue', padding: 15, alignItems: 'center', borderRadius: 10},
    createAccountText: {color: 'white'},
    emailContainer: {flexDirection: 'row', alignItems: 'center', borderColor: 'black', borderWidth: 1, borderRadius: 10, padding: 0, marginBottom: 5, height: 35},
    emailInput: {flex: 1, color: 'black', fontSize: 16, borderRadius: 10, borderBottomRightRadius: 0, borderTopRightRadius: 0, paddingLeft: 10, height: '100%', width: '90%'},
    emailDomain: {fontSize: 16, color: 'black', marginRight: 3},
    helperText: {fontSize: 12, color: '#b0b0b0', marginBottom: 15},
    verticalLine: {width: 2, height: '100%', backgroundColor: 'gray', marginHorizontal: 1},
});
export default styles;