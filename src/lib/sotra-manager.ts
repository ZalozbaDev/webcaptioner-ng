import axios from 'axios'

export const getTranslation = async (
  text: string,
  sourceLanguage: 'de' | 'hsb' = 'hsb',
  targetLanguage: 'de' | 'hsb' = 'de'
) => {
  const data = JSON.stringify({
    text,
    source_language: sourceLanguage,
    target_language: targetLanguage,
  })
  const url = `${process.env.REACT_APP_SOTRA_SERVER_URL}/translate`
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
