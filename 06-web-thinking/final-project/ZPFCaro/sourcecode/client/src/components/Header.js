import React from 'react';
import {clearStorage} from "../utils/storageUtil";
import {api} from "../api/api";

import LogoTitle from '../subcomponents/LogoTitle';
import './Header.css';
import '../subcomponents/CircleButton.css';
import Settings from './Settings';
import Profile from './Profile';
import Aboutus from './Aboutus';
import GameRule from './GameRule';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { logout } from "../actions/userAction";
import { wantToQuitGame } from "../actions/gameAction";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.logOut = this.logOut.bind(this);
  }

  logOut(e) {
    if (this.props.roomId && this.props.roomId != "") {
      this.props.wantToQuitGame(false,true);
    } else {
      this.props.logout(this.props.history);
    }
  }

  render() {
    return (
      <Container fluid={true}>
        <Row className="justify-content-center" className="head-row">
          <Col className="h-logo" xs={3}>
            <LogoTitle text="ZPF Caro" />
          </Col>
          <Col className="h-iconCol" xs={9}>
            <Profile />
            <GameRule />
            <Aboutus />
            {/* <Settings /> */}
            <Button
              onClick={this.logOut}
              className="h-icon circleButton fa fa-sign-out"
              title="Logout"
            ></Button>
          </Col>
        </Row>
      </Container>
    );
  }
}


function mapStateToProps(state, index) {
  return {
    roomId: state.gameReducer.roomId
  };
}

function mapDispatchToProps(dispatch) {
  return {
    logout(history) {
      dispatch(logout(history));
    },
    wantToQuitGame(isCloseModal,isLogOut) {
      dispatch(wantToQuitGame(isCloseModal, isLogOut));
    }
  };
}
  
  export default withRouter(
    connect(
      mapStateToProps,
      mapDispatchToProps
    )(Header)
  );
  