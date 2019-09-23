import React from 'react';
import './UserAvatar.css';
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
class UserAvatar extends React.Component {

    render() {
        return (
            <img className="ua-avatar" src={this.props.avatar} alt="profile avatar"/>
        );
    }
}


function mapStateToProps(state, index) {
    return {
        avatar:state.userReducer.avatar
    };
  }
  
  function mapDispatchToProps(dispatch) {
    return {};
  }
  export default withRouter(
    connect(
      mapStateToProps,
      mapDispatchToProps
    )(UserAvatar)
  );
  