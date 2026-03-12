import config from "../../config";
const { devModeOn } = config;
const rps_config = {
    API_BASE_URL_MAIN: devModeOn ? false : 'https://nomoonsol.com',
    API_BASE_URL_DEV: devModeOn ? 'http://localhost:5010' : false,
}

export default rps_config;