import React from 'react'
import { MutatingDots } from 'react-loader-spinner'
export default function ConnectingPlayers() {
    return (
        <div className='connecting_player_main'>
            <div>
                <h4>
                    please wait...
                </h4>
                <h4>
                    while second player is connecting
                </h4>
            </div>
            <div>
                <MutatingDots
                    visible={true}
                    height="100"
                    width="100"
                    color="#4fa94d"
                    secondaryColor="#4fa94d"
                    radius="12.5"
                    ariaLabel="mutating-dots-loading"
                    wrapperStyle={{}}
                    wrapperClass=""
                />
            </div>
        </div>
    )
}
