const axios = require('axios');

const config = require(`${__dirname}/../config/config.json`);

async function getAccessToken(clientId, clientSecret) {
    let url = `https://id.twitch.tv/oauth2/token?client_id=${clientId}&client_secret=${clientSecret}&grant_type=client_credentials`;

    let response = await axios.post(url);

    if (typeof response.data !== 'object' || typeof response.data.access_token !== 'string' || !response.data.access_token.length) {
        throw 'Unable to fetch access token';
    }

    return response.data.access_token;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function getPlatforms(clientId, accessToken) {
    let offset = 0;
    let url = 'https://api.igdb.com/v4/platforms';
    let headers = {
        'Client-ID': clientId,
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'text/plain'
    };

    let response = await axios.post(url, `fields *; limit 100; offset ${offset};`, { headers: headers });
    console.log(response.data);
    offset += 100;
    while (Array.isArray(response.data) && response.data.length) {
        response = await axios.post(url, `fields *; limit 100; offset ${offset};`, { headers: headers });
        offset += 100;
        console.log(response.data);
        await sleep(500);
    }
    
}

async function scrapeData() {
    try {
        let accessToken = await getAccessToken(config['client_id'], config['client_secret']);
        let platforms = await getPlatforms(config['client_id'], accessToken);
    } catch (error) {
        console.log(error);
    }
}

scrapeData();