import axios from 'axios'
import { axiosInstance } from './axios'
import type { TranscriptLine } from '../types/transcript'
import { DEFAULT_AUDIO_FORMAT, DEFAULT_SAMPLE_RATE } from '../constants/audio'

export const getTranslation = async (
  audioRecordId: string | undefined,
  text: string,
  model: 'ctranslate' | 'fairseq',
  sourceLanguage: 'de' | 'hsb' = 'hsb',
  targetLanguage: 'de' | 'hsb' = 'de',
) => {
  const data = JSON.stringify({
    text,
    model,
    sourceLanguage: sourceLanguage,
    targetLanguage: targetLanguage,
    audioRecordId: audioRecordId,
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
  youtubeStreamingKey: string,
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

export const getAudioFromText = async (text: string, speakerId: string) => {
  const data = JSON.stringify({
    text: text,
    speaker_id: speakerId,
    sampleRate: DEFAULT_SAMPLE_RATE,
    format: DEFAULT_AUDIO_FORMAT,
  })
  const url = `${process.env.REACT_APP_WEBCAPTIONER_SERVER}/bamborak`
  const config = {
    maxBodyLength: Infinity,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
    data: data,
    responseType: 'arraybuffer' as const,
  }

  return axios.post(url, data, config)
}

export const getSpeakersFromBamborak = async () => {
  const url = `${process.env.REACT_APP_WEBCAPTIONER_SERVER}/bamborak-speakers`
  return axios.get(url)
}

export const createAudioRecord = async (
  autoPlayAudio?: boolean,
  speakerId?: string | null,
) => {
  const data: {
    speakerId?: string | null
    originalText: TranscriptLine[]
    translatedText: TranscriptLine[]
  } = {
    originalText: [],
    translatedText: [],
  }

  // Persist selected speaker even when autoPlayAudio is off
  if (speakerId !== undefined) {
    data.speakerId = speakerId
  }

  console.log({ createAudioRecordData: data })

  return axiosInstance.post<AudioRecord>('/users/audioRecords', data)
}

export const updateAudioRecord = async (
  recordId: string,
  speakerId: string | null,
) => {
  return axiosInstance.put<AudioRecord>(
    `/users/audioRecords/${recordId}`,
    { speakerId },
    {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    },
  )
}

export const getAudioRecord = async (recordId: string) => {
  return axiosInstance.get<AudioRecord>(`/users/audioRecords/${recordId}`, {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  })
}
