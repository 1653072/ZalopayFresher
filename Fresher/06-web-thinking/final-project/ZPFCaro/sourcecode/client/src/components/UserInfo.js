import React from 'react';
import UserAvatar from "../subcomponents/UserAvatar";
import UserInfoRow from "../subcomponents/UserInfoRow";
import './UserInfo.css';

class UserInfo extends React.Component {

    renderInfoRowByType = (type) => {
        switch (type) {
            case "username":
                return (
                    <UserInfoRow type={type} username={this.props.username} className="ui-space" />
                );
            case "displayedname":
                return (
                    <UserInfoRow type={type} displayedname={this.props.displayedName} className="ui-space" />
                );
            case "points":
                return (
                    <UserInfoRow type={type} points={this.props.points} className="ui-space" />
                );
            case "winningrate":
                return (
                    <UserInfoRow type={type} winningrate={this.props.winningrate} className="ui-space" />
                );
            case "ranking":
                return (
                    <UserInfoRow type={type} ranking={this.props.ranking} className="ui-space" />
                );
            case "windrawlose":
                return (
                    <UserInfoRow type={type} wins={this.props.wins} draws={this.props.draws} loses={this.props.loses} className="ui-space" />
                );
            default: break;
        }
    }

    render() {
        return (
            <div className="ui-div">
                <div className="ui-avatardiv">
                    <UserAvatar avatar={this.props.avatar} />
                </div>
                <div className="ui-labeldiv">
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