import ChatFrame from "./ChatFrame";
import GameAvatar from "../subcomponents/GameAvatar";
import GameTime from "../subcomponents/GameTime";
import BetPoints from "../subcomponents/BetPoints";
import { connect } from "react-redux";

import "./GameSideBar.css";

import {wantToQuitGame} from '../actions/gameAction'

import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";

class GameSideBar extends React.Component {
  handleClick() {
    this.props.wantToQuitGame(false);
  }
  
  render() {
    let isHost = (this.props.opponent)?!this.props.opponent.isHost:false;
    let hostAvartar = this.props.user.avatar;
    let guestAvartar = "";
    let hostActive = false;
    let guestActive = false;
    if (this.props.opponent){
      hostAvartar = isHost?this.props.user.avatar:this.props.opponent.avatar
      guestAvartar = !isHost?this.props.user.avatar:this.props.opponent.avatar
      hostActive =  (!this.props.isMyTurn && this.props.opponent.isHost) || (this.props.isMyTurn && !this.props.opponent.isHost)
      guestActive = (!this.props.isMyTurn && !this.props.opponent.isHost) || (this.props.isMyTurn && this.props.opponent.isHost)
    }
    return (
      <Container  className="gsb-game-size-bar w-100 p-0" xs={3}>
        <div className="row gsb-countdown-exitbtn w-100 flex-nowrap justify-content-center ">
          <GameTime className="d-block gsb-left" />
          <Button
            className="pl-3 pr-3 d-inline-block gsb-right black-button"
            text="Exit"
            onClick={this.handleClick.bind(this)}
          >
          Exit
          </Button>
        </div>

        <div className="row betpoints">
          <BetPoints value={this.props.betPoints} />
        </div>

        <Container
          className="justify-content-center p-0 row gsb-user-info-container"
        >
          <Row className="d-flex justify-content-center">
            <Col className="gsb-game-ava-container p-0 left" sx={6}>
              <GameAvatar type={ hostActive && "active"} avatar={hostAvartar} pattern="x" />
            </Col>
            
            <Col className="gsb-game-ava-container p-0 right" sx={6}>
              <GameAvatar className={!this.props.opponent &&"not-available"} type={ guestActive && "active"} avatar={guestAvartar} pattern="o" />
            </Col>

          </Row>
        </Container>
        <div className="gsb-chat-container">
          <ChatFrame opponent={this.props.opponent} />
        </div>
      </Container>
    );
  }
}


function mapStateToProps(state, index) {
  return {
    betPoints: state.gameReducer.betPoints,
    user: state.userReducer,
    opponent: state.gameReducer.opponent,
    isMyTurn: state.gameReducer.isMyTurn,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    wantToQuitGame(isCloseModal){
      dispatch(wantToQuitGame(isCloseModal))
    },
}
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GameSideBar);


// export default GameSideBar;
