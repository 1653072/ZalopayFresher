import React from "react";
import "./Login.css";
import "./RequestChangePassword.css";
import "./ResetPassword.css";
import "../subcomponents/RectButton.css";
import LogoTitle from "../subcomponents/LogoTitle";
import InputText from "../subcomponents/InputText";
import { Container, Button } from "react-bootstrap";
import { resetPassword, preResetPassword } from "../actions/userAction";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { getJwtFromStorage } from "../utils/storageUtil";

class ResetPassword extends React.Component {
  constructor(props) {
    super(props);
    if (getJwtFromStorage() && getJwtFromStorage() != "")
      this.props.history.push("/");
    this.props.preResetPassword(this.props.match.params.authentication,this.props.history);
    this.state = {
      emailType:''
    };
    this.handleChangeConfirmedPassword = this.handleChangeConfirmedPassword.bind(
      this
    );
    this.handleChangePassword = this.handleChangePassword.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  render() {
    let messageClassName = "rcp-label "+this.state.messType;
    let className =
      this.props.className + " login-container animated bounceInLeft slow";

    return (
      <Container fluid={true} className={className}>
        <form onSubmit={this.handleSubmit} className="resetpass-modal">
          <div className="login-marginbot login-margintop">
            <LogoTitle text="ZPF Caro" />
          </div>
          <div className="rcp-labeldiv">
              <label className={messageClassName}>
                {this.state.message
                  ? this.state.message
                  : "Enter new password"}
              </label>
          </div>
          <div className="login-marginbot">
            <InputText
              onChangeValue={this.handleChangePassword}
              type="password"
              value={this.state.password}
            />
          </div>
          <div className="login-marginbot">
            <InputText
              pattern={encodeURI(this.state.password)}
              onChangeValue={this.handleChangeConfirmedPassword}
              type="confirmedpassword"
              value={this.state.confirmedPassword}
            />
          </div>
          <div>
            <Button type="submit" className="rect-btn">
              Update
            </Button>
          </div>
        </form>
      </Container>
    );
  }

  async handleSubmit(e) {
    e.preventDefault();
    let coppyState = { ...this.state };
    let data = {
      authentication: this.props.match.params.authentication,
      password: coppyState.password
    };
    this.setState({password:"",confirmedPassword:""})
    let message = await this.props.resetPassword(data, this.props.history);
    this.setState({ message: message.message });
    this.setState({ messType: message.type });
    if (message.type == "success") {
      this.setState({
        message:
          "We've updated your password successfully! Back to Login in 3s"
      });
      setTimeout(
        ()=>{
          this.props.history.push('/login')
        }, 3000
      )
    }
    if (message.type == "error") {
      this.setState({
        message:
          "Something went wrong. Please try again!"
      });
    }
  }

  handleChangePassword(value) {
    this.setState({ password: value });
  }

  handleChangeConfirmedPassword(value) {
    this.setState({ confirmedPassword: value });
  }
}

function mapStateToProps(state, index) {
  return {};
}

function mapDispatchToProps(dispatch) {
  return {
    preResetPassword(authenticate,history) {
      return dispatch(preResetPassword(authenticate,history));
    },
    resetPassword(data,history) {
      return dispatch(resetPassword(data,history));
    }
  };
}
export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(ResetPassword)
);
