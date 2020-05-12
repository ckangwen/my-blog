import xhr from './xhr.js'
export default function dispatchRequest(url) {
  return xhr(url).then(res => {
    res.data = JSON.parse(res.data)
    return res
  })
}
