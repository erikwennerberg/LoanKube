const axios = require('axios');


export async function MetricsService() {

    try {
        let stats = await axios.get(`/metrics`)
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

export async function UserLoanDataService() {

    try {
        const data = await axios.get('/uloans');
        if (data.status !== 200)
            console.log(`Call to etrieve last 5 user loan data point failed with a response code of ${data.status}.`);

        return data;
    }
    catch (error) {
        console.log("Failed to retrieve last 5 user loan data point.");
        console.log(error);
    }

    return ""
}