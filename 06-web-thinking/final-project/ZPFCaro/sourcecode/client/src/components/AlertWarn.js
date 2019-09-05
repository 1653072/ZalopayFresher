import React from 'react';
import './AlertWarn.css';
import '../subcomponents/RectButton.css';
import { Modal, Button } from 'react-bootstrap';
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import {leaveGame,wantToQuitGame} from '../actions/gameAction'

// -------------------------------
// TEST ALERTWARN
// -------------------------------
// Cho phép truyền msg="Blabla" và numBtn="1" (hoặc numBtn="2")
// Mặc định numBtn = 1
// ReactDOM.render(<AlertWarn />, document.getElementById('root'));
// ReactDOM.render(<AlertWarn msg="Hello guys, how are u?"/>, document.getElementById('root'));
// ReactDOM.render(<AlertWarn msg="Hello guys, how are u?" numBtn="2"/>, document.getElementById('root'));


class AlertWarn extends React.Component {
    constructor(props) {
        super(props);
        this.state = { showAWModal: this.props.isOpen};
        this.closeModal = this.closeModal.bind(this);
        this.openModal = this.openModal.bind(this);
        this.handleExit = this.handleExit.bind(this);
    }

    componentWillReceiveProps(nprops){
        if (nprops.isOpen != this.state.showAWModal){
            this.setState({showAWModal:nprops.isOpen})
        }
    }

    closeModal() {
        this.props.wantToQuitGame(true);
        this.setState({ showAWModal: false });
    }

    openModal() {
        this.setState({ showAWModal: true });
    }

    handleExit(){
        this.props.leaveGame(this.props.history,this.props.quitType);
    }

    render() {
        let className = "alertwarn-heightmodal "
        let numBtn = 1
        if (this.props.numBtn == "2") numBtn = 2
        let msg = this.props.msg    // "Are you sure to quit the game? You will lose!"
        if (msg != undefined && msg != null & msg.length > 34) {
            className += "alertwarn-biggerheightmodal"
        }

        return (
            <>
                
                <Modal show={this.state.showAWModal} onHide={this.closeModal} className={className}>
                    <div className="alertwarn-marginbot alertwarn-margintop">
                        <img src={require('../media/warning.png')} alt="Warning img" className="alertwarn-imgStyle"/>
                    </div>
                    <div className="alertwarn-paddingbot alertwarn-labelHead">
                        <label className="aboutus-label">WARNING</label>
                    </div>
                    <div className="alertwarn-labelContent">
                        <label className="alertwarn-label">{msg}</label>
                    </div>
                    <div className="alertwarn-margintop">
                        {
                            (numBtn == 1) ? 
                            (
                                <Button className="rect-btn text-black small-width btn-for-modal" onClick={this.closeModal}>ok</Button>
                            ) : 
                            (
                                <>
                                <Button className="rect-btn text-black small-width background-gray btn-for-modal alertwarn-marginRight" onClick={this.closeModal}>cancel</Button>
                                <Button className="rect-btn text-black small-width btn-for-modal"
                                onClick ={this.handleExit}>ok</Button>
                                </>
                            )
                        }
                    </div>
                </Modal>
            </>
        );
    }
}


function mapStateToProps(state, index) {
  return {
      quitType: state.gameReducer.quitType
  };
}

function mapDispatchToProps(dispatch) {
  return {
    leaveGame(history,type) {
      return dispatch(leaveGame(history,type));
    },
    wantToQuitGame(isCloseModal,isLogOut) {
      dispatch(wantToQuitGame(isCloseModal, isLogOut));
    }
  };
}
export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(AlertWarn)
);