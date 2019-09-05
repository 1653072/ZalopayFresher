import React from 'react';
import './UserInfoRow.css';

class UserInfoRow extends React.Component {

    render() {
        let text, value, textwins, textdraws, textloses, valuewins, valuedraws, valueloses, className;
        className = this.props.className + " uir-labeldiv";
        
        switch (this.props.type) {
            case "displayedname":
                text = "Name:";
                value = this.props.displayedname;
                break;
            case "points":
                text = "Points:";
                value = Number(this.props.points).toLocaleString('en') + " pts";
                break;
            case "winningrate":
                text = "Winning rate:";
                value = this.props.winningrate + "%";
                break;
            case "windrawlose":
                textwins = "Wins:";
                textdraws = "Draws:";
                textloses = "Loses:";
                valuewins = this.props.wins;
                valuedraws = this.props.draws;
                valueloses = this.props.loses;
                break;
            case "username":
                text = "Username:";
                value = this.props.username;
                break;
            case "ranking":
                text = "Ranking:";
                value = this.props.ranking;
                break;
            default: break;
        }

        if (this.props.type !== "windrawlose") {
            return (
                <div className={className}>
                    <label className="uir-label"><b>{text}</b> {value}</label>
                </div>
            );
        }
        else {
            return (
                <div className={className}>
                    <label className="uir-label uir-paddingright"><b>{textwins}</b> {valuewins}</label>
                    <label className="uir-label uir-paddingright"><b>{textdraws}</b> {valuedraws}</label>
                    <label className="uir-label"><b>{textloses}</b> {valueloses}</label>
                </div>
            );
        }
    }
}

export default UserInfoRow;