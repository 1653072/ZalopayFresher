import React from 'react';
import './TableTitle.css';

class TableTitle extends React.Component {

    render() {
        let className = this.props.className + " tt-title";
        return (
            <div className={className}>
                <label className="tt-label">{this.props.text}</label> 
            </div>
        );
    }
}

export default TableTitle;