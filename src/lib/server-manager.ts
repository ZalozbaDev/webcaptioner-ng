import axios from 'axios'

export const getTranslation = async (
  text: string,
  sourceLanguage: 'de' | 'hsb' = 'hsb',
  targetLanguage: 'de' | 'hsb' = 'de'
) => {
  const data = JSON.stringify({
    text,
    sourceLanguage: sourceLanguage,
    targetLanguage: targetLanguage,
  })
  const url = `${process.env.REACT_APP_WEBCAPTIONER_SERVER}/sotra`
  const config = {
    maxBodyLength: Infinity,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
    data: data,
  }

  return axios.post<SotraResponse>(url, data, config)
}

const region = process.env.REACT_APP_YOUTUBE_REGION

export const getParseDataForYoutube = (
  seq: number,
  text: string,
  date: Date,
  youtubeUrl: string,
  sendToYoutube: boolean = false
) => {
  const data = {
    cid: youtubeUrl.split('cid=')[1],
    seq: seq,
    timestamp: date.toISOString(),
    region: region,
    text: text,
  }

  const config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: `${process.env.REACT_APP_WEBCAPTIONER_SERVER}/youtube`,
    headers: {
      'Content-Type': 'application/json',
    },
    data: data,
  }

  if (sendToYoutube) {
    console.log('send to youtube')
    axios
      .request(config)
      .then((res) => {
        console.log(res)
      })
      .catch((err) => {
        console.error(err)
      })
  }

  return data
}
