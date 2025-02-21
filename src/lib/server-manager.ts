import axios from 'axios'

export const getTranslation = async (
  text: string,
  model: 'ctranslate' | 'fairseq',
  sourceLanguage: 'de' | 'hsb' = 'hsb',
  targetLanguage: 'de' | 'hsb' = 'de'
) => {
  const data = JSON.stringify({
    text,
    model,
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

export const getParseDataForYoutube = async (
  seq: number,
  text: string,
  date: Date,
  youtubeStreamingKey: string
) => {
  const data = {
    cid: youtubeStreamingKey,
    seq: seq,
    timestamp: date.toISOString(),
    region: region,
    text: text,
  }
  console.log({ youtubeData: data })
  const config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: `${process.env.REACT_APP_WEBCAPTIONER_SERVER}/youtube`,
    headers: {
      'Content-Type': 'application/json',
    },
    data: data,
  }

  return axios
    .request(config)
    .then(res => {
      console.log(res)
      return {
        seq,
        text: data.text,
        timestamp: new Date(res.data + '+00:00'),
        successfull: true,
        errorMessage: null,
      }
    })
    .catch(err => {
      console.error(err.response?.data ?? 'Zmylk')
      return {
        seq,
        text: data.text,
        timestamp: new Date(),
        successfull: false,
        errorMessage:
          err.response?.data?.errors?.at(0)?.message ??
          err.response?.data ??
          err.message ??
          err.satusText,
      }
    })
}
