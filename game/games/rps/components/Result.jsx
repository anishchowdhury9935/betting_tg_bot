import React, { useMemo } from 'react';
import helperMain from '../helper/helperMain.js';
import { toast } from 'react-hot-toast';
import { updateBettingData } from '../helper/fetchApi.js';
export default function Result(props) {
    const { own, opponent, } = props.props;
    const calculateResult = helperMain.rpsResultCalculate(own, opponent,);
    return (
        <div className='Result_main'>
            <img src={helperMain.getImgAsChoice(own)} alt="item" id='ownResult' className='result_img' />
            <img src={helperMain.getImgAsChoice(opponent)} alt="item" id='opponentResult' className='result_img' />
            {/* <img src={helperMain.getImgAsChoice(calculateResult.item)} alt="" id='actualResult' className=' animate__animated  animate__bounceIn' /> */}
            <h4 id='actualResult' className='animate__animated  animate__bounceIn' style={{ textAlign: 'center' }}>
                <h3 style={{ fontSize: '2em' }}>
                    {calculateResult.won}
                </h3>
                {calculateResult.won !== <h3>draw</h3> ? (<h3>win this round</h3>) : ''}
            </h4>
        </div>
    );
}
