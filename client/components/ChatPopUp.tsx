import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Pressable,
  ScrollView,
  useWindowDimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { impactAsync, ImpactFeedbackStyle } from 'expo-haptics';
import useChat from '@/hooks/useChat';
import { Message, QuickReplyOption } from '@/services/chatServices';

interface ChatPopupProps {
  visible: boolean;
  onClose: () => void;
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function getCurrentFormattedTime(): string {
  return new Date().toLocaleDateString('en-US', { 
    weekday: 'short', 
    hour: '2-digit', 
    minute: '2-digit', 
    hour12: true 
  });
}

function ChatPopup(props: ChatPopupProps) {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  
  const { 
    messages, 
    isTyping, 
    quickReplies, 
    sendMessage,
    clearChat
  } = useChat();
  
  const [inputText, setInputText] = useState('');
  const listRef = useRef<FlatList>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(100)).current;
  
  useEffect(function() {
    if (props.visible) {
      showPopupAnimation();
    } else {
      hidePopupAnimation();
    }
  }, [props.visible]);

  function showPopupAnimation() {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true
      })
    ]).start();
  }
  
  function hidePopupAnimation() {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true
      }),
      Animated.timing(slideAnim, {
        toValue: 100,
        duration: 200,
        useNativeDriver: true
      })
    ]).start();
  }

  useEffect(function() {
    if (messages.length > 0 && listRef.current) {
      scrollToBottom();
    }
  }, [messages]);
  
  function scrollToBottom() {
    setTimeout(function() {
      if (listRef.current) {
        listRef.current.scrollToEnd({ animated: true });
      }
    }, 100);
  }

  function handleSendMessage() {
    if (!inputText.trim()) return;
    
    if (Platform.OS !== 'web') {
      impactAsync(ImpactFeedbackStyle.Light);
    }
    
    sendMessage(inputText);
    setInputText('');
  }

  function handleQuickReply(text: string): void {
    sendMessage(text);
  }

  function handleClose() {
    props.onClose();
  }
  
  function handleTextChange(text: string) {
    setInputText(text);
  }
  
  function handleInputSubmit() {
    handleSendMessage();
  }
  function handleClearChat() {
    
    clearChat();
  }


  function renderMessageItem({ item }: { item: Message }) {
    return (
      <View style={[
        styles.messageBubble,
        item.isUser ? styles.userBubble : styles.botBubble
      ]}>
        {!item.isUser && (
          <View style={styles.botAvatar}>
            <Ionicons name="chatbubbles-outline" size={18} color="#fff" />
          </View>
        )}
        <View style={styles.messageContent}>
          <Text style={styles.messageText}>{item.content}</Text>
          {item.eventSuggestion && renderEventSuggestion(item.eventSuggestion)}
          <Text style={styles.timestamp}>{formatTime(item.timestamp)}</Text>
        </View>
      </View>
    );
  }
  
  function renderEventSuggestion(event: any) {
    return (
      <View style={styles.eventSuggestion}>
        <Text style={styles.eventTitle}>{event.title}</Text>
        <Text style={styles.eventTime}>{event.datetime}</Text>
        {event.location && (
          <Text style={styles.eventLocation}>{event.location}</Text>
        )}
      </View>
    );
  }
  
  function renderQuickReplies() {
    if (!quickReplies.length) return null;
    
    return (
      <View style={styles.quickRepliesWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={true}
          style={styles.quickRepliesScroll}
          contentContainerStyle={styles.quickRepliesContainer}
          indicatorStyle="black"
        >
          {quickReplies.map(renderQuickReplyButton)}
        </ScrollView>
      </View>
    );
  }
  
  function renderQuickReplyButton(reply: QuickReplyOption) {
    function onPress() {
      handleQuickReply(reply.text);
    }
    
    return (
      <TouchableOpacity
        key={reply.id}
        style={styles.quickReply}
        onPress={onPress}
      >
        <Text style={styles.quickReplyText}>{reply.text}</Text>
      </TouchableOpacity>
    );
  }
  
  function keyExtractor(item: Message): string {
    return item.id;
  }
  
  function handleContentPress() {
    // Empty function to prevent bubble up
  }

  return (
    <Modal
      visible={props.visible}
      transparent
      animationType="none"
      onRequestClose={handleClose}
    >
      <Pressable style={styles.modalOverlay} onPress={handleClose}>
        <Animated.View 
          style={[
            styles.container,
            isMobile ? styles.mobileContainer : {},
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <Pressable onPress={handleContentPress} style={styles.chatContainer}>
            <BlurView intensity={80} style={styles.header}>
              <View style={styles.headerContent}>
                <View style={styles.botInfo}>
                  <View style={styles.botIconContainer}>
                    <Ionicons name="chatbubbles-outline" size={22} color="#fff" />
                  </View>
                  <View>
                    <Text style={styles.botName}>SammyBot</Text>
                    <Text style={styles.botStatus}>• Always active</Text>
                  </View>
                
                </View>
                <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                  <Ionicons name="close" size={24} color="#000" />
                </TouchableOpacity>
              </View>
             
              <Text style={styles.chatTime}>{getCurrentFormattedTime()}</Text>
            </BlurView>

            <FlatList
              ref={listRef}
              data={messages}
              renderItem={renderMessageItem}
              keyExtractor={keyExtractor}
              contentContainerStyle={styles.messagesList}
            />

            {isTyping && (
              <View style={styles.typingIndicator}>
                <Text style={styles.typingText}>Sammy está escribiendo...</Text>
              </View>
            )}

            {renderQuickReplies()}

            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
            >
              <View style={styles.inputContainer}>

                <TouchableOpacity
                  style={styles.clearChatButton}
                  onPress={handleClearChat}
                >
                  <Ionicons
                    name="trash"
                    size={20}
                    color={ "#0080ff" }
                  />
                </TouchableOpacity>

                <TextInput
                  style={styles.input}
                  value={inputText}
                  onChangeText={handleTextChange}
                  placeholder="Type a message..."
                  placeholderTextColor="#999"
                  returnKeyType="send"
                  onSubmitEditing={handleInputSubmit}
                />

                <TouchableOpacity
                  style={styles.sendButton}
                  onPress={handleSendMessage}
                  disabled={!inputText.trim()}
                >
                  <Ionicons
                    name="send"
                    size={20}
                    color={inputText.trim() ? "#0080ff" : "#ccc"}
                  />
                </TouchableOpacity>
              </View>
            </KeyboardAvoidingView>
          </Pressable>
        </Animated.View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '90%',
    maxWidth: 400,
    height: '70%',
    maxHeight: 600,
    backgroundColor: '#fff',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
  mobileContainer: {
    width: '95%',
    height: '80%',
  },
  chatContainer: {
    flex: 1,
  },
  header: {
    paddingTop: 16,
    paddingBottom: 8,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
    backgroundColor: 'rgba(255,255,255,0.9)',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  botInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  botIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#0080ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  botName: {
    fontSize: 16,
    fontWeight: '600',
  },
  botStatus: {
    fontSize: 12,
    color: '#4CAF50',
  },
  closeButton: {
    padding: 5,
  },
  chatTime: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
    alignSelf: 'center',
  },
  messagesList: {
    padding: 16,
    paddingBottom: 140, 
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 18,
    marginBottom: 10,
    flexDirection: 'row',
  },
  userBubble: {
    backgroundColor: '#e1ebfa',
    alignSelf: 'flex-end',
    borderBottomRightRadius: 4,
  },
  botBubble: {
    backgroundColor: '#f1f1f1',
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 4,
  },
  botAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#0080ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  messageContent: {
    flex: 1,
  },
  messageText: {
    fontSize: 15,
    color: '#333',
  },
  timestamp: {
    fontSize: 10,
    color: '#999',
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  typingIndicator: {
    padding: 8,
    paddingLeft: 16,
  },
  typingText: {
    fontSize: 12,
    color: '#888',
    fontStyle: 'italic',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    backgroundColor: '#f1f1f1',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    fontSize: 15,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  quickRepliesWrapper: {
    backgroundColor: '#f9f9f9',
    paddingVertical: 8,
    paddingBottom: 12, 
  },
  quickRepliesScroll: {
    height: 55, 
  },
  quickRepliesContainer: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    paddingBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  quickReply: {
    backgroundColor: '#f1f1f1',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    minWidth: 130,
  },
  quickReplyText: {
    fontSize: 13,
    color: '#0080ff',
    fontWeight: '500',
  },
  clearChatButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  eventSuggestion: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#eee',
  },
  eventTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  eventTime: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  eventLocation: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  }
});

export default ChatPopup;