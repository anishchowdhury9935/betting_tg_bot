const { config } = require("dotenv");

const globalVariables = {
    games:[
        {
            commandName:"rps",
            name:"Rock paper scissors 🤘🏻🗞️✂️",
            about:"The Rock Paper Scissors game pits two players against each other as they both select one of three hand gestures at the same time:\n\t• Rock (a closed fist),\n\t• Paper (an open palm),\n\t• Scissors (a V-shape formed with the fingers).\n\nHow to play:\n\t• Rock smashes Scissors,\n\t• Scissors slices Paper,\n\t• Paper wraps Rock.\n\nIn the event that both players pick the same gesture, it's declared a draw.\n\n use /rps to play it :)"
        },
    ]
}
module.exports = globalVariables;