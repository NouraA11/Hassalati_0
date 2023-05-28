import {useState, useContext, useEffect} from 'react';
import {ActivityIndicator, SafeAreaView, Image, Text, TouchableOpacity, StyleSheet, View} from "react-native"
import { TextInput } from 'react-native-paper';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../contexts/auth';
import BottomNavBar from "../components/nav/BottomNavBar";
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import * as ImagePicker from 'expo-image-picker';

const Account = ({navigation}) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading , setLoading] = useState(false);
    
    const [uploadImg, setUploadImg] = useState('');//used to display new image faster
    const [image, setImage] = useState({ url: "", public_id: ""});
    //context
    const [state, setState] = useContext(AuthContext);

    useEffect(()=> {
        if (state) {
            const {name, email, image} = state.user;
            setName(name);
            setEmail(email);
            setImage(image)
        }
    }, [state])

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const {data} = await axios.post("/update-password", { password });
            if (data.error) {
                alert(data.error);
                setLoading(false);
            } else {
                alert("Password updated");
                setPassword('');
                setLoading(false);
            }
        } catch (err) {
            console.log(err)
            setLoading(false)
        }
    }

    const handleUpload = async () => {
        let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permissionResult.granted === false ) {
            alert('Image library access is required')
            return
        }
        //if permission granted 
        let pickerResult = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            aspect: [4, 3],
            base64: true,
        })
        if (pickerResult.canceled === true){
            setImage({ url: "", public_id: ""})
            return;
        }
        //save image to state
        let base64Img = await `data:image/jpg;base64,${pickerResult.base64}`;
        setUploadImg(base64Img);

        //send image to backend
        const { data } = await axios.post("/upload-image", {
            image: base64Img,
        });
        console.log("uploaded response =>", data);
        const as = JSON.parse(await AsyncStorage.getItem("@auth"));
        as.user = data; //update user info in async storage
        await AsyncStorage.setItem("@auth", JSON.stringify(as));

        setState({...state, user: data }); //update context
        setImage(data.image);
        console.log('done')
    }

    const handleSignout = async () => {
        await AsyncStorage.removeItem('@auth');
        setState({token:"", user: null});
    }

    return ( 
        loading? (<ActivityIndicator size="large" color="#5140B0" />)
            :
        <SafeAreaView style={styles.mainContainer}>
            <TouchableOpacity onPress={handleSignout}
            style={{flexDirection: 'row-reverse',
            marginLeft: 20}}>
                <FontAwesome5 name="sign-out-alt" size={30} color="black"/>
            </TouchableOpacity>
            <View style={styles.imageContainer}>
                {image && image.url !== "" && image.url != undefined? (
                    <Image source={{uri: image.url}} style={styles.profileImg} />
                ): uploadImg? (
                    <Image source={{uri: uploadImg}} style={styles.profileImg} />
                ) : (
                    <TouchableOpacity onPress={() => handleUpload()} >
                        <FontAwesome5 name="camera" size={30} color='#B7B0DB'/>
                    </TouchableOpacity>
                )}
            </View>
                {(image && image.url !== "" && image.url != undefined)|| (uploadImg)? (
                <TouchableOpacity onPress={() => handleUpload()} style={styles.uploadIcon}>
                    <FontAwesome5 name="camera" size={28} color="white"/>
                </TouchableOpacity>
                ) :(<></>)}
                
            <View style={styles.secondContainer}>
                <Text style={styles.subtitle}>
                    {name}
                </Text>
                <Text style={styles.text}>
                    {email}
                </Text>
                <TextInput style={styles.textInput}
                label="Password"
                secureTextEntry={true}
                underlineColor= '#A6A6A6'
                value={password}
                onChangeText={text => setPassword(text)}/>
                <TouchableOpacity style={styles.primaryBtn}
                onPress={handleSubmit}>
                <Text style={styles.primaryBtnText}>
                    Update password
                </Text>
                </TouchableOpacity>
        </View>
            <View style={{height: '8%', justifyContent: 'flex-end'}}>
                 <BottomNavBar />
            </View>
        </SafeAreaView>
     );
}
 
export default Account;

const styles = StyleSheet.create({
    mainContainer: {
        //flex: 1,
        backgroundColor: 'white',
        //alignItems: 'center',
        height: '100%',
        paddingTop: 40
    },
    secondContainer: {
        alignItems: 'center',
        height: '65%',
    },
    imageContainer: {
        height: 150,
        width: 150,
        borderColor: '#B7B0DB',
        borderWidth: 4,
        borderRadius: 150,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        marginBottom: 10,
    },
    profileImg: {
        width: 150, 
        height: 150,
        borderColor: '#B7B0DB',
        borderWidth: 4,
        borderRadius: 150,
    },
    uploadIcon: {
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: 170,
        right: 120,
        backgroundColor: '#B7B0DB',
        height: 45,
        width: 45,
        borderRadius: 45,
    },
    subtitle: {
        fontSize: 20,
        textAlign: 'center',
        fontWeight: '500'
    },
    text: {
        color: 'black',
        fontSize: 18,
        marginBottom: 20,
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
    textInput: {
        width: 300,
        height: 60,
        backgroundColor: 'white',
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 10
    }
})