import os
import time
import requests
import json
import random
import datetime
import logging
import zlib
import sys

from datetime import timedelta

logging.basicConfig()
logging.getLogger().setLevel(logging.INFO)

def HTTPExec(url, data):
    logging.debug(f'Executing {url} with a payload of {data}')
    try:
        response = requests.post(url, json=data)
        if response.ok:
            logging.debug(f'Execute Ok')
            response.close()
            return True
        else:
            logging.warning(f'Execute failed')
            response.close()
    except RuntimeError:
        logging.exception(f'Likely too many connections to {url}...trying again on next run')
        pass
    except ConnectionError:
        logging.exception(f'Connection not available to {url}')
        pass
    except:
        logging.exception(f'Unknown error to {url}')
        pass

    return False

def MassTest():
    id = random.randint(1,999)
    size = 200
    if len(sys.argv) > 0:
        logging.info(sys.argv[1])
        size = int(sys.argv[1])
    for i in range(2000,2000 + size):
        start_time = datetime.datetime.now()
        data = {"loanId": f'{id}-{i}','creditScore': random.randint(440,840),'loanAmount': random.randint(850,9999999)}
        res = HTTPExec(f'http://localhost:3006/', data)
        if res:
            logging.info(f'Submitted for {data}')
        else:
            logging.info(f'Retry submission for {data}')
            res = HTTPExec(f'http://localhost:3006/', data)
            if res:
                logging.info(f'Submitted for {data}')
            else:
                logging.info(f'Failed submission for {data}')
        stop_time = datetime.datetime.now()
        difference = stop_time - start_time
        logging.info(difference)
    return

MassTest()