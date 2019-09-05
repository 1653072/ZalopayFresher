import React from 'react';
import './TitleModal.css';

class TitleModal extends React.Component {

    render() {
        let className = "titlemodal-whitebackground " + this.props.className
        let text = this.props.text
        return (
            <div className={className}>
                <div className="titlemodal-contentdiv">
                    <span className="titlemodal-content">{text}</span>
                </div>
            </div>
        );
    }
}

export default TitleModal;