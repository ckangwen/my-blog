export default function request(url) {
  return new Promise((resolved, rejected) => {
    const xhr = new XMLHttpRequest()
    xhr.open('get', url, true)
    xhr.onreadystatechange = () => {
      if (!xhr || xhr.readyState !== 4) {
        return
      }
      if (xhr.status === 0) {
        return
      }
      const response = {
        data: xhr.response,
        status: xhr.status,
        statusText: xhr.statusText,
        headers: parseHeaders(xhr.getAllResponseHeaders())
      }
      if (response.status >= 200 && response.status < 300) {
        resolved(response)
      } else {
        rejected(new Error(`Request failed with status code ${response.status}`))
      }
    }
    xhr.onerror = () => {
      rejected(new Error('request error'))
    }
    xhr.onabort = () => {
      rejected(new Error('request abort'))
    }
    xhr.ontimeout = () => {
      rejected(new Error('request timeout'))
    }
    xhr.send(null)
  })
}

function parseHeaders(headers) {
  let res = Object.create(null);
  if (!headers) {
    return res;
  }
  headers.split("\r\n").forEach(line => {
    let [key, val] = line.split(":")
    key = key.trim().toLowerCase()
    if (!key) {
      return
    }
    if (val) {
      val = val.trim()
    }

    res[key] = val
  })
  return res
}