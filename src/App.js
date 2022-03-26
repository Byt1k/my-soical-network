import './zeroing.css';
import './App.css';
import Navbar from './components/Navbar/Navbar';
import {Routes, Route} from "react-router";
import Login from "./components/Login/Login";
import HeaderContainer from "./components/Header/HeaderContainer";
import ProfileContainer from "./components/Profile/ProfileContainer";
import DialogsContainer from "./components/Dialogs/DialogsContainer";
import UsersContainer from './components/Users/UsersContainer'
import React, {useEffect, useState} from "react";
import {connect, Provider} from "react-redux";
import Preloader from "./components/common/Preloader/Preloader";
import {initializeApp} from "./redux/app-reducer";
import store from "./redux/redux-store";
import {BrowserRouter, HashRouter} from "react-router-dom";
import Modal from "./components/common/Modal/Modal";
import ProfileEditDataForm from "./components/Profile/ProfileInfo/ProfileEditDataForm/ProfileEditDataForm";
import {updateMainPhoto, updateProfileData} from "./redux/profile-reducer";
import UploadAvatarForm from "./components/Profile/ProfileInfo/UploadAvatarForm/UploadAvatarForm";

let AppContainer = props => {
    useEffect(() => props.initializeApp())

    // редактирование профиля
    let [editModeProfileData, setEditModeProfileData] = useState(false);
    const saveProfileData = profileData => {
        props.updateProfileData(profileData).then(() => setEditModeProfileData(false))
    }

    // загрузка аватара
    let [photoUploadMode, setPhotoUploadMode] = useState(false);
    const saveMainPhoto = e => {
        props.updateMainPhoto(e.target.files[0]);
        setPhotoUploadMode(false);
    }

    if (!props.initialized) {
        return (
            <div className="startAppPreloader">
                <Preloader/>
            </div>
        )
    }

    return (
        <div className="wrapper">
            <HeaderContainer/>
            <div className="container">
                <Navbar authorizedUserId={props.authorizedUserId}/>
                <div className="content">
                    <Routes>
                        <Route path='/profile/:userId' element={<ProfileContainer/>}/>
                        <Route path='/profile' element={<ProfileContainer setEditModeProfileData={setEditModeProfileData} setPhotoUploadMode={setPhotoUploadMode}/>}/>
                        <Route path='/dialogs/*' element={<DialogsContainer/>}/>
                        <Route path='/users' element={<UsersContainer/>}/>
                        <Route path='/login' element={<Login/>}/>
                    </Routes>
                </div>
            </div>
            {/* Модальное окно редактирования профиля*/}
            <Modal active={editModeProfileData} setActive={setEditModeProfileData}>
                <ProfileEditDataForm initialValues={props.profile} onSubmit={saveProfileData}/>
            </Modal>
            {/* Модальное окно загрузки аватара */}
            <Modal active={photoUploadMode} setActive={setPhotoUploadMode}>
                <UploadAvatarForm updateMainPhoto={saveMainPhoto}/>
            </Modal>
        </div>
    );
}

let mapStateToProps = state => ({
    initialized: state.app.initialized,
    authorizedUserId: state.auth.userId,
    profile: state.profilePage.profile
})

AppContainer = connect(mapStateToProps, {initializeApp, updateProfileData, updateMainPhoto})(AppContainer);

const App = props => {
    return (
        // BrowserRouter should be used
        // HashRouter used only of deploy on GitHub Pages
        <BrowserRouter>
            <Provider store={store}>
                <AppContainer/>
            </Provider>
        </BrowserRouter>
    )
}

export default App;