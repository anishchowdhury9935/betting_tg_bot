import React from 'react'
import helperMain from '../helper/helperMain';

export default function SelectingIndicator(props) {
    const { opponentDetails, ownDetails } = props.props;
    return (
        <div id='SelectingIndicator_main'>
            <figure>
                <div>
                    {ownDetails.isSelected ? (<img src={helperMain.getImgAsChoice(ownDetails.choiceName)} alt="" className='animate__animated animate__zoomIn' />) : (<h4>choosing!</h4>)}
                </div>
            </figure>
            <figure>
                <div>
                    {opponentDetails.isSelected && ownDetails.isSelected ? (<img src={helperMain.getImgAsChoice(opponentDetails.choiceName)} alt="" className='animate__animated animate__zoomIn' />) : (<h4>choosing!</h4>)}
                </div>
            </figure>
        </div>
    )
}
