import React from "react";
import "./Profile.css";
import "../subcomponents/RectButton.css";
import "../subcomponents/CircleButton.css";
import TitleModal from "../subcomponents/TitleModal";
import EditText from "../subcomponents/EditText";
import UserInfoInProfile from "./UserInfoInProfile";
import { Modal, Button } from "react-bootstrap";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import {
  updateDisplayedName,
  updatePassword,
  updateEmail
} from "../actions/userAction";

class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showProfileModal: false,
      showChangePassword: false,
      toggleDisplayedName: false,
      toggleEmail: false
    };

    this.closeModal = this.closeModal.bind(this);
    this.openModal = this.openModal.bind(this);

    this.toggleChangePassword = this.toggleChangePassword.bind(this);

    this.handleSubmit = this.handleSubmit.bind(this);

    this.handleChangeDisplayedName = this.handleChangeDisplayedName.bind(this);
    this.handleChangeEmail = this.handleChangeEmail.bind(this);
    this.handleChangeCurrentPassword = this.handleChangeCurrentPassword.bind(
      this
    );
    this.handleChangeNewPassword = this.handleChangeNewPassword.bind(this);
  }

  closeModal() {
    this.setState({
      showProfileModal: false,
      displayedNameMessage: "",
      emailMessage: "",
      passwordMessage: ""
    });
  }

  openModal() {
    this.setState({ showProfileModal: true });
  }

  toggleChangePassword() {
    this.setState({ showChangePassword: !this.state.showChangePassword });
  }

  render() {
    let classNameHeightmodal = "prof-heightmodal";
    let classNameEmailMess =
      "prof-label prof-message " + this.state.emailMessageType;
    let classNameDisplayedNameMess =
      "prof-label prof-message " + this.state.displayedNameMessageType;
    let classPasswordMess =
      "prof-label prof-message " + this.state.passwordType;

    return (
      <>
        <Button
          className="h-icon circleButton fa fa-user"
          onClick={this.openModal}
          title="Profile"
        ></Button>

        <Modal
          show={this.state.showProfileModal}
          onHide={this.closeModal}
          className={
            classNameHeightmodal +
            " " +
            (this.state.showChangePassword ? "updateHeightModal" : "")
          }
        >
          <TitleModal text="profile" className="prof-marginbot" />
          <form onSubmit={this.handleSubmit}>
            <div className="prof-paddingbot">
              <UserInfoInProfile
                type1="username"
                username={this.props.user.username}
                type2="points"
                points={this.props.user.points}
                type3="ranking"
                ranking={this.props.user.ranking}
                type4="winningrate"
                winningrate={this.props.user.winningRate}
              />
            </div>
            <div className="prof-paddingbot">
              <label className="prof-label prof-windrawlose">
                <b className="prof-paddingright">&#123;</b>
                <b className="prof-paddingright">Wins:</b>
                {this.props.user.winCount}
                <b className="prof-paddingleft prof-paddingright">Draws:</b>
                {this.props.user.drawCount}
                <b className="prof-paddingleft prof-paddingright">Loses:</b>
                {this.props.user.loseCount}
                <b className="prof-paddingleft">&#125;</b>
              </label>
            </div>
            <div className="prof-marginbot">
              <label className="prof-label">Displayed name</label>
              <label className={classNameDisplayedNameMess}>
                {this.state.displayedNameMessage}
              </label>
              <EditText
                type="displayedname"
                defaultValue={this.props.user.displayedName}
                onChangeValue={this.handleChangeDisplayedName}
                value={this.state.displayedName}
                toggle={this.state.toggleDisplayedName}
              />
            </div>
            <div className="prof-marginbot">
              <label className="prof-label">Email</label>
              <label className={classNameEmailMess}>
                {this.state.emailMessage}
              </label>
              <EditText
                type="email"
                defaultValue={this.props.user.email}
                onChangeValue={this.handleChangeEmail}
                value={this.state.email}
                toggle={this.state.toggleEmail}
              />
            </div>
            <div className="prof-changepassword">
              <a
                href="#"
                onClick={this.toggleChangePassword}
                className="prof-btnlabel"
              >
                <label className="prof-label">Change Password</label>
                <label className={classPasswordMess}>
                  {this.state.passwordMessage}
                </label>
              </a>
              {this.state.showChangePassword && (
                <>
                  <EditText
                    type="password"
                    onChangeValue={this.handleChangeCurrentPassword}
                    value={this.state.currentPassword}
                  />

                  <div className="prof-margintop">
                    <label className="prof-label">New Password</label>
                    <EditText
                      type="newpassword"
                      onChangeValue={this.handleChangeNewPassword}
                      value={this.state.newPassword}
                    />
                  </div>
                </>
              )}
            </div>
            <div className="prof-margintop">
              <Button
                className="rect-btn text-black small-width background-gray btn-for-modal prof-marginRight"
                onClick={this.closeModal}
              >
                back
              </Button>
              <Button
                type="submit"
                className="rect-btn text-black small-width btn-for-modal"
              >
                update
              </Button>
            </div>
          </form>
        </Modal>
      </>
    );
  }

  async handleSubmit(e) {
    e.preventDefault();
    if (
      this.state.displayedName &&
      this.state.displayedName !== this.props.user.displayedName
    ) {
      let message = await this.props.updateDisplayedName(
        this.state.displayedName
      );
      this.setState({ displayedNameMessage: message.message });
      this.setState({ displayedNameMessageType: message.type });
      if (message.type === "success") {
        this.setState({ toggleDisplayedName: !this.state.toggleDisplayedName });
      }
    }
    if (this.state.email && this.state.email !== this.props.user.email) {
      let message = await this.props.updateEmail(this.state.email);
      this.setState({ emailMessage: message.message });
      this.setState({ emailMessageType: message.type });
      if (message.type === "success") {
        this.setState({ toggleEmail: !this.state.toggleEmail });
      }
    }

    if (this.state.currentPassword && this.state.newPassword) {
      if (this.state.currentPassword === this.state.newPassword) {
        this.setState({ passwordMessage: "New password must be different" });
        this.setState({ passwordType: "error" });
      } else {
        let message = await this.props.updatePassword(
          this.state.currentPassword,
          this.state.newPassword
        );
        this.setState({ passwordMessage: message.message });
        this.setState({ passwordType: message.type });
      }
    }
  }

  handleChangeDisplayedName(value) {
    this.setState({ displayedName: value });
  }

  handleChangeCurrentPassword(value) {
    this.setState({ currentPassword: value });
  }

  handleChangeNewPassword(value) {
    this.setState({ newPassword: value });
  }

  handleChangeEmail(value) {
    this.setState({ email: value });
  }
}

function mapStateToProps(state, index) {
  return {
    user: state.userReducer
  };
}

function mapDispatchToProps(dispatch) {
  return {
    updateEmail(value) {
      return dispatch(updateEmail(value));
    },
    updateDisplayedName(value) {
      return dispatch(updateDisplayedName(value));
    },
    updatePassword(oldPass, newPass) {
      return dispatch(updatePassword(oldPass, newPass));
    }
  };
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Profile)
);
