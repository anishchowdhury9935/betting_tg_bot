import rps_config from '../rps_config'
// api.js
const API_BASE_URL = `${rps_config.API_BASE_URL_MAIN || rps_config.API_BASE_URL_DEV}/api/bettingbasicdata`; // Change the URL based on your server
// const API_BASE_URL = 'https://nomoonsol.com/api/bettingbasicdata'; // Change the URL based on your server
// Read betting data by bettingId
export const getBettingData = async (bettingId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/${bettingId}`, {
            method: 'GET',
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to fetch betting data');
        }

        const bet = await response.json();
        return bet;
    } catch (error) {
        console.error('Error fetching betting data:', error);
        // throw error;
    }
};

// Update betting data by bettingId
export const updateBettingData = async (bettingId, data) => {
    try {
        const response = await fetch(`${API_BASE_URL}/${bettingId}/${data.winnerId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to update betting data');
        }

        const updatedBet = await response.json();
        return updatedBet;
    } catch (error) {
        console.error('Error updating betting data:', error);
        throw error;
    }
};

// Delete betting data by bettingId
export const deleteBettingData = async (bettingId, data) => {
    try {
        const response = await fetch(`${API_BASE_URL}/${bettingId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ...data }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to delete betting data');
        }
        return true; // Return true if the deletion was successful
    } catch (error) {
        console.error('Error deleting betting data:', error);
        throw error;
    }
};
