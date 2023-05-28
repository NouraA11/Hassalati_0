import {useState, useContext} from 'react';
import {ActivityIndicator, Image, Text, TouchableOpacity, StyleSheet, View, Dimensions } from "react-native"
import { TextInput } from 'react-native-paper';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../contexts/auth';

const Signup = ({navigation}) => {
    const [email, setChangeEmail] = useState('');
    const [password, setChangePassword] = useState('');
    const [name, setName] = useState('');
    const [loading , setLoading] = useState(false);
    //context
    const [state, setState] = useContext(AuthContext);

    const handleSubmit = async () => {
        setLoading(true);
        if ((!email || !password || !name)){ 
            alert('All fields are required');
            setLoading(false)
            return; }
            //if input are valid
        try {
            const {data} = await axios.post('/signup', { 
                name,
                email,
                password,
            });

            if (data.error){
                alert(data.error);
                setLoading(false)
            }else {
                //save in context
                setState(data)
                //set response in async storage
                await AsyncStorage.setItem('@auth', JSON.stringify(data))
                setLoading(false);
                console.log('sign up success', data);
                navigation.navigate('Home');
            }
            
        } catch (err) {
            console.log(err)
            setLoading(false)
        }
    }

    return ( 
        loading? <ActivityIndicator size="large" color="#5140B0" />
        : 
        <View style={styles.mainContainer}>
            <Image style={styles.textlogoImage}
        source={require('../assets/textlogo.png')}/>
            <View style={styles.secondContainer}>
                <Text style={styles.subtitle}>
                    Welcome, start saving with us now!
                </Text>

                <TextInput style={styles.textInput}
                autoFocus={true}
                label="Name"
                underlineColor= '#A6A6A6'
                value={name}
                onChangeText={text => setName(text)}/>

                <TextInput style={styles.textInput}
                keyboardType='email-address'
                label="Email"
                underlineColor= '#A6A6A6'
                value={email}
                onChangeText={text => setChangeEmail(text)}/>

                <TextInput style={styles.textInput}
                label="Password"
                secureTextEntry={true}
                underlineColor= '#A6A6A6'
                value={password}
                onChangeText={text => setChangePassword(text)}/>

                <TouchableOpacity style={styles.primaryBtn}
                onPress={handleSubmit}>
                <Text style={styles.primaryBtnText}>
                    Create account
                </Text>
                </TouchableOpacity>
                <View style={styles.optionsContainer}>
                    <Text style={styles.text}>
                        Already have an account?
                    </Text>
                    <TouchableOpacity style={styles.secondaryBtn}
                    onPress={() => navigation.navigate('Signin')}>
                    <Text style={styles.secondaryBtnText}>
                        Sign in
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
        </View>
     );
}
 
export default Signup;

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: 'white',
        alignItems: 'center',
        height: Dimensions.get('window').height,
        paddingTop: 40
    },
    secondContainer: {
        alignItems: 'center',
    },
    subtitle: {
        fontSize: 20,
        textAlign: 'center',
        marginVertical: 20,
        fontWeight: '500'
    },
    text: {
        color: 'grey',
        fontSize: 18,
    },
    primaryBtn: {
        backgroundColor: '#5140B0',
        color: 'white',
        borderRadius: 10,
        width: 300,
        alignItems: 'center',
        paddingTop: 5,
        paddingBottom: 5,
        marginTop: 20,
    },
    primaryBtnText: {
        fontSize: 20,
        fontWeight:'500',
        color: 'white'
    },
    optionsContainer: {
        alignItems: 'center',
        flexDirection: 'row',
        marginVertical: 10
    },
    secondaryBtn: {
        fontSize: 20,
        alignItems: 'center',
        paddingTop: 5,
        paddingBottom: 5,
        paddingLeft: 5,
    },
    secondaryBtnText: {
        fontSize: 20,
        fontWeight:'500',
        color: '#5140B0'
    },    
    textlogoImage: {
        marginVertical: 30,
        height: 100,
        width: 200
    },
    textInput: {
        width: 300,
        height: 60,
        backgroundColor: 'white',
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 10
    }
})