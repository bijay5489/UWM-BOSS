import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {flex: 1, padding: 20, backgroundColor: 'white'},
    header: {flexDirection: 'row', alignItems: 'center', marginBottom: 20},
    titleContainer: {flex: 1, alignItems: 'center'},
    title: {fontSize: 28, fontWeight: 'bold'},
    subtitle: {fontSize: 20, marginTop: 5, color: 'gray'},
    cardsContainer: {flex: 1, justifyContent: 'space-around'},
    logoutButton: {backgroundColor: 'red', padding: 15, borderRadius: 10, marginTop: 20, alignItems: 'center'},
    logoutText: {color: 'white', fontSize: 16},
    cardWrapper: {
        position: 'relative',
    },
    notificationCircle: {
        position: 'absolute',
        top: -5,
        right: -5,
        width: 15,
        height: 15,
        backgroundColor: 'red',
        borderRadius: 7.5,
        borderWidth: 2,
        borderColor: 'white',
    },
});
export default styles;