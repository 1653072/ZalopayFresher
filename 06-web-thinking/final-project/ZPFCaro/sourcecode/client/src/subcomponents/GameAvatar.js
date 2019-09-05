import React from 'react';
import './GameAvatar.css';

class GameAvatar extends React.Component{
    render(){
        let classes = 'gameava-game-avatar-container '+this.props.type+' '+this.props.className;
        return(
            <div className={classes}>
                <span className="gameava-overlay"></span>
                <img className="gameava-game-avatar" src={this.props.avatar} alt={this.props.username}/>
                <span class="gameava-pattern">{this.props.pattern}</span>
            </div>        
        )

    };
};


export default GameAvatar;