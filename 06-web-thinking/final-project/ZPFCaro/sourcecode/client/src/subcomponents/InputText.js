import React from 'react';
import './InputText.css';
import { InputGroup, FormControl } from 'react-bootstrap';

class InputText extends React.Component {

  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick = function(e) {
    this.props.onChangeValue(e.target.value);
  }

  render() {
    let icon, alt, placeholder, type, pattern, title, required, minpts, maxpts, maxLength;
    maxLength = this.props.maxLength

    switch (this.props.type) {
      case 'username':
          icon = require("../media/icon-user.png");
          alt = "icon-user";
          type = "text";
          placeholder = "Username";
          pattern = "[A-Za-z0-9]{5,25}";
          title = "Username contains 5 to 25 letters or numbers";
          required = "required";
          break;
      case 'password':
          icon = require("../media/icon-password.png");
          alt = "icon-password";
          type = "password";
          placeholder = "Password";
          pattern = ".{6,}";
          title = "Password contains at least 6 characters";
          required = "required";
          break;
      case 'confirmedpassword':
          icon = require("../media/icon-confirm-password.png");
          alt = "icon-confirm-password";
          type = "password";
          placeholder = "Confirmed Password";
          pattern = decodeURI(this.props.pattern);
          title = "Confirmed password does not match";
          required = "required";
          break;
      case 'email':
          icon = require("../media/icon-email.png");
          alt = "icon-email";
          type = "email";
          placeholder = "Email";
          pattern = "[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$";
          required = "required";
          break;
      case "displayedname":
          icon = require("../media/icon-displayed-name.png");
          alt = "icon-displayed-name";
          type = "text";
          placeholder = "Displayed Name";
          pattern = ".{5,25}";
          title = "Displayed name contains 5 to 25 characters";
          required = "required";
          break;
      case 'roompassword':
          icon = require("../media/icon-room-password-black.png");
          alt = "icon-room-password";
          type = "password";
          pattern = ".{2,}";
          title = "Room password contains at least 2 characters";
          placeholder = "Room Password";
          break;
      case 'betpoints':
          icon = require("../media/icon-rupee.png");
          alt = "icon-rupee";
          type = "number";
          minpts = 0;
          maxpts = this.props.max;
          placeholder = "Bet Points";
          break;
      case 'roomname':
          icon = require("../media/icon-room.png");
          alt = "icon-room";
          type = "text";
          placeholder = "Room Name";
          pattern = "^[^' '](*){1,28}([^' '])$";
          title = "At least 3 characters and beginning and end of the name cannot be spacing";
          required = "required";
          break;
      default:
          break;
    }

    return (
      <InputGroup className="input-text">
        <InputGroup.Prepend>
          <InputGroup.Text>
            <img src={icon} alt={alt}/>
          </InputGroup.Text>
        </InputGroup.Prepend>
        <FormControl
          placeholder={placeholder}
          type={type}
          pattern={pattern}
          title={title}
          required={required}
          min={minpts}
          max={maxpts}
          value={this.props.value}
          onChange={this.handleClick}
          maxlength={maxLength}
        />
      </InputGroup>
    );  
  }
}

export default InputText;