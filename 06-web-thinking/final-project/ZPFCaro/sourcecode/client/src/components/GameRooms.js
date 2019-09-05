import React from "react";
import RoomInfoRow from "../subcomponents/RoomInfoRow";
import TableTitle from "../subcomponents/TableTitle";
import "./GameRooms.css";
import { Row } from "react-bootstrap";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

class GameRooms extends React.Component {

  render() {
    const listGameRoom = [];

    for (var key in this.props.gameRooms) {
      let room = this.props.gameRooms[key];
      room.uuid = room;
      listGameRoom.push(room);
      
    }

    return (
      <div>
        <TableTitle text="GAME ROOM" className="gr-spacing-bottom" />
        <Row className="gr-row">
          {listGameRoom.map(ele => {
            if (ele.isPlaying == 0) {
              return (
                <RoomInfoRow
                fullId={ele.fullId}
                  roomid={ele.id}
                  roomname={ele.roomName}
                  displayedname={ele.hostDisplayedName}
                  betpoints={ele.betPoints}
                  password={ele.hasPassword}
                  className="spacing"
                />
              );
            }
          })}
        </Row>
      </div>
    );
  }
}

function mapStateToProps(state, index) {
  return {
    gameRooms: state.roomReducer.gameRooms
  };
}

function mapDispatchToProps(dispatch) {
  return {
    //   login(user, history) {
    //     return dispatch(login(user, history));
    //   }
  };
}
export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(GameRooms)
);
