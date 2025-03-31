import React, { ReactNode } from 'react';
import { 
  View, 
  StyleSheet, 
  ScrollView, 
  ViewStyle,
  SafeAreaView
} from 'react-native';
import Navbar from './Navbar';
import Footer from './Footer';
import ChatBotButton from './ChatBotButton';
import ScrollbarStyles from './ScrollbarStyles';

/**
 * Main page container including Navbar, ChatButton and Footer
 * To be used across all authenticated pages for consistent layout
 */
interface MainPageContainerProps {
  children: ReactNode;
  style?: ViewStyle;
  contentContainerStyle?: ViewStyle;
  isAuthenticated?: boolean;
  showFooter?: boolean;
  showNavbar?: boolean;
  showChatButton?: boolean;
}

function MainPageContainer({
  children,
  style,
  contentContainerStyle,
  isAuthenticated = true,
  showFooter = true,
  showNavbar = true,
  showChatButton = true,
}: MainPageContainerProps) {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollbarStyles />
      
      {showNavbar && <Navbar isLogged={isAuthenticated} />}
      
      <ScrollView
        style={[styles.scrollView, style]}
        contentContainerStyle={[styles.scrollViewContent, contentContainerStyle]}
        showsVerticalScrollIndicator={true}
      >
        <View style={styles.content}>
          {children}
        </View>
        
        {showFooter && <Footer />}
      </ScrollView>
      
      {showChatButton && <ChatBotButton />}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
  }
});

export default MainPageContainer;