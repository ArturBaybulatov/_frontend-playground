import React from 'react'

import Buttons from './Buttons.js'
import Display from './Display.js'
import Popup from './Popup.js'


export default class Weather extends React.Component {
    constructor(props, ...args) {
        super(props, ...args)
        
        this.state = {
            temperature: '',
            popupShown: false,
        }
    }
    
    _updateTemperature() {
        const that = this
        const uriObj = new URI('http://api.openweathermap.org/data/2.5/weather')
        
        uriObj.setQuery({
            APPID: '31671fabaf42ce61f4c6c1be87ec11d9',
            q: 'Moscow',
            units: 'metric',
        })
        
        $.get(uriObj.href()).then(function(res) {
            that.setState({temperature: `It's ${Math.round(res.main.temp)} Celsius degrees in Moscow`})
        })
    }
    
    _clearDisplay() {
        this.setState({temperature: ''})
    }
    
    _showPopup() {
        this.setState({popupShown: true})
    }
    
    _hidePopup() {
        this.setState({popupShown: false})
    }
    
    render() {
        return (
            <div>
                <Buttons
                    clearDisplay={this._clearDisplay.bind(this)}
                    updateTemperature={this._updateTemperature.bind(this)}
                    showPopup={this._showPopup.bind(this)}/>
                
                <Display text={this.state.temperature}/>
                
                <Popup
                    updateTemperature={this._updateTemperature.bind(this)}
                    hidePopup={this._hidePopup.bind(this)}
                    shown={this.state.popupShown}
                    text={this.state.temperature}/>
            </div>
        )
    }
}
