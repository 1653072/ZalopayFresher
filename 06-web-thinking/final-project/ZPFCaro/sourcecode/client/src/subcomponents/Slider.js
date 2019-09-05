import React from 'react';
import './Slider.css';
import InputRange from 'react-input-range';

class RectButton extends React.Component{

    constructor(props) {
        super(props);
     
        this.state = {
          value: '50'
        };
      }
     
      render() {
        let className = this.props.className + " sliderdiv";

        return (
            <div className={className}>
                <span className="sd-label">{this.props.type}</span>
                <InputRange
                    maxValue={100}
                    minValue={0}
                    value={this.state.value}
                    onChange={value => this.setState({ value })} />
            </div>
        );
      }
}

export default RectButton;