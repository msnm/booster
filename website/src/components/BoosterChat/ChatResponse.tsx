import React, { FC, useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { AnalyticsClient } from '../Analytics/analytics-client'

interface ChatResponseProps {
  loading: boolean
  response: string | null
  hasFinished: Boolean
}

export const ChatResponse: FC<ChatResponseProps> = ({ loading, response, hasFinished }) => {
  const [displayPopup, setDisplayPopup] = useState(false)

  useEffect(() => {
    AnalyticsClient.start()
  }, [])

  useEffect(() => {
    if (!response?.length || loading) {
      setDisplayPopup(false)
    }
    if (response?.length && !loading) {
      setTimeout(() => {
        setDisplayPopup(true)
      }, 500)
    }
  }, [response, loading])

  if (response === null) {
    return <div></div>
  }

  if (!response.length) {
    return (
      <div className="bc-chat --loading">
        <span className="bc-loader"></span>
      </div>
    )
  }

  if (hasFinished === false) {
    return (
      <div className="bc-chat-embedded">
        <ReactMarkdown>{response}</ReactMarkdown>
      </div>
    )
  }

  return (
    <>
      <div className={ "bc-chat-embedded"} >
        <ReactMarkdown>{response}</ReactMarkdown>
      </div>
      <div className={ "bc-chat-popup" } style={{ bottom: displayPopup ? '2rem' : '-20rem' }}>
        <p>
        Note the answer you expected? We will be grateful to answer your question on the 
        <a href={'https://discord.com/channels/763753198388510780/1019895895325675550'} target="_blank" onClick={() => AnalyticsClient.trackEvent('UESXT8VI')}> #booster-help </a>
        channel on Discord 🤗
        </p>
      </div>
    </>
  )
}
