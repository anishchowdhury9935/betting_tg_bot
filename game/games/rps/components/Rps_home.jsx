import React, { useEffect, useMemo, useState } from 'react'
import rockImg from "../media/images/rock.png"
import paperImg from "../media/images/paper.png"
import scissorImg from "../media/images/scissor.png"
import { useParams } from 'react-router-dom';
import socketEvents from '../utils/socketFiles/socketEvents';
import { toast } from 'react-hot-toast';
import helperMain from '../helper/helperMain';
import 'animate.css';
import ConnectingPlayers from './ConnectingPlayers';
import Result from './Result';
import SelectingIndicator from './SelectingIndicator';
import { getBettingData, updateBettingData } from '../helper/fetchApi';
import Winner from './Winner.jsx';
import BetNotFound from './BetNotFound';
import Waiting from './Waiting.jsx';
export default function home() {
  const { bettingId, type, game, userId } = useParams();
  const [opponentDetails, setOpponentDetails] = useState({ img: null, isSelected: false, choiceName: '', opponentUserName: 'opponent', opponentId: null });
  const [ownDetails, setOwnDetails] = useState({ img: null, isSelected: false, choiceName: '', userId });
  const [basicGameData, setBasicGameData] = useState({ round: 1, wonName: '', wonChoice: '', ownWinCount: 0, opponentWinCount: 0, waitingComponentShow: false, waitingComponentText: '' });
  const [isSecondPlayerConnected, setIsSecondPlayerConnected] = useState(false)
  const [componentShowInDash, setComponentShowInDash] = useState(<Result props={{ own: ownDetails.choiceName, opponent: opponentDetails.choiceName, }} />)
  const { joinRoom, socket, sendChoice } = socketEvents;
  const [shouldProceedRound, setShouldProceedRound] = useState(true);
  const [isMeWinnerId, setIsMeWinnerId] = useState(null);
  const [isBetFound, setIsBetFound] = useState(true);
  const [isResultSaved, setIsResultSaved] = useState(false);
  const maxRound = 3;
  useEffect(() => {

    socket.on('isConnected', ({ bettingId, userIdOwn, isConnected, }) => {
      if (!isConnected) {
        setOwnDetails({ ...ownDetails, choiceName: '', isSelected: false, img: null })
      }
      if (userIdOwn !== userId) {
        setOpponentDetails((prev) => {
          return { ...prev, opponentId: userIdOwn }
        })
        console.log(opponentDetails, userIdOwn)
      }
      setIsSecondPlayerConnected(isConnected)
    });

  }, [opponentDetails])



  useMemo(() => {
    joinRoom({ bettingId, type, game, userIdOwn: userId });
    socketEvents.isConnected({ bettingId, userIdOwn: userId });
    socket.on('receiveChoice', (data) => {
      const { choice, userId, winCount } = data;
      setOpponentDetails({ ...opponentDetails, img: helperMain.getImgAsChoice(choice), choiceName: choice, isSelected: true });
      // setBasicGameData({ ...basicGameData, opponentWinCount: winCount })
    });
    (async () => {
      try {
        const getBettingDataFetch = await getBettingData(bettingId);
        //console.log(getBettingDataFetch);
        if (getBettingDataFetch?.isBetFound !== undefined && getBettingDataFetch.isBetFound === false) {
          setIsBetFound(false);
          return;
        }
        // console.log(getBettingDataFetch)
        if (getBettingDataFetch.data?.shouldProceedRound !== undefined && !getBettingDataFetch.data?.shouldProceedRound) {
          setIsMeWinnerId(getBettingDataFetch.data.winner === 'draw' ? null : getBettingDataFetch.data.winner === userId);
          setShouldProceedRound(false);
          return;
        }
        const findOwn = getBettingDataFetch?.data?.playerRoundWin?.filter((data) => {
          return data.userId === userId;
        })
        const findOpponent = getBettingDataFetch?.data?.playerRoundWin?.filter((data) => {
          return data.userId !== userId;
        })
        setBasicGameData({ ...basicGameData, round: getBettingDataFetch.data?.roundNumber ? getBettingDataFetch?.data?.roundNumber : 1, ownWinCount: findOwn ? findOwn[0].winCount : 0, opponentWinCount: findOpponent ? findOpponent[0].winCount : 0 })
      } catch (error) {
        console.log(error)
      }
    })()
    // socket.on('winnerFound', (data) => {
    //   const { winner, shouldProceedRound } = data;
    //   setIsMeWinnerId(false)
    //   setShouldProceedRound(shouldProceedRound)
    //   setBasicGameData({ ...basicGameData, waitingComponentText: '', waitingComponentShow: false })
    // })
  }, [])



  useEffect(() => {
    if (opponentDetails.isSelected && ownDetails.isSelected) {
      if (basicGameData.round >= maxRound) {
        setTimeout(() => {
          setBasicGameData({ ...basicGameData, waitingComponentText: '🎉 while the result is been declared. 🎉', waitingComponentShow: true })
          setShouldProceedRound(false);
          setBasicGameData({ ...basicGameData, waitingComponentText: '', waitingComponentShow: false })
        }, 4000);
      }
      const calculateWin = helperMain.rpsResultCalculate(ownDetails.choiceName, opponentDetails.choiceName)
      if (calculateWin.won === 'you') {
        (async () => {
          // setBasicGameData({ ...basicGameData, waitingComponentText: 'while proceeding next', waitingComponentShow: true })
          const saveData = await updateBettingData(bettingId, { winnerId: userId });
          // setBasicGameData({ ...basicGameData, waitingComponentText: '', waitingComponentShow: false })
          // if (saveData.data.shouldProceedRound !== undefined && !saveData.data.shouldProceedRound) {
          //   console.log(saveData.data.winner)
          //   socket.emit('winnerFound', { winner: saveData.data.winner, shouldProceedRound: false });
          //   setIsMeWinnerId(saveData.data.winner === userId);
          //   setShouldProceedRound(false);
          //   setBasicGameData({ ...basicGameData, waitingComponentText: '', waitingComponentShow: false })
          // }
        })()
      };
      (() => {
        const timeoutId = setTimeout(() => {
          const calculateResult = helperMain.rpsResultCalculate(ownDetails.choiceName, opponentDetails.choiceName,);
          if (calculateResult.won === 'draw') {
            toast(`${calculateResult.won}`, { position: "bottom-center", duration: 3000 });
            if (shouldProceedRound) {
              setTimeout(() => {
                setOpponentDetails({ ...opponentDetails, isSelected: false });
                setOwnDetails({ ...ownDetails, isSelected: false });
              }, 5000)
            }
          } else {
            if (shouldProceedRound) {
              setTimeout(() => {
                setOpponentDetails({ ...opponentDetails, isSelected: false });
                setOwnDetails({ ...ownDetails, isSelected: false });
                setBasicGameData((prev) => {
                  return { ...prev, round: prev.round + 1 }
                });
              }, 4000)
              if (calculateResult.won === 'you') {
                setBasicGameData((prev) => {
                  setIsResultSaved(true)
                  return { ...prev, ownWinCount: prev.ownWinCount + 1 }
                });
              } else {
                setBasicGameData((prev) => {
                  setIsResultSaved(true)
                  return { ...prev, opponentWinCount: prev.opponentWinCount + 1 }
                });
              }
            }
            toast(`${calculateResult.won} won this round`, { position: "bottom-center", duration: 3000 });
          }
        }, 1200);
      })()
    }
    if (ownDetails.isSelected && opponentDetails.isSelected) {
      setTimeout(() => {
        setComponentShowInDash(<Result props={{ own: ownDetails.choiceName, opponent: opponentDetails.choiceName, }} />)
      }, 800)
    } else {
      setComponentShowInDash(<SelectingIndicator props={{ opponentDetails, ownDetails }} />)
    }
  }, [opponentDetails, ownDetails]);


  useEffect(() => {
    if (basicGameData.round >= maxRound && isResultSaved) {
      const result = helperMain.findMatchWinner({ ownId: userId, ownWinCount: basicGameData.ownWinCount }, { opponentId: opponentDetails.opponentId, opponentWinCount: basicGameData.opponentWinCount })
      setIsMeWinnerId(result.winnerId === 'draw' ? null : result.winnerId === userId);
      // console.log(result, { ownId: userId, ownWinCount: basicGameData.ownWinCount }, { opponentId: opponentDetails.opponentId, opponentWinCount: basicGameData.opponentWinCount })
      // console.log(basicGameData)
      console.log({ ownWinCount: basicGameData.ownWinCount })
      console.log({ opponentWinCount: basicGameData.opponentWinCount })
      return;
    }
    setIsResultSaved(false)
  }, [isResultSaved])




  return (
    <div id='root_main_div'>
      {isBetFound ? '' : <BetNotFound props={{ isBetFound }} />}
      {isBetFound ? shouldProceedRound ? isSecondPlayerConnected ? '' : <ConnectingPlayers /> : '' : ''}
      {shouldProceedRound ? '' : <Winner props={{ isMeWinnerId, userId }} />}
      {basicGameData.waitingComponentShow ? <Waiting props={{ waitingComponentText: basicGameData.waitingComponentText }} /> : ''}
      <div className='root_main_div_inner_first'>
        <nav>
          <div className="ownWins winCountsStrip">
            {basicGameData.ownWinCount}
          </div>
          <div className="rounds">
            ROUND {basicGameData.round}
          </div>
          <div className="opponentWins winCountsStrip">
            {basicGameData.opponentWinCount}
          </div>
        </nav>
        <figure className='playerNameSection'>
          <h4>
            {"you"}
          </h4>
          <h4>
            {"opponent"}
          </h4>
        </figure>
        <main>
          <div className='opponentsPlayingDetails playingDetails'>
            {componentShowInDash}
          </div>
          <div className='ownPlayingDetails playingDetails'>
            {ownDetails.isSelected ? (<section className='ownPlayingDetails_overLay'>

            </section>) : ''}
            {/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
            <img src={rockImg} alt="rock " id='rock' className='materialImg animate__animated animate__bounceIn' onClick={() => {
              setOwnDetails({ ...ownDetails, img: helperMain.getImgAsChoice('rock'), isSelected: true, choiceName: "rock" })
              sendChoice({ bettingId, choice: 'rock', winCount: basicGameData.ownWinCount, userId })
            }} />
            <div>
              {/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
              <img src={paperImg} alt="paper " id='paper' className='materialImg animate__animated animate__bounceInLeft' onClick={() => {
                setOwnDetails({ ...ownDetails, img: helperMain.getImgAsChoice('paper'), isSelected: true, choiceName: "paper" })
                sendChoice({ bettingId, choice: 'paper', winCount: basicGameData.ownWinCount, userId })
              }} />
              {/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
              <img src={scissorImg} alt="scissor " id='scissor' className='materialImg animate__animated animate__bounceInRight' onClick={() => {
                setOwnDetails({ ...ownDetails, img: helperMain.getImgAsChoice('scissor'), isSelected: true, choiceName: "scissor" })
                sendChoice({ bettingId, choice: 'scissor', winCount: basicGameData.ownWinCount, userId })
              }} />
            </div>
          </div>
        </main>
        <footer>

        </footer>
      </div>
    </div>
  )
}
