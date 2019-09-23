import React from 'react';
import './LeaderBoardInfoRow.css';

class LeaderBoardInfoRow extends React.Component {

    render() {
        let imgicon, alt, points, className;
        points = Number(this.props.points).toLocaleString('en');
        className = this.props.className + " lbir-background";
        
        switch (this.props.rank) {
            case 1:
                imgicon = require('../media/1st.png');
                alt = "icon-1st";
                break;
            case 2:
                imgicon = require('../media/2nd.png');
                alt = "icon-2nd";
                break;
            case 3:
                imgicon = require('../media/3rd.png');
                alt = "icon-3rd";
                break;
            case 4:
                imgicon = require('../media/4th.png');
                alt = "icon-4th";
                break;
            case 5:
                imgicon = require('../media/5th.png');
                alt = "icon-5th";
                break;
            case 6: 
                imgicon = require('../media/6th.png');
                alt = "icon-6th";
                break;
            default: break;
        }

        return (
            <div className={className}>
                <div className="lbir-title">
                    <a className="shine"><img className="lbir-img" src={imgicon} alt={alt}/></a>
                    <div className="lbir-displayedname text-Capitalize"><label className="lbir-label">{this.props.displayedname}</label></div>
                    <div className="lbir-points"><label className="lbir-label">{points} pts</label></div>
                </div>
            </div>
        );
    }
}

export default LeaderBoardInfoRow;