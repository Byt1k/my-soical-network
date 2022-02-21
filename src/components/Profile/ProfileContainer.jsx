import React from "react";
import Profile from "./Profile";
import {getUserProfile, getUserStatus} from "../../redux/profile-reducer";
import {connect} from "react-redux";
import {Redirect, withRouter} from "react-router-dom";
import Preloader from "../common/Preloader/Preloader";

class ProfileContainer extends React.Component {
    componentDidMount() {
        let userId = this.props.match.params.userID;
        if (!userId) {
            userId = 2;
        }
        this.props.getUserProfile(userId);
        this.props.getUserStatus(userId);
    }
    render() {
        if (!this.props.isAuth) {
            return  <Redirect to={'/login'} />
        }
        else {
            return (
                this.props.isFetching ? <Preloader /> : <Profile profile={this.props.profile} userStatus={this.props.userStatus}/>
            )
        }

    }
}

let mapStateToProps = state => {
    return ({
        profile: state.profilePage.profile,
        userStatus: state.profilePage.userStatus,
        isFetching: state.profilePage.isFetching,
        isAuth: state.auth.isAuth
    })
}

let UserUrlComponent = withRouter(ProfileContainer)

export default connect(mapStateToProps, {getUserProfile, getUserStatus})(UserUrlComponent);