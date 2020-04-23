const axios = require('axios');


export default async function StatsService() {

    try {
        let stats = await axios.get(`http://localhost:3000/metrics`)
        if (stats.status !== 200)
            console.log(`Call to retrieve loan statistics failed with a response code of ${stats.status}.`);
       
        return stats;    
    }
    catch (error) {
        console.log("Unkown failure retrieving loan statistics.");
        console.log(error);
    }

    return ""
}
