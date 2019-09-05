import React from 'react';
import './Message.css';

class Message extends React.Component{

    render() {
        let classes = "msg-message-container " + this.props.type +' '+this.props.className;
        let avatar = <img className='msg-avatar' alt={this.props.username} src={this.props.avatar}/>
        return (
          <div className={classes}>
            <div className="msg-avatar-div">
              {avatar}  
            </div>
            <div className="msg-message-div"><p>{this.props.message}</p></div>
          </div>
        );
    }
}

export default Message;