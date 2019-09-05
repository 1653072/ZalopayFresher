import React from "react";
import "./Register.css";
import "../subcomponents/RectButton.css";
import LogoTitle from "../subcomponents/LogoTitle";
import InputText from "../subcomponents/InputText";
import { Container, Button } from "react-bootstrap";
import { register, } from "../actions/userAction";
import { connect } from "react-redux";
import { withRouter,Link } from "react-router-dom";
import { getJwtFromStorage } from "../utils/storageUtil";

class Register extends React.Component {
  constructor(props) {
    super(props);
    if(getJwtFromStorage() && getJwtFromStorage()!="")
      this.props.history.push('/');
    this.state = {};
    this.handleChangeUsername = this.handleChangeUsername.bind(this);
    this.handleChangePassword = this.handleChangePassword.bind(this);
    this.handleChangeConfirmedpassword = this.handleChangeConfirmedpassword.bind(this);
    this.handleChangeEmail = this.handleChangeEmail.bind(this);
    this.handleChangeDisplayedname = this.handleChangeDisplayedname.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.clearInputState = this.clearInputState.bind(this);
  }

  render() {
    let className =
      this.props.className + " register-container animated bounceInLeft slow";

    return (
      <Container fluid={true} className={className}>
        <form className="register-modal" onSubmit={this.handleSubmit}>
          <div className="register-marginbot register-margintop">
            <LogoTitle text="ZPF Caro" />
          </div>
          <div className="register-error-message" >{this.state.error}</div>
          <div className="register-marginbot">
            <InputText
              onChangeValue={this.handleChangeUsername}
              type="username"
              value={this.state.username}
            />
          </div>
          <div className="register-marginbot">
            <InputText
              onChangeValue={this.handleChangePassword}
              type="password"
              value={this.state.password}
            />
          </div>
          <div className="register-marginbot">
            <InputText
              pattern={encodeURI(this.state.password)}
              onChangeValue={this.handleChangeConfirmedpassword}
              type="confirmedpassword"
              value={this.state.confirmedPassword}
            />
          </div>
          <div className="register-marginbot">
            <InputText value={this.state.email} onChangeValue={this.handleChangeEmail} type="email" />
          </div>
          <div className="register-marginbot">
            <InputText
              onChangeValue={this.handleChangeDisplayedname}
              type="displayedname"
              value={this.state.displayedName}
            />
          </div>
          <div>
            <Button type="submit" className="rect-btn">
              register
            </Button>
          </div>
          <div className="register-paddingtop">
            <Link to='/login'><a href="#" className="register-link"><label className="register-labelStyle">Back to login</label></a></Link>
          </div>
        </form>
      </Container>
    );
  }

  clearInputState() {
    this.setState({
      username: "",
      password: "",
      confirmedPassword: "",
      email: "",
    });
  }

  async handleSubmit(e) {
    e.preventDefault();
    let coppyState = { ...this.state };
    let user = {
      username: coppyState.username,
      password: coppyState.password,
      email: coppyState.email,
      displayedName: coppyState.displayedName
    };
    let errorMessage = await this.props.register(user, this.props.history);
    this.setState({error:errorMessage})
    this.clearInputState();
  }

  handleChangeUsername(value) {
    this.setState({ username: value });
  }

  handleChangeEmail(value) {
    this.setState({ email: value });
  }

  handleChangePassword(value) {
    this.setState({ password: value });
  }

  handleChangeDisplayedname(value) {
    this.setState({ displayedName: value });
  }

  handleChangeConfirmedpassword(value) {
    this.setState({ confirmedPassword: value });
  }
}


function mapStateToProps(state, index) {
  return {
  };
}

function mapDispatchToProps(dispatch) {
  return {
    register(user, history) {
      return dispatch(register(user, history));
    }
  };
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Register)
);
