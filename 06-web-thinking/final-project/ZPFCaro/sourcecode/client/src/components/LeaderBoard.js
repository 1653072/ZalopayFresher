import React from 'react';
import LeaderBoardInfoRow from '../subcomponents/LeaderBoardInfoRow';
import TableTitle from '../subcomponents/TableTitle';
import './LeaderBoard.css';

import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
class LeaderBoard extends React.Component {

    render() {
        let className = this.props.className + " lb-spacing";
        let leaderBoard = [];
        if (this.props.leaderBoard)
            this.props.leaderBoard.forEach(userRank => {
                leaderBoard.push(
                    <LeaderBoardInfoRow {...userRank} className="lb-spacing" />
                )
            });
        return (
            <div>
                <TableTitle text="LEADERBOARD" className={className}/>
                {this.props.leaderBoard.map((userRank)=>{
                    return <LeaderBoardInfoRow {...userRank} className="lb-spacing" />
                })}
                {/* {leaderBoard} */}
            </div>
        );
    }
}

function mapStateToProps(state, index) {
    return {
        leaderBoard:state.leaderBoardReducer.leaderBoard
    };
  }
  
  function mapDispatchToProps(dispatch) {
    return {
    };
  }
  export default withRouter(
    connect(
      mapStateToProps,
      mapDispatchToProps
    )(LeaderBoard)
  );
  