'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Loader, User, Bot } from 'lucide-react'

type Message = {
  id: number
  text: string
  sender: 'user' | 'ai'
}

export default function ProjectManagementChat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim()) {
      const newMessage: Message = { id: Date.now(), text: input, sender: 'user' }
      setMessages([...messages, newMessage])
      setInput('')
      simulateResponse(input)
    }
  }

  // const simulateResponse = (userMessage: string) => {
  //   setIsTyping(true)
  //   setTimeout(() => {
  //     const aiMessage: Message = { 
  //       id: Date.now(), 
  //       text: `I've received your message about "${userMessage}". I'll analyze this and update the project status accordingly.`, 
  //       sender: 'ai' 
  //     }
  //     setMessages(prevMessages => [...prevMessages, aiMessage])
  //     setIsTyping(false)
  //   }, 1500)
  // }

  const simulateResponse = async (userStory: string) => {
    setIsTyping(true)
    try {
      const response = await fetch('https://1052-134-139-34-35.ngrok-free.app/api/userstory/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ "query":userStory  }),
      })

      if (!response.ok) {
        throw new Error('Failed to process user story')
      }

      const data = await response.json()
      console.log(data)
      const aiMessage: Message = { 
        id: Date.now(), 
        text: data.answer || 'User story processed successfully.', 
        sender: 'ai' 
      }
      setMessages(prevMessages => [...prevMessages, aiMessage])
    } catch (error) {
      const errorMessage: Message = {
        id: Date.now(),
        text: 'An error occurred while processing the user story. Please try again.',
        sender: 'ai'
      }
      setMessages(prevMessages => [...prevMessages, errorMessage])
    } finally {
      setIsTyping(false)
    }
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <div className="flex flex-col h-[600px] bg-white shadow-lg rounded-lg overflow-hidden">
      <header className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 text-white">
        <h1 className="text-xl font-semibold">Userstory Analyzer</h1>
      </header>
      <div className="flex-grow overflow-auto p-4 space-y-4 bg-gray-50">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex items-start space-x-2 max-w-[80%]`}>
                {message.sender === 'ai' && (
                  <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                )}
                <div
                  className={`p-3 rounded-lg ${
                    message.sender === 'user' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-white border border-gray-200'
                  }`}
                >
                  <p className={`text-sm ${message.sender === 'user' ? 'text-white' : 'text-gray-800'}`}>
                  {message.text.split('\n').map((line, index) => (
                    <React.Fragment key={index}>
                      {line}
                      <br />
                    </React.Fragment>
                  ))}
                  </p>
                </div>
                {message.sender === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-gray-600" />
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {isTyping && (
          <div className="flex items-center space-x-2 text-gray-500">
            <Loader className="w-4 h-4 animate-spin" />
            <span className="text-sm">Assistant is typing...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSubmit} className="p-4 bg-white border-t border-gray-200">
        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-grow p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            placeholder="copy and paste your user story here.."
          />
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  )
}