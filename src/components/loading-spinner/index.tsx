import { FC } from 'react'
import './loading-spinner.css'

export const LoadingSpinner: FC<{}> = () => (
  <div className='lds-ellipsis'>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
  </div>
)
