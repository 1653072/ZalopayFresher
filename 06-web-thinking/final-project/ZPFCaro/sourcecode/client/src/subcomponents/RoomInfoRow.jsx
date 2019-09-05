import React from 'react';
import TitleModal from '../subcomponents/TitleModal';
import InputText from '../subcomponents/InputText';
import '../subcomponents/RectButton.css';
import './RoomInfoRow.css';
import { Row, Col, Button, Modal } from 'react-bootstrap';

import { joinGameRoom } from "../actions/roomAction";

import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

class RoomInfoRow extends React.Component {
    constructor(props) {
        super(props);
        this.state = { showJRModal: false, userRoomPassword:'' };
        this.closeModal = this.closeModal.bind(this);
        this.openModal = this.openModal.bind(this);
        this.handleJoinRoom = this.handleJoinRoom.bind(this);
        this.handleChangePasswordRoom = this.handleChangePasswordRoom.bind(this);
    }

    closeModal() {
        this.setState({ showJRModal: false });
    }

    openModal() {
        this.setState({ showJRModal: true });
    }

    handleJoinRoom(){
        this.props.joinGameRoom(this.props.user.id, this.props.user.displayedName,this.props.fullId,this.props.betpoints,this.state.userRoomPassword,this.props.history )
    }

    render() {
        let className = this.props.className + " rir-row";
        let betpts = Number(this.props.betpoints).toLocaleString('en');

        let heightModal = "rir-heightmodal"
        if (this.props.betpoints != 0 && this.props.password.length != 0) heightModal += " rir-biggestHeightModal"
        else {
            if (this.props.betpoints != 0) heightModal += " rir-pointsHeightModal"
            else
                if (this.props.password.length != 0) heightModal += " rir-passHeightModal"
        }

        return (
            <>
                <Row className={className} onClick={this.openModal}>
                    <Col xs="1" className="rir-rID">
                        <label className="rir-labelRID">{this.props.roomid}</label>
                    </Col>
                    <Col xs="7" className="rir-name">
                        <label className="rir-labelRoomName">{this.props.roomname}</label>
                        <label className="rir-labelDisplayedName text-Capitalize">> {this.props.displayedname}</label>
                    </Col>
                    <Col xs="3" className="rir-points">
                        {(() => {
                            if (this.props.betpoints != 0)  {
                                return (
                                    <div className="rir-pointsDiv">
                                        <img src={require("../media/rupee.png")} alt="bet-points-icon" className="rir-imgRupee"></img>
                                        <label className="rir-labelPoints">{betpts} pts</label>
                                    </div>
                                );
                            }
                        }) ()}
                    </Col>
                    <Col xs="1" className="rir-password">
                        {(() => {
                            if (this.props.password != null && this.props.password != '') {
                                return (
                                    <img src={require("../media/icon-room-password.png")} className="rir-imgPassword"></img>
                                );
                            }
                        }) ()}
                    </Col>
                </Row>

                <Modal show={this.state.showJRModal} onHide={this.closeModal} className={heightModal}>
                    <TitleModal text="join room" className="rir-marginbot" />
                    <div className="rir-marginbot rir-roominfo">
                        <div><label className="rir-label rir-lbhead">{this.props.roomname}</label></div>
                        <div>
                            <label className="rir-label rir-lbroomid">{this.props.roomid}</label>
                            <label className="rir-label rir-labelPadding">-</label>
                            <label className="rir-label">{this.props.displayedname}</label>
                        </div>
                        {(() => {
                            if (this.props.betpoints != 0)  {
                                return (
                                    <div><label className="rir-labelPoints">{betpts} pts</label></div>
                                );
                            }
                        }) ()}
                    </div>
                    {(() => {
                        if (this.props.password != "" && this.props.password != null) {
                            return (
                                <div className="rir-marginbot">
                                    <InputText 
                                    onChangeValue={this.handleChangePasswordRoom}
                                    type="roompassword"
                                    value={this.state.userRoomPassword}
                                    />
                                </div>
                            );
                        }
                    }) ()}
                    <div>
                        <Button className="rect-btn text-black small-width background-gray btn-for-modal rir-marginRight" onClick={this.closeModal}>back</Button>
                        <Button onClick={this.handleJoinRoom} className="rect-btn text-black btn-for-modal small-width">join</Button>
                    </div>
                </Modal>
            </>
        );
    }

    handleChangePasswordRoom(value) {
        this.setState({ userRoomPassword: value });
      }
    
}




function mapStateToProps(state, index) {
  return {
    user: state.userReducer
  };
}

function mapDispatchToProps(dispatch) {
  return {
    joinGameRoom(userId, displayedName, roomId, betPoints,password ,history) {
      return dispatch(joinGameRoom(userId, displayedName, roomId, betPoints,password ,history));
    },
  };
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(RoomInfoRow)
);
      
