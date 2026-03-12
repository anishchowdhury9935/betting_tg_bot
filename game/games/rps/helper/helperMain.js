import rockImg from "../media/images/rock.png"
import paperImg from "../media/images/paper.png"
import scissorImg from "../media/images/scissor.png"



const helperMain = {
    getImgAsChoice: (choice) => {
        let img;
        switch (choice) {
            case 'rock':
                img = rockImg;
                break;
            case 'paper':
                img = paperImg;
                break;
            case 'scissor':
                img = scissorImg;
                break;
            default:
                break;
        }
        return img;
    },
    rpsResultCalculate: (own, opponent) => {
        if (own === opponent) {
            return { won: "draw", item: own };
        } else if (own === 'rock' && opponent === 'scissor') {
            return { won: "you", item: 'scissor' };
        } else if (own === 'paper' && opponent === 'rock') {
            return { won: "you", item: 'rock' };
        } else if (own === 'scissor' && opponent === 'paper') {
            return { won: "you", item: 'paper' };
        } else if (opponent === 'rock' && own === 'scissor') {
            return { won: "opponent", item: 'scissor' };
        } else if (opponent === 'paper' && own === 'rock') {
            return { won: "opponent", item: 'rock' };
        } else if (opponent === 'scissor' && own === 'paper') {
            return { won: "opponent", item: 'paper' };
        } else {
            return { won: "error", item: null };  // fallback for unexpected inputs
        }
    },
    findMatchWinner: (ownIDAndWinCount, opponentIDAndWinCount) => {
        const { ownId, ownWinCount } = ownIDAndWinCount;
        const { opponentId, opponentWinCount } = opponentIDAndWinCount;
        if (ownWinCount === opponentWinCount) {
            return { winnerId: "draw" }
        }
        if (ownWinCount > opponentWinCount) {
            return { winnerId: ownId }
        }
        return { winnerId: opponentId }
    }
}


export default helperMain;