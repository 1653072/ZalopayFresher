import React from 'react';
import './Homepage.css';
import '../subcomponents/RectButton.css';
import Header from "../components/Header";
import UserInfo from "../components/UserInfo";
import LeaderBoard from "../components/LeaderBoard";
import GameRooms from "../components/GameRooms";
import CreateRoom from "../components/CreateRoom";
import { Container, Row, Col, Button } from 'react-bootstrap';
import {isAuthenticated} from "../utils/storageUtil";
import {Redirect} from "react-router-dom";
import { loadUserInfo } from "../actions/userAction";
import { initIo } from "../actions/ioAction";
import { loadGameRooms, initGameRoom, listenOnLoadGameRooms } from "../actions/roomAction";
import { initLeaderBoard, loadLeaderBoard, listenOnLoadLeaderBoard } from "../actions/leaderBoardAction";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import AlertWarn from '../components/AlertWarn'

class Homepage extends React.Component {
    async componentWillMount(){
        await this.props.loadUserInfo(this.props.history);
        await this.props.initIo();
        await this.props.initLeaderBoard();
        this.props.listenOnLoadGameRooms();
        this.props.listenOnLoadLeaderBoard(); 
        this.props.loadGameRooms();
        this.props.loadLeaderBoard();
    } 

    render() {
        if (!isAuthenticated()) {
            return <Redirect to="/login" />;
        }
        
        let className = this.props.className + " animated bounceInRight slow";
        return (
            <Container fluid={true} className={className}>
                <Header />
                <AlertWarn isOpen={(!this.props.error || this.props.error=='') ? false : true} msg={this.props.error}/>
                <Row className="hp-row">
                    <Col xs="8" className="hp-padRight">
                        <GameRooms />
                    </Col>
                    <Col xs="4" className="hp-padLeft">
                        <UserInfo 
                        avatar={this.props.user.avatar} 
                        type1="displayedname" 
                        displayedName={this.props.user.displayedName} 
                        type2="points" 
                        points={this.props.user.points} 
                        type3="winningrate" 
                        winningrate={this.props.user.winningRate}
                        type4="windrawlose" 
                        wins={this.props.user.winCount} 
                        draws={this.props.user.drawCount}
                        loses={this.props.user.loseCount} />
                        <LeaderBoard className="hp-margintop"/>
                        <CreateRoom/>
                        <Button className="hp-rectbtn rect-btn disable" disabled>play with npc</Button>
                    </Col>
                </Row>
            </Container>
        );
    }
}

function mapStateToProps(state, index) {
    return {
        user: state.userReducer,
        error: state.roomReducer.error,
    };
  }
  
  function mapDispatchToProps(dispatch) {
    return {
      loadUserInfo(history) {
        return dispatch(loadUserInfo(history));
      },
      initGameRoom() {
        return dispatch(initGameRoom());
      },
      initLeaderBoard() {
        return dispatch(initLeaderBoard());
      },
      initIo(){
        return dispatch(initIo());
      },
      listenOnLoadGameRooms(){
        return dispatch(listenOnLoadGameRooms());
      },
      loadGameRooms(){
        return dispatch(loadGameRooms());
      },
      loadLeaderBoard(){
        return dispatch(loadLeaderBoard());
      },
      listenOnLoadLeaderBoard(){
        return dispatch(listenOnLoadLeaderBoard())
      }
    };
  }
  
  export default withRouter(
    connect(
      mapStateToProps,
      mapDispatchToProps
    )(Homepage)
  );
  