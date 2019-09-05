import React from 'react';
import './LogoTitle.css';

class LogoTitle extends React.Component {

    render() {
        return (
            <div className="lt-logotitle">
                <img className="lt-img" src={require("../media/logo.png")} alt="ZPF Caro Logo" />                
                <div className="lt-contentdiv">
                    <span className="lt-content">{this.props.text}</span>
                </div>
            </div>
        );
    }
}

export default LogoTitle;