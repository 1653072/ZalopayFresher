
import "./GameCell.css";

import React from "react";

class GameCell extends React.Component {

    componentWillUpdate(nextProps, nextState){
        if (nextProps.pattern != '')
        this.disable = true;
    }

    render(){
        let classes = 'gc-game-cell d-flex justify-content-center align-content-center '+ this.props.className + ' ' + this.props.pattern;
        classes += (this.disable)?" disable":"";
        return (
            <div className={classes}>
                <a className="text-decoration-none">
                    {this.props.pattern}
                </a>
            </div>
        );
    }


}

export default GameCell;
 