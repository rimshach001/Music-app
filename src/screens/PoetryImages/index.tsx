import React, { useState, useEffect } from 'react';
import { View, SafeAreaView, FlatList, Image, StyleSheet, PermissionsAndroid, TouchableOpacity, Text, Alert, Linking } from 'react-native';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import FastImage from 'react-native-fast-image';
import ImageView from "react-native-image-viewing";
import images from '../../assets/images/images';
import Header from '../../components/Header/Header';
import RNFS from 'react-native-fs'; // Import react-native-fs
import { request } from 'react-native-permissions';
import Share from 'react-native-share';
import { getData } from '../../api/Httpservice';
import Config from '../../utils/config';

const NUM_COLUMNS = 1;

const PoetryImages: React.FC<any> = ({ navigation }) => {
    const [imagesArr, setImagesArr] = useState([]);
    useEffect(() => {
        getImagesData()
    }, [])

    const getImagesData = async () => {

        await getData('getPoetryImg').then((res) => {
            setImagesArr(res.data)
            console.log("My Images data", res)
        }).catch((error) => {
            console.log("Error", error.message)
        })
    }

    const downloadImage = async (imageUrl: string) => {
        try {
            const permissionStatus = await request('android.permission.WRITE_EXTERNAL_STORAGE');
            if (permissionStatus === PermissionsAndroid.RESULTS.GRANTED) {
            const downloadDir = RNFS.DownloadDirectoryPath;
            const filename = `downloaded-image-${Date.now()}.jpg`;
            const filePath = `${downloadDir}/${filename}`;
            try {
                const response = await RNFS.downloadFile({
                    fromUrl: imageUrl,
                    toFile: filePath,
                });
                if (response) {
                    console.log('Image downloaded to:', filePath);
                    Alert.alert('Image downloaded successfully!');
                } else {
                    console.error('Image download failed with status:', response);
                    Alert.alert('Image download failed!');
                }
            } catch (error) {
                console.error('Error downloading image:', error);
                Alert.alert('Error downloading image!');
            }
            } else {
                console.log('Permission denied');
            }
        } catch (error) {
            console.error('Error requesting permission:', error);
        }
    };
    const openSettings = () => {
        Linking.openSettings();
    };
    const shareImageOnWhatsApp = async (url: any) => {
        try {
            // const permissionStatus = await PermissionsAndroid.request(
            //     PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE );
            //     console.log(permissionStatus,"get permission beta");
            // if (permissionStatus === PermissionsAndroid.RESULTS.GRANTED) {
            //     console.log('Storage Permission Granted.');
            //   } else if (permissionStatus === PermissionsAndroid.RESULTS.DENIED) {
            //     // console.log('Storage Permission Denied.');
            //     Alert.alert(
            //         'Storage Permission Required',
            //         'App needs access to your storage to read files. Please go to app settings and grant permission.',
            //         [
            //           { text: 'Cancel', style: 'cancel' },
            //           { text: 'Open Settings', onPress: openSettings },
            //         ],
            //       );
            //   } else if (permissionStatus === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
            //     console.log('Storage Permission Denied with Never Ask Again.');
            //     Alert.alert(
            //       'Storage Permission Required',
            //       'App needs access to your storage to read files. Please go to app settings and grant permission.',
            //       [
            //         { text: 'Cancel', style: 'cancel' },
            //         { text: 'Open Settings', onPress: openSettings },
            //       ],
            //     );
            //   }
            // if (permissionStatus === PermissionsAndroid.RESULTS.GRANTED) {

            const downloadDir = RNFS.DownloadDirectoryPath;
            const filename = `downloaded-image-${Date.now()}.jpg`;
            const filePath = `${downloadDir}/${filename}`;

            try {
                const response = await RNFS.downloadFile({
                    fromUrl: url,
                    toFile: filePath,
                });

                if (response) {
                    console.log('Image downloaded to:', filePath);
                    try {
                        const image = filePath; // Replace with the actual path to your image
                        const shareOptions = {
                            title: 'Share via WhatsApp',
                            url: `file://${image}`,
                            failOnCancel: false,
                            showAppsToView: ['whatsapp'],
                            social: Share.Social.WHATSAPP,
                        };
                        console.log(shareOptions.url, "----")
                        // await Share.open(shareOptions);
                        await Share.shareSingle(shareOptions);
                    } catch (error) {
                        console.error('Error sharing image on WhatsApp:', error.message);
                    }
                    Alert.alert('Image downloaded successfully!');
                } else {
                    console.error('Image download failed with status:', response);
                    Alert.alert('Image download failed!');
                }
            } catch (error) {
                console.error('Error downloading image:', error);
                Alert.alert('Error downloading image!');
            }
            // } else {
            //     console.log('Permission denied');
            // }
        } catch (error) {
            console.error('Error requesting permission:', error);
        }
        // try {
        // const image = url; // Replace with the actual path to your image
        // const shareOptions = {
        //     title: 'Share via WhatsApp',
        //     url: `file://${image}`,
        //     failOnCancel: false,
        //     showAppsToView: ['whatsapp'],
        // };
        // console.log(shareOptions.url,"----")

        // await Share.open(shareOptions);
        // } catch (error) {
        // console.error('Error sharing image on WhatsApp:', error.message);
        // }
    };
    return (
        <SafeAreaView
            style={{ flex: 1, backgroundColor: '#121212' }}>
            <Header
                title={'Poetry Images'}
                leftIcon={images.back}
                // rightIcon={icons.notification}
                leftIconPress={() => {
                    navigation.goBack();
                }}
            // onPressLogo={() => alert('Bell Press')}
            />
            <FlatList
                data={imagesArr}
                keyExtractor={(item, index) => index.toString()}
                numColumns={NUM_COLUMNS}
                renderItem={({ item, index }) => (
                    <View>
                        <View>
                            <TouchableOpacity
                                // onPress={() => togglePreviewModal(index)}
                                style={styles.imageContainer}
                            >
                                <Image source={{ uri: `${Config.BASE_URL}${item?.imgUrl}` }} style={styles.image} resizeMode='cover' />
                            </TouchableOpacity>
                        </View>
                        <View style={{
                            height: hp(13), flexDirection: 'column',
                            position: 'absolute', width: wp(100), alignItems: 'flex-end', paddingRight: wp(7), marginTop: wp(21)
                        }}>
                            <TouchableOpacity onPress={() => shareImageOnWhatsApp(`${Config.BASE_URL}${item?.imgUrl}`)} style={{ flex: 0.5, alignItems: 'center', justifyContent: 'center', }}>
                                <Image source={images.whatsapp} style={{ height: wp(6), width: wp(6) }} resizeMode='contain' />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => downloadImage(`${Config.BASE_URL}${item?.imgUrl}`)} style={{ flex: 0.5, alignItems: 'center', justifyContent: 'center', }} >
                                <Image source={images.downarrow} style={{ height: wp(6), width: wp(6) }} resizeMode='contain' />
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            />
        </SafeAreaView>
    );
};

export default PoetryImages;

const styles = StyleSheet.create({
    imageContainer: {
        flex: 1,
        margin: 2,
        alignItems: 'center',
        paddingVertical: wp(0.3),
        //   backgroundColor:'red',
        //   paddingLeft:wp(12)
    },
    image: {
        // width: Dimensions.get('window').width / NUM_COLUMNS - 6, 
        width: wp(92),
        height: wp(45),
        //   paddingVertical:wp(4),
        resizeMode: 'cover',
        borderRadius: wp(2)
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        paddingHorizontal: 8
    },
    closeButton: {
        position: 'absolute',
        top: 16,
        right: 16,
        zIndex: 1,
    },
    previewImage: {
        width: '100%',
        aspectRatio: 1,
        borderRadius: 8,
        backgroundColor: 'white',
    },
    downloadButton: {
        backgroundColor: 'rgba(176, 54, 193,1)',
        padding: 10,
        borderRadius: wp(5),
        position: 'absolute',
        bottom: hp(4),
        // right: 20,
        alignSelf: 'center',
        height: hp(5),
        width: wp(10),
    },
    buttonText: {
        color: 'white',
    },
});