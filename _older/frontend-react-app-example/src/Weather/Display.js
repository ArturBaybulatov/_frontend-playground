import React from 'react'


export default class Display extends React.Component {
    render() {
        return (
            <div className='well' style={{marginTop: '15px'}}>
                {this.props.text}
            </div>
        )
    }
}
