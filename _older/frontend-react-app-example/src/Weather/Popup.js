import React from 'react'


export default class Popup extends React.Component {
    componentDidMount() {
        const that = this
        const $modal = $(that.refs.modal)
        
        $modal.on('shown.bs.modal', function($evt) {
            that.props.updateTemperature()
        })
        
        $modal.on('hidden.bs.modal', function($evt) {
            that.props.hidePopup()
        })
        
        that._drawPopup()
    }
    
    componentDidUpdate(props, state) {
        this._drawPopup()
    }
    
    _drawPopup() {
        $(this.refs.modal).modal(this.props.shown ? 'show' : 'hide')
    }
    
    render() {
        return (
            <div className='modal fade' ref='modal'>
                <div className='modal-dialog'>
                    <div className='modal-content'>
                        <div className='modal-header'>
                            <button type='button' className='close' data-dismiss='modal'>&times;</button>
                            <h4 className='modal-title'>Temperature</h4>
                        </div>
                        
                        <div className='modal-body'>
                            {this.props.text}
                        </div>
                        
                        <div className='modal-footer'>
                            <button type='button' className='btn btn-default' data-dismiss='modal'>Close</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
