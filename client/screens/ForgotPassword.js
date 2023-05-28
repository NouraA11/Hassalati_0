import {useState, useContext} from 'react';
import {ActivityIndicator, Image, Text, TouchableOpacity, StyleSheet, View, Dimensions } from "react-native"
import { TextInput } from 'react-native-paper';
import axios from 'axios';
import { AuthContext } from '../contexts/auth';

const ForgotPassword = ({navigation}) => {
    const [email, onChangeEmail] = useState('');
    const [password, onChangePassword] = useState('');
    const [loading , setLoading] = useState(false);
    const [visible, setVisible] = useState(false);
    const [resetCode , setResetCode] = useState('');
    //context
    const [state, setState] = useContext(AuthContext);

    const handleSubmit = async () => {
        setLoading(true);
        if ((!email)){
            alert('Email is required');
            setLoading(false)
            return; }
        try {
            const {data} = await axios.post('/forgot-password', { 
                email,
            });
            if (!data.ok) {
                alert('Something went wrong, try again.');
                setLoading(false);
            } else {
                setLoading(false);
                setVisible(true);
                console.log('reset password response =>', data);
                alert('Enter the password reset code that was sent to your email');
            }
            
        } catch (err) {
            alert('Error sending email, try again.')
            console.log(err)
            setLoading(false)
        }
    }

    const handleResetCode = async () => {
        if ((!password || !resetCode)){
            alert('All fields are required');
            setLoading(false)
            return; }
        try {
            setLoading(true);
            const {data} = await axios.post('/reset-password', { 
                email, 
                password, 
                resetCode,
            });
            console.log('reset password =>', data);
            if (data.error) {
                alert(data.error);
                setLoading(false);
            } else {
                setLoading(false);
                alert('Now you can sign in using the new password.');
                navigation.navigate('Signin');
            }
        } catch (err) {
            console.log(err);
            setLoading(false)
            alert('Reset password failed, try again.')
        }
    }
    return ( 
        loading? <ActivityIndicator size="large" color="#5140B0" /> 
        : <>
        <View style={styles.mainContainer}>
            <Image style={styles.textlogoImage}
        source={require('../assets/textlogo.png')}/>
            <View style={styles.secondContainer}>
                <Text style={styles.subtitle}>
                    Forgot password
                </Text>
                <TextInput style={styles.textInput}
                autoFocus={true}
                keyboardType='email-address'
                label="Email"
                underlineColor= '#A6A6A6'
                value={email}
                onChangeText={text => onChangeEmail(text)}/>
                {visible && <>
                    <TextInput style={styles.textInput}
                    label="New password"
                    secureTextEntry={true}
                    underlineColor= '#A6A6A6'
                    value={password}
                    onChangeText={text => onChangePassword(text)}/>
                    <TextInput style={styles.textInput}
                    label="Password reset code"
                    secureTextEntry={true}
                    underlineColor= '#A6A6A6'
                    value={resetCode}
                    onChangeText={text => setResetCode(text)}/>
                </>}
                <TouchableOpacity style={styles.primaryBtn}
                onPress={visible? handleResetCode: handleSubmit}>
                <Text style={styles.primaryBtnText}>
                    {visible? "Reset password": "Request reset code"}
                </Text>
                </TouchableOpacity>
            <Text  onPress={() => navigation.navigate('Signin')} 
            style={{fontSize: 20, color: 'black', marginTop: 10}}>
                Sign in
            </Text>
        </View>
        </View>
        </> 
     );
}
 
export default ForgotPassword;

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