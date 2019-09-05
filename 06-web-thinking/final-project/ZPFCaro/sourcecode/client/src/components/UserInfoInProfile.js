import React from 'react';
import UserAvatar from "../subcomponents/UserAvatar";
import UserInfoRow from "../subcomponents/UserInfoRow";
import './UserInfoInProfile.css';

class UserInfo extends React.Component {

    renderInfoRowByType = (type) => {
        switch (type) {
            case "username":
                return (
                    <UserInfoRow type={type} username={this.props.username} className="uiip-space" />
                );
            case "displayedname":
                return (
                    <UserInfoRow type={type} displayedname={this.props.displayedname} className="uiip-space" />
                );
            case "points":
                return (
                    <UserInfoRow type={type} points={this.props.points} className="uiip-space" />
                );
            case "winningrate":
                return (
                    <UserInfoRow type={type} winningrate={this.props.winningrate} className="uiip-space" />
                );
            case "ranking":
                return (
                    <UserInfoRow type={type} ranking={this.props.ranking} className="uiip-space" />
                );
            case "windrawlose":
                return (
                    <UserInfoRow type={type} wins={this.props.wins} draws={this.props.draws} loses={this.props.loses} className="uiip-space" />
                );
            default: break;
        }
    }

    render() {
        return (
            <div className="uiip-div">
                <div className="uiip-avatardiv">
                    <UserAvatar  />
                </div>
                <div className="uiip-labeldiv">
                    {this.renderInfoRowByType(this.props.type1)}
                    {this.renderInfoRowByType(this.props.type2)}
                    {this.renderInfoRowByType(this.props.type3)}
                    {this.renderInfoRowByType(this.props.type4)}
                </div>
            </div>
        );
    }
}

export default UserInfo;