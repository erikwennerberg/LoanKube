const axios = require('axios');



export async function SubmitLoanService(app) {

  try {

    const result = axios.post('http://localhost:3006/', app, {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
    }); 
    return result;
  }
  catch (error) {
    console.log("Failed to submit loan application");
    console.log(error);
  }

  return ""
}
