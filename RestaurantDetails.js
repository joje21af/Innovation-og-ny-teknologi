import * as React from 'react';
import { View, Text, Platform, StyleSheet, Button, Alert, TouchableOpacity } from 'react-native';

import { useEffect, useState } from "react";
import { getDatabase, ref, remove } from "firebase/database";

function RestaurantDetails({ route, navigation }) {
    const [restaurant, setRestaurant] = useState({});

    useEffect(() => {
        /*Henter restaurant values og sætter dem*/
        setRestaurant(route.params.restaurant[1]);

        /*Når vi forlader skærmen, tøm objektet*/
        return () => {
            setRestaurant({})
        }
    });

    const handleEdit = () => {
        // Vi navigerer videre til EditRestaurant skærmen og sender restauranten videre med
        const restaurant = route.params.restaurant
        navigation.navigate('Edit Restaurant', { restaurant });
    };

    // Vi spørger brugeren om han er sikker
    const confirmDelete = () => {
        /*Er det mobile?*/
        if (Platform.OS === 'ios' || Platform.OS === 'android') {
            Alert.alert('Er du sikker?', 'Vil du slette restauranten?', [
                { text: 'Annuller', style: 'cancel' },
                // Vi bruger this.handleDelete som eventHandler til onPress
                { text: 'Slet', style: 'destructive', onPress: () => handleDelete() },
            ]);
        }
    };

    const handleDelete = async () => {
        const id = route.params.restaurant[0];
        const db = getDatabase();
        // Definer stien til den specifikke restaurant, du vil fjerne
        const restaurantRef = ref(db, `Restaurants/${id}`);

        // Brug 'remove' funktionen til at slette restauranten
        await remove(restaurantRef)
            .then(() => {
                navigation.goBack();
            })
            .catch((error) => {
                Alert.alert(error.message);
            });
    };

    if (!restaurant) {
        return <Text>Ingen data</Text>;
    }

    // Alt indhold
    return (
        <View style={styles.container}>
            <View style={styles.detailsContainer}>
                <View style={styles.detailRow}>
                    <Text style={styles.label}>Restaurant Navn: </Text>
                    <Text style={styles.value}>{restaurant.restaurantName}</Text>
                </View>
                <View style={styles.detailRow}>
                    <Text style={styles.label}>Placering: </Text>
                    <Text style={styles.value}>{restaurant.placering}</Text>
                </View>
                <View style={styles.detailRow}>
                    <Text style={styles.label}>Pris Leje: </Text>
                    <Text style={styles.value}>{restaurant.prisLeje}</Text>
                </View>
                <View style={styles.detailRow}>
                    <Text style={styles.label}>Rating: </Text>
                    <Text style={styles.value}>{restaurant.rating}</Text>
                </View>
            </View>
            <TouchableOpacity style={styles.button} onPress={() => handleEdit()}>
                <Text style={styles.buttonText}>Rediger</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => confirmDelete()}>
                <Text style={styles.buttonText}>Slet</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} disabled={true}>
                <Text style={styles.buttonText}>Book Bord</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} disabled={true}>
                <Text style={styles.buttonText}>Bestil Takeaway</Text>
            </TouchableOpacity>
        </View>
    );
}

export default RestaurantDetails;

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'flex-start', padding: 20, marginTop: 40 }, // Opdateret marginTop
    detailsContainer: { marginBottom: 20 },
    detailRow: { flexDirection: 'row', marginBottom: 10 }, // Tilføjet marginBottom til detaljebjælkerne
    label: { fontSize: 18, fontWeight: 'bold', color: 'black' },
    value: { fontSize: 18, color: 'black' },
    button: {
        backgroundColor: 'gray',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 8,
        borderRadius: 10,
        marginTop: 10,
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
