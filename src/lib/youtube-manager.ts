import axios from 'axios'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { Buffer } from 'buffer'
dayjs.extend(utc)

const region = process.env.REACT_APP_YOUTUBE_REGION

export const getParseDataForYoutube = (
  seq: number,
  text: string,
  date: Date,
  youtubeUrl: string,
  sendToYoutube: boolean = false
) => {
  const parsedDate = dayjs.utc(date).format('YYYY-MM-DDTHH:MM:ss.SSS')
  const data = `${parsedDate} ${region}\n${text}: ${seq}\n`

  console.log({
    youtubeUrl: `${youtubeUrl}&seq=${seq}`,
  })

  sendToYoutube &&
    axios.post(
      `${youtubeUrl}&seq=${seq}`,
      Buffer.from(data, 'ascii').toString('utf-8'),
      {
        headers: {
          'Content-Type': 'text/plain',
          'Access-Control-Allow-Origin': '*',
        },
      }
    )

  return data
}
