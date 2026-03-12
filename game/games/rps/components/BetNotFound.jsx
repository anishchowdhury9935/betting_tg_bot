import React from 'react'

export default function BetNotFound(props) {
    const { isBetFound } = props.props;
    return (
        <div className='connecting_player_main'>
            <div>
                <h4>
                    {isBetFound ? "please wait..." : ''}
                </h4>
                <h4>
                    {isBetFound ? 'betting Data is fetching' : 'This bet does not exist'}
                </h4>
            </div>
        </div>
    )
}
