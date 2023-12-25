import { async } from 'regenerator-runtime';
import { TIMEOUT_SEC } from './config.js';

/*timeout Function:
Takes a time parameter s (in seconds).
Returns a Promise that rejects with a timeout error after the specified time.
Used to set a timeout for the AJAX request. */
const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

/*
Takes a URL and optional data for POST requests (uploadData).
Returns a Promise.
Uses the Fetch API to make an HTTP request.
If uploadData is provided, it makes a POST request with JSON data.
Utilizes Promise.race to race between the actual fetch request and the timeout promise.
If the fetch request completes within the specified timeout, it resolves with the parsed JSON response.
If there's an HTTP error or a timeout, it throws an error with relevant details. */
export const AJAX = async function (url, uploadData = undefined) {
  try {
    const fetchPro = uploadData
      ? fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(uploadData),
        })
      : fetch(url);

    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
    const data = await res.json();

    if (!res.ok) throw new Error(`${data.message} (${res.status})`);
    return data;
  } catch (err) {
    throw err;
  }
};
