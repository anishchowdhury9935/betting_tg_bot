// Load environment variables for frontend
const isDev = import.meta.env.VITE_DEV_MODE === 'true' || !import.meta.env.PROD;

const config = {
    socket: {
        hostUrl: import.meta.env.VITE_GAME_SERVER_URL || (isDev ? 'http://localhost:5010' : "https://nomoonsol.com/"),
    },
    devMode: isDev,
    gameClientUrl: import.meta.env.VITE_GAME_CLIENT_URL || (isDev ? 'http://localhost:5173' : 'https://game.nomoonsol.com'),
};

export default config;
