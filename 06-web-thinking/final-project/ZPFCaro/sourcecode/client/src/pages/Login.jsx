import React from "react";
import "./Login.css";
import "../subcomponents/RectButton.css";
import LogoTitle from "../subcomponents/LogoTitle";
import InputText from "../subcomponents/InputText";
import { Container, Button } from "react-bootstrap";
import { login } from "../actions/userAction";
import { connect } from "react-redux";
import { withRouter,Link } from "react-router-dom";
import { getJwtFromStorage } from "../utils/storageUtil";

class Login extends React.Component {
  constructor(props) {
    super(props);
    if(getJwtFromStorage() && getJwtFromStorage()!="")
      this.props.history.push('/');
    this.state={}
    this.handleChangeUsername = this.handleChangeUsername.bind(this);
    this.handleChangePassword = this.handleChangePassword.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.clearInputState = this.clearInputState.bind(this);
  }

  render() {
    let className =
      this.props.className + " login-container animated bounceInLeft slow";

    return (
      <Container fluid={true} className={className}>
        <form onSubmit={this.handleSubmit} className="login-modal">
          <div className="login-marginbot login-margintop">
            <LogoTitle text="ZPF Caro" />
          </div>
          <div className="login-error-message">{this.state.error}</div>
          <div className="login-marginbot">
            <InputText
              onChangeValue={this.handleChangeUsername}
              type="username"
              value={this.state.username}
            />
          </div>
          <div className="login-marginbot">
            <InputText
              onChangeValue={this.handleChangePassword}
              type="password"
              value={this.state.password}
            />
          </div>
          <div>
            <Button type="submit" className="rect-btn">login</Button>
          </div>
          <div className="login-paddingtop">
            <Link to="/forgotpassword"><a href="#" className="login-link"><label className="login-labelStyle">Forgot password?</label></a></Link>
            <label className="login-paddingLink"></label>
            <Link to='/register'><a href="#" className="login-link"><label className="login-labelStyle">Don't have account?</label></a></Link>
          </div>
        </form>
      </Container>
    );
  }

  clearInputState() {
    this.setState({
      password: "",
    });
  }

  async handleSubmit(e) {
    e.preventDefault();
    let coppyState = { ...this.state };
    let user = {
      username: coppyState.username,
      password: coppyState.password
    };
    let errorMessage = await this.props.login(user, this.props.history);
    this.setState({ error: errorMessage });
    this.clearInputState();
  }

  handleChangeUsername(value) {
    this.setState({ username: value });
  }

  handleChangePassword(value) {
    this.setState({ password: value });
  }
}

function mapStateToProps(state, index) {
  return {};
}

function mapDispatchToProps(dispatch) {
  return {
    login(user, history) {
      return dispatch(login(user, history));
    }
  };
}
export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Login)
);
