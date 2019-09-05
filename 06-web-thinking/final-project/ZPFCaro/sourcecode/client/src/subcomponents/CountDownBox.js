import React from 'react';
import './CountDownBox.css';

class CountDownBox extends React.Component {
    render() {
        let classes = "cdb-style "+this.props.hidden;
        return ( 
            <div className={classes}>
                {(this.props.time > 0) ? this.props.time : this.props.go}
            </div>
        );
    }
}

export default CountDownBox;