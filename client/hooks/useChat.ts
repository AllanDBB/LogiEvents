import { useState, useEffect } from 'react';
import chatService, { 
  Message, 
  ChatSession, 
  QuickReplyOption 
} from '@/services/chatServices';

export function useChat() {
  const [session, setSession] = useState<ChatSession | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [quickReplies, setQuickReplies] = useState<QuickReplyOption[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  function initializeChat() {
    setLoading(true);
    setError(null);
    
    chatService.startSession()
      .then(handleNewSession)
      .catch(handleInitError);
  }
  
  function handleNewSession(newSession: ChatSession) {
    setSession(newSession);
    setMessages(newSession.messages);
    
    chatService.getQuickReplies(newSession)
      .then(handleQuickReplies)
      .catch(function(err) {
        console.error('Error getting quick replies:', err);
        setLoading(false);
      });
  }
  
  function handleInitError(err: any) {
    setError('Error iniciando chat');
    console.error('Error initializing chat:', err);
    setLoading(false);
  }
  
  function handleQuickReplies(suggestions: QuickReplyOption[]) {
    setQuickReplies(suggestions);
    setLoading(false);
  }

  function sendMessage(messageText: string) {
    if (!messageText.trim() || !session) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      content: messageText,
      type: 'text',
      isUser: true,
      timestamp: new Date()
    };
    
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    
    setIsTyping(true);
    
    const updatedSession = {
      ...session,
      messages: updatedMessages,
      updatedAt: new Date()
    };
    
    chatService.sendMessage(messageText, updatedSession)
      .then(function(responseData) {
        handleBotResponse(responseData, updatedSession, updatedMessages);
      })
      .catch(handleSendError);
  }
  
  function handleBotResponse(
    responseData: { response: Message, typingDelay: number },
    updatedSession: ChatSession,
    updatedMessages: Message[]
  ) {
    const { response, typingDelay } = responseData;
    
    setTimeout(function() {
      addBotMessage(response, updatedSession, updatedMessages);
    }, typingDelay);
  }
  
  // Add bot message to chat
  function addBotMessage(
    botMessage: Message,
    updatedSession: ChatSession,
    previousMessages: Message[]
  ) {
    const newMessages = [...previousMessages, botMessage];
    setMessages(newMessages);
    setIsTyping(false);
    
    const newSession = {
      ...updatedSession,
      messages: newMessages
    };
    
    setSession(newSession);
    
    chatService.saveSession(newSession);
    updateQuickReplies(newSession);
  }
  
  function updateQuickReplies(newSession: ChatSession) {
    chatService.getQuickReplies(newSession)
      .then(function(suggestions) {
        setQuickReplies(suggestions);
      })
      .catch(function(err) {
        console.error('Error getting quick replies:', err);
      });
  }
  
  function handleSendError(err: any) {
    setIsTyping(false);
    setError('Error enviando mensaje');
    console.error('Error sending message:', err);
  }

  function clearChat() {
    initializeChat();
  }

  useEffect(function() {
    initializeChat();
  }, []);

  return {
    messages,
    isTyping,
    quickReplies,
    loading,
    error,
    sendMessage,
    clearChat
  };
}

export default useChat;