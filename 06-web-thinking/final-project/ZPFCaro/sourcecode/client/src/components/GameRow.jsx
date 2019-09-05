import { connect } from "react-redux";
import { placeMyPattern } from "../actions/gameAction";
import GameCell from "../subcomponents/GameCell";
import React from "react";

class GameRow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.handlePlacePattern = this.handlePlacePattern.bind(this)
  }
  handlePlacePattern(x, y) {
    if(!this.props.isBlock && this.props.gameBoard[y][x].pattern==''){
      console.log(this.props.gameBoard[y][x].pattern);
      this.props.placeMyPattern(x, y);
    }
  }

  render() {
    let cells = [];

    for (let i = 0; i < this.props.size; i++) {
      let tmp = (
        <td onClick={() => this.handlePlacePattern(i, this.props.index)}>
            <GameCell className={this.props.isBlock && "disable"}
              pattern={this.props.gameBoard[this.props.index][i].pattern}
            >{this.props.gameBoard[this.props.index][i].pattern}</GameCell>
        </td>
      );
      cells.push(tmp);
    }

    return <tr className="gb-row">{cells}</tr>;
  }
}

function mapStateToProps(state, index) {
  return {
    gameBoard: state.gameReducer.gameBoard,
    isBlock: !state.gameReducer.isMyTurn
  };
}

function mapDispatchToProps(dispatch) {
  return {
    placeMyPattern(x, y) {
      dispatch(placeMyPattern(x, y));
    },
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GameRow);
