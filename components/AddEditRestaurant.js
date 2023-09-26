import * as React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Alert,
    ScrollView,
    SafeAreaView,
} from 'react-native';

import { useEffect, useState } from "react";
import { getDatabase, ref, push, update } from "firebase/database";

function Add_edit_Restaurant({ navigation, route }) {

    const db = getDatabase();

    const initialState = {
        restaurantName: '',
        placering: '',
        prisLeje: '',
        rating: ''
    }

    const [newRestaurant, setNewRestaurant] = useState(initialState);

    /*Returnere true, hvis vi er på edit restaurant*/
    const isEditRestaurant = route.name === "Edit Restaurant";

    useEffect(() => {
        if (isEditRestaurant) {
            const restaurant = route.params.restaurant[1];
            setNewRestaurant(restaurant)
        }
        /*Fjern data, når vi går væk fra screenen*/
        return () => {
            setNewRestaurant(initialState)
        };
    }, []);

    const changeTextInput = (name, event) => {
        setNewRestaurant({ ...newRestaurant, [name]: event });
    }

    const handleSave = async () => {

        const { restaurantName, placering, prisLeje, rating } = newRestaurant;

        if (restaurantName.length === 0 || placering.length === 0 || prisLeje.length === 0 || rating.length === 0) {
            return Alert.alert('Et af felterne er tomme!');
        }

        if (isEditRestaurant) {
            const id = route.params.restaurant[0];
             // Definer stien til den specifikke restaurant-node, jeg vil opdatere
            const restaurantRef = ref(db, `Restaurants/${id}`);

             // Definer de felter, jeg vil opdatere
            const updatedFields = {
                restaurantName,
                placering,
                prisLeje,
                rating,
            };

             // Her bruger jeg 'update'-funktionen til at opdatere de angivne felter
            await update(restaurantRef, updatedFields)
                .then(() => {
                    Alert.alert("Din info er nu opdateret");
                    const restaurant = newRestaurant
                    navigation.navigate("Restaurant Details", { restaurant });
                })
                .catch((error) => {
                    console.error(`Error: ${error.message}`);
                });

        } else {
             // Definer stien til noden "Restaurants", hvor jeg vil tilføje de nye data
            const restaurantsRef = ref(db, "/Restaurants/");

            // Data, der skal tilføjes
            const newRestaurantData = {
                restaurantName,
                placering,
                prisLeje,
                rating,
            };

            // Tilføj de nye data til noden "Restaurants"
            await push(restaurantsRef, newRestaurantData)
                .then(() => {
                    Alert.alert("Saved");
                    setNewRestaurant(initialState);
                })
                .catch((error) => {
                    console.error(`Error: ${error.message}`);
                });
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                {
                    Object.keys(initialState).map((key, index) => {
                        return (
                            <View style={styles.row} key={index}>
                                <Text style={styles.label}>{key}</Text>
                                <View style={styles.inputContainer}>
                                    <TextInput
                                        value={newRestaurant[key]}
                                        onChangeText={(event) => changeTextInput(key, event)}
                                        style={styles.input}
                                    />
                                </View>
                            </View>
                            
                        )
                    })
                }
                {/*Hvis vi er inde på edit restaurant, vis save changes i stedet for add restaurant*/}
                <TouchableOpacity style={styles.addButton} onPress={() => handleSave()}>
                    <Text style={styles.addButtonText}>{isEditRestaurant ? "Save Changes" : "Add Restaurant"}</Text>
                </TouchableOpacity>

                 <SafeAreaView style={styles.container}>
                 <ScrollView>
                 {/* (eksisterende kode) */}
                 </ScrollView>
                 <Text style={styles.adminText}>Kun adgang for admin</Text>
                 </SafeAreaView>

            </ScrollView>
        </SafeAreaView>
    );
}


export default Add_edit_Restaurant;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        padding: 20,
    },
    row: {
        flexDirection: 'row',
        height: 60,
        marginBottom: 15,
        alignItems: 'center',
    },
    label: {
        fontWeight: 'bold',
        width: 120,
        fontSize: 14,
        // move from the edge of the screen
        marginLeft: 10,
    },
    inputContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingHorizontal: 10,
    },
    input: {
        flex: 1,
        fontSize: 14,
        textAlign: 'left',
        borderWidth: 1.2,
        borderColor: 'gray',
        borderRadius: 5,
        padding: 5,
    },
    addButton: {
        backgroundColor: 'gray', // Changed to gray
        alignItems: 'center',
        justifyContent: 'center',
        padding: 8, // Reduced padding
        borderRadius: 17,
        marginTop: 10,
        // Added shadow
        shadowColor: 'black',
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 2,
        // make to button less wide
        width: 250,
        alignSelf: 'center',

    },
    addButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },

    adminText: {
        fontSize: 12,
        color: 'red', // Du kan tilpasse farven efter behov
        textAlign: 'center',
        marginTop: 10,
    }
    
});





