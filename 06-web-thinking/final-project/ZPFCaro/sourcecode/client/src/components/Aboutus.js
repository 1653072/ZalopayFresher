import React from 'react';
import './Aboutus.css';
import '../subcomponents/RectButton.css';
import '../subcomponents/CircleButton.css';
import TitleModal from '../subcomponents/TitleModal';
import { Modal, Button } from 'react-bootstrap';

class Aboutus extends React.Component {
    constructor(props) {
        super(props);
        this.state = { showAboutUsModal: false};

        this.closeModal = this.closeModal.bind(this);
        this.openModal = this.openModal.bind(this);
    }

    closeModal() {
        this.setState({ showAboutUsModal: false });
    }

    openModal() {
        this.setState({ showAboutUsModal: true });
    }

    render() {
        return (
            <>
                <Button className="h-icon circleButton fa fa-info" onClick={this.openModal} title="About us"></Button>

                <Modal show={this.state.showAboutUsModal} onHide={this.closeModal} className="aboutus-heightmodal">
                    <TitleModal text="about us" className="aboutus-marginbot" />
                    <div className="aboutus-paddingbot aboutus-labelHead">
                        <label className="aboutus-label aboutus-labelUnderline">INTRODUCTION</label>
                    </div>
                    <div className="aboutus-marginbot aboutus-labelContent">
                        <div><label className="aboutus-label">ZPFCaro is a web game application which is established on Summer 2019 by Quoc and Tran. It is one of the important modules that we have to study, so we not only complete it as an assignment but also try our best in coding. Thank you & please enjoy it!</label></div>
                    </div>
                    <div className="aboutus-paddingbot aboutus-labelHead">
                        <label className="aboutus-label aboutus-labelUnderline">DEVELOPER TEAM</label>
                    </div>
                    <div className="aboutus-marginbot aboutus-labelContent">
                        <div><label className="aboutus-label">Nguyen Do Cat Tran - VNG Zalopay Fresher 2019</label></div>
                        <div><label className="aboutus-label">Tran Kien Quoc - VNG Zalopay Fresher 2019</label></div>
                    </div>
                    <div className="aboutus-paddingbot aboutus-labelHead">
                        <label className="aboutus-label aboutus-labelUnderline">ZPFCARO VERSION</label>
                    </div>
                    <div className="aboutus-labelContent">
                        <div><label className="aboutus-label">ZPFCaro version 1.0</label></div>
                        <div><label className="aboutus-label">Released on August 25, 2019</label></div>
                    </div>
                    <div className="aboutus-margintop">
                        <Button className="rect-btn text-black small-width background-gray btn-for-modal aboutus-marginRight" onClick={this.closeModal}>back</Button>
                    </div>
                </Modal>
            </>
        );
    }
}

export default Aboutus;