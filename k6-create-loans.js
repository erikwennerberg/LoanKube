import { check, fail } from 'k6'
import {
  randomIntBetween,
} from 'https://jslib.k6.io/k6-utils/1.2.0/index.js'
import http from 'k6/http'

export default function main() {

  const BASE_URL = 'http://localhost:3006'

  let id = randomIntBetween(1, 999)

  const payload = JSON.stringify({
    loanId : 'u' + id,
    creditScore: randomIntBetween(100, 840),
    loanAmount: randomIntBetween(440, 900000)
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const res = http.post(`${BASE_URL}/`, payload,params)

  // console.log will be represented as logs in Loki
  console.log('got a response');
  
  // Use check() to test conditions. These show as 'assertions' in the dashboard
  // Note: failed check() calls do not impact uptime and reachability
  const pass = check(res, {
    'is status 200': (r) => r.status === 200,
  });

  // Use fail() to abort and fail a test, impacting uptime and reachability
  if(!pass){
    fail(`non 200 result ${res.status}`);
  }
}