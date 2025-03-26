import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { userRole } from '@/models/user';

interface RoleIndicatorProps {
  role: userRole;
}

function RoleIndicator ({ role }:RoleIndicatorProps){
  return (
    <View style={[
      styles.container,
      role === 'admin' ? styles.adminContainer : styles.userContainer
    ]}>
      <Text style={[
        styles.text,
        role === 'admin' ? styles.adminText : styles.userText
      ]}>
        {role === 'admin' ? 'Administrator' : 'User'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 16,
    alignSelf: 'flex-start',
    marginTop: 8,
    marginBottom: 16,
  },
  adminContainer: {
    backgroundColor: '#d1e7dd',
  },
  userContainer: {
    backgroundColor: '#cfe2ff',
  },
  text: {
    fontSize: 12,
    fontWeight: '600',
  },
  adminText: {
    color: '#146c43',
  },
  userText: {
    color: '#0a58ca',
  },
});

export default RoleIndicator;