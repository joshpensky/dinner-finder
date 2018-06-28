const parseJSON = response => {
  return new Promise((resolve) => {
    if (response.status === 404) {
      return statusResolve(resolve, 404, false, response.statusText);
    } else if (response.status === 204) {
      return statusResolve(resolve, 204, true, response.statusText);
    }
    return response.json()
      .then(json => statusResolve(resolve, response.status, response.ok, json));
  });
}

const statusResolve = (resolve, status, ok, data) => {
  return resolve({
    status: status,
    ok: ok,
    data,
  })
}

export default (endpoint, method = 'GET', body = new FormData()) => {
  let options = { method }
  if (method === 'POST' || method === 'PUT') {
    options = Object.assign(options, { body })
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