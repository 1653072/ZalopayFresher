import "./GameTime.css";
import React from "react";
import { connect } from "react-redux";
class GameTime extends React.Component {
  render() {
    let classes = "gt-game-time " + this.props.className;
    return <div className={classes}>{this.props.value}</div>;
  }
}

function mapStateToProps(state) {
  return {
    value: state.gameReducer.countDown.value,
    intervalId: state.gameReducer.countDown.intervalId
  };
}

function mapDispatchToProps(dispatch) {
  return {

  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GameTime);