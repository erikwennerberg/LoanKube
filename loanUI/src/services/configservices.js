const axios = require('axios');




export async function ConfigGetService() {

  try {
    const config = await axios.get('http://localhost:3001/config');
    return config;
  }
  catch (error) {
    console.log("Failed to retrieve dsahboard configuration");
    console.log(error);
  }

  return ""
}
export async function ConfigUpdateService(c) {

  try {

    const result = axios.post('http://localhost:3001/updateconfig', c, {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
    }); 
    return result;
  }
  catch (error) {
    console.log("Failed to update configuration");
    console.log(error);
  }

  return ""
}
/*
axios.get('localhost:3001/weeklygames/2019-REG-16', {
    params: {
      ID: 12345
    }
  })
  .then(function (response) {
    console.log(response);
  })
  .catch(function (error) {
    console.log(error);
  })
  .finally(function () {
    // always executed
  });
  */