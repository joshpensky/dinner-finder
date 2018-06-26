const parseJSON = response => {
  return new Promise((resolve) => {
    if (response.status === 404) {
      return resolve({
        status: 404,
        ok: false,
        data: response.statusText,
      });
    }
    return response.json().then(json => {
      resolve({
        status: response.status,
        ok: response.ok,
        data: json,
      });
    });
  });
}

export default (endpoint, method = 'GET', body = {}) => {
  let options = { method }
  if (method === 'POST' || method === 'PUT') {
    options = Object.assign(options, {
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json'
      },
    })
  }
  return new Promise((resolve, reject) => {
    fetch(process.env.API_URL + endpoint, options)
      .then(parseJSON)
      .then(res => {
        return res.ok 
          ? resolve(res.data)
          : reject(res);
      })
  })
}