import React from 'react';
import './GameRule.css';
import '../subcomponents/RectButton.css';
import '../subcomponents/CircleButton.css';
import TitleModal from "../subcomponents/TitleModal";
import { Modal, Button } from 'react-bootstrap';

class GameRule extends React.Component {
    constructor(props) {
        super(props);
        this.state = { showGameRuleModal: false};

        this.closeModal = this.closeModal.bind(this);
        this.openModal = this.openModal.bind(this);
    }

    closeModal() {
        this.setState({ showGameRuleModal: false });
    }

    openModal() {
        this.setState({ showGameRuleModal: true });
    }

    render() {
        return (
            <>
                <Button className="h-icon circleButton fa fa-book" onClick={this.openModal} title="Game info"></Button>

                <Modal show={this.state.showGameRuleModal} onHide={this.closeModal} className="gamerule-heightmodal">
                    <TitleModal text="game info" className="gamerule-marginbot" />
                    <div className="gamerule-labelContent">
                        <label className="gamerule-paddinglittlebot">
                            <b>Pattern of game: </b>
                            X (Host), O (Guest)
                        </label>
                        <label className="gamerule-paddinglittletop gamerule-paddinglittlebot">
                            <b>Size of gameboard: </b>
                            32 x 22 (Total: 704 cells)
                        </label>
                        <label className="gamerule-paddinglittletop gamerule-paddinglittlebot">
                            <b>How to play?</b>
                            <br/>
                            <label className="gamerule-paddingleft">
                                <i>For guest, </i>
                                you just need to choose one of the rooms in the GAME ROOM BOARD.
                                <br/>
                                <i>For host, </i>
                                you create room and fill in room name, password (optional) and bet points (optional) fields. After that, the gameboard will appear and you have to wait until one guest joins in. However, if you do not have enough bet points, the room can not be created.
                                <br/>
                                <i>For game, </i>
                                it only count down 5 seconds to start the game when the guest joins in. Host will play first.
                            </label>
                        </label>
                        <label className="gamerule-paddinglittletop gamerule-paddinglittlebot">
                            <b>How to win?</b>
                            <br/>
                            <label className="gamerule-paddingleft">
                                The game just has only one winner. The winner must mark 5 consecutive patterns vertically, or horizontally, or in 4 diagonal lines without being blocked by 2 heads of the opponent's patterns. Please note that, 4 straight lines make up the gameboard can be viewed as blocks. Staying away from it, be careful & wise while playing!
                            </label>
                        </label>
                        <label className="gamerule-paddinglittletop">
                            <b>How to get bet points?</b>
                            <br/>
                            <label className="gamerule-paddingleft">
                                Until you are winner, you can get bet points from the other who accepted competition. Besides that, both of you also receive points from the game for completing successfully. However, if you quit the game when it is running, you will lose and do not receive any points.
                                <br/>
                                <i>For winner, </i>
                                the game will send to you 30 points.
                                <br/>
                                <i>For draw, </i>
                                the game will send to both of you 20 points.
                                <br/>
                                <i>For loser, </i>
                                the game will send to you 10 points.
                            </label>
                        </label>
                    </div>
                    <div className="gamerule-margintop">
                        <Button className="rect-btn text-black small-width btn-for-modal gamerule-marginRight" onClick={this.closeModal}>i got it</Button>
                    </div>
                </Modal>
            </>
        );
    }
}

export default GameRule;