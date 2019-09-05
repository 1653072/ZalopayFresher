import Message from "../subcomponents/Message";
import React from "react";
import { FormGroup, FormControl } from "react-bootstrap";
import { addMyMessage } from "../actions/chatAction";
import { connect } from "react-redux";
import { Button } from "react-bootstrap";

import io from 'socket.io-client';

import "./ChatFrame.css";
import "../subcomponents/BlackButton.css";


class ChatFrame extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      message: ""
    };
    this.handleTextChange = this.handleTextChange.bind(this);
  }

  componentWillMount() {
  }

  componentDidUpdate() {
    document
      .querySelector(".cfr-message-frame")
      .scrollTo(0, document.querySelector(".cfr-message-frame").scrollHeight);
  }

  handleTextChange(e) {
    this.setState({ message: e.target.value });
  }

  handleClick() {
    if (this.state.message.trim() == "") return;

    this.setState({ message: "" });

    this.props.addMyMessage(
      this.state.message,
    );
  }

  enterPressed(event) {
    var code = event.keyCode || event.which;
    if (code === 13) {
      this.handleClick();
    }
  }

  render() {
    return (
      <div className="cfr-chat-frame">
        <div className="cfr-display-frame">
          <div className="cfr-title">{this.props.opponent?this.props.opponent.displayedName:'Waiting...'}</div>
          <div className="cfr-message-frame">
            {this.props.messages.map(message => {
              return (
                <Message
                  type={message.type}
                  message={message.message}
                  username={this.props.username}
                  avatar={message.avatar}
                />
              );
            })}
          </div>
        </div>
        <div className="cfr-input-frame">
          <FormGroup className="cfr-input" controlId="formBasicEmail">
            <FormControl
              className="m-0"
              type="text"
              value={this.state.message}
              placeholder="Type a message..."
              autocomplete="off"
              onChange={e => {
                this.handleTextChange(e);
              }}
              onKeyPress={this.enterPressed.bind(this)}
            />
          </FormGroup>
          <Button
            type="submit"
            className="black-button cfr-btn"
            onClick={this.handleClick.bind(this)}
          >
          >
          </Button>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state, index) {
  return {
    messages: state.chatReducer.messages,
    user: state.userReducer,
    opponent: state.gameReducer.opponent
  };
}

function mapDispatchToProps(dispatch) {
  return {
    addMyMessage(message, avatar, username, type) {
      dispatch(addMyMessage(message, avatar, username, type));
    }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ChatFrame);
