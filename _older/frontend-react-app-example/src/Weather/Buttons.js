import React from 'react'


export default class Buttons extends React.Component {
    render() {
        return (
            <div>
                <button type='button' className='btn btn-primary' onClick={this.props.updateTemperature}>Temperature</button>
                {' '}
                <button type='button' className='btn btn-danger' onClick={this.props.clearDisplay}>Clear</button>
                {' '}
                <button type='button' className='btn btn-default' onClick={this.props.showPopup}>Popup</button>
            </div>
        )
    }
}
