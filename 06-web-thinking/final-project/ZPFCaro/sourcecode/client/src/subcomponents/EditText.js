import React from 'react';
import './EditText.css';
import { InputGroup, FormControl } from 'react-bootstrap';

class EditText extends React.Component {

    constructor(props) {
      super(props);
      this.state = { 
          disabled: "disabled",
          value: this.props.defaultValue,
          typePassword: "password"};
      this.doEdit = this.doEdit.bind(this);
      this.handleClick = this.handleClick.bind(this);
    }

    componentWillReceiveProps(newProps){
        if(newProps.toggle != this.props.toggle){
            this.setState({ disabled: "disabled" });
        }
    }

    doEdit(e, disableNewPass) {
        e.preventDefault();
        if (disableNewPass == 1) { 
            if (this.state.disabled == "disabled") {
                this.setState({ disabled: "" });
                this.setState({value: (this.props.value)?undefined:this.props.value});
            }
            else {
                this.setState({value:this.props.defaultValue})
                this.setState({ disabled: "disabled" });
            }  
        }
        else { // disableNewPass == 2 : Convert Type password to Type text and vice versa (ngược lại).
            if (this.state.typePassword == "password") {
                this.setState({ typePassword: "text" });
            }
            else {
                this.setState({ typePassword: "password" });
            }
        }
    }

    handleClick = function(e) {
        this.props.onChangeValue(e.target.value);
    }

    render() {
        let icon, alt, placeholder, type, pattern, title, required, valueInput, disableNewPass;

        if (this.props.type == "newpassword" || this.props.type == "password") {
            icon = require("../media/icon-seen.png");
            disableNewPass = 2; //false => never disable this input type
        }
        else {
            icon = require("../media/icon-edit.png");
            disableNewPass = 1; //true
        }
        
        switch (this.props.type) {
            case "password":
                alt = "icon-password";
                type = this.state.typePassword;
                placeholder = "Old Password";
                pattern = ".{6,}";
                title = "Password contains at least 6 characters";
                required = "required";
                break;
            case "newpassword":
                alt = "icon-password";
                type = this.state.typePassword;
                placeholder = "New Password";
                pattern = ".{6,}";
                title = "Password contains at least 6 characters";
                required = "required";
                break;
            case "email":
                alt = "icon-email";
                type = "email";
                valueInput = this.props.defaultValue
                pattern = "[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$";
                required = "required";
                break;
            case "displayedname":
                alt = "icon-displayed-name";
                type = "text";
                valueInput = this.props.defaultValue;
                pattern = ".{5,25}";
                title = "Displayed name contains 5 to 25 characters";
                required = "required";
                break;
            default:
                break;
        }

        return (
            <InputGroup className="input-text">
                <FormControl disabled={(this.state.disabled!="") && (disableNewPass==1)}
                    placeholder={placeholder}
                    type={type}
                    pattern={pattern}
                    title={title}
                    value={this.state.value}
                    required={required}
                    onChange={this.handleClick}
                    className="no-border-right"
                />
                <InputGroup.Append>
                    <InputGroup.Text className="edit-text">
                        <a href="#" onClick={e => this.doEdit(e, disableNewPass)}>
                            <img src={icon} alt={alt}/>
                        </a>
                    </InputGroup.Text>
                </InputGroup.Append>
            </InputGroup>
        );
    }
}

export default EditText;