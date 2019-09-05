import React from "react";
import "./CreateRoom.css";
import "../subcomponents/RectButton.css";
import InputText from "../subcomponents/InputText";
import { Modal, Button } from "react-bootstrap";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { createGameRoom } from "../actions/roomAction";

import TitleModal from '../subcomponents/TitleModal';
class CreateRoom extends React.Component {
  constructor(props) {
    super(props);
    this.state = { showCRModal: false };

    this.closeModal = this.closeModal.bind(this);
    this.openModal = this.openModal.bind(this);

    this.handleChangeBetPoints = this.handleChangeBetPoints.bind(this);
    this.handleChangeRoomName = this.handleChangeRoomName.bind(this);
    this.handleChangeRoomPassword = this.handleChangeRoomPassword.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.clearInputState = this.clearInputState.bind(this);
  }

  closeModal() {
    this.setState({ showCRModal: false });
  }

  openModal() {
    this.setState({ showCRModal: true });
  }

  render() {
    return (
      <>
        <Button
          className="hp-margintop hp-rectbtn rect-btn"
          onClick={this.openModal}
        >
          create new
        </Button>

        <Modal
          show={this.state.showCRModal}
          onHide={this.closeModal}
          className="cr-heightmodal"
        >
        <TitleModal text="create room" className="cr-marginbot" />
          <form onSubmit={this.handleSubmit}>
            <div className="cr-marginbot">
              <InputText
                type="roomname"
                maxLength={30}
                onChangeValue={this.handleChangeRoomName}
                value={this.state.roomName}
              />
            </div>
            <div className="cr-marginbot">
              <InputText
                type="roompassword"
                maxLength={30}
                onChangeValue={this.handleChangeRoomPassword}
                value={this.state.roomPassword}
              />
            </div>
            <div className="cr-marginbot">
              <InputText
                type="betpoints"
                onChangeValue={this.handleChangeBetPoints}
                value={this.state.betPoints}
                max={this.props.user.points}
              />
            </div>
            <div>
              <Button
                className="rect-btn text-black small-width background-gray cr-marginRight btn-for-modal"
                onClick={this.closeModal}
              >
                back
              </Button>
              <Button type="submit" className="rect-btn text-black small-width btn-for-modal">
                create
              </Button>
            </div>
          </form>
        </Modal>
      </>
    );
  }

  async handleSubmit(e) {
    e.preventDefault();
    let errorMessage = await this.props.createGameRoom(
      this.props.user.id,
      this.props.user.displayedName,
      this.state.roomName,
      this.state.roomPassword,
      this.state.betPoints,
      this.props.history
    );
    this.setState({ error: errorMessage });
    this.clearInputState();
  }

  clearInputState() {
    this.setState({
      betPoints: 0,
      roomName: "",
      roomPassword: ""
      // displayedName: ""
    });
  }

  handleChangeBetPoints(value) {
    this.setState({ betPoints: value });
  }

  handleChangeRoomName(value) {
    this.setState({ roomName: value });
  }
  handleChangeRoomPassword(value) {
    this.setState({ roomPassword: value });
  }
}

//props
// User -> Host ID
// User -> points

// action
// createGameRoom

function mapStateToProps(state, index) {
  return {
    user: state.userReducer,
    socket: state.ioReducer.socket
  };
}

function mapDispatchToProps(dispatch) {
  return {
    createGameRoom(
      hostId,
      hostDisplayedName,
      roomName,
      password,
      betPoints,
      history
    ) {
      return dispatch(
        createGameRoom(
          hostId,
          hostDisplayedName,
          roomName,
          password,
          betPoints,
          history
        )
      );
    }
  };
}

// export default CreateRoom;

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(CreateRoom)
);
