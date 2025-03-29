import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  useWindowDimensions,
  FlatList
} from 'react-native';
import { EventCategory } from '../models/event';

interface CategoryTabsProps {
  categories: EventCategory[];
  selectedCategory: EventCategory;
  onSelectCategory: (category: EventCategory) => void;
}

function CategoryTabs({ categories, selectedCategory, onSelectCategory }: CategoryTabsProps) {
  // Hooks
  const { width } = useWindowDimensions();
  const [isMobile, setIsMobile] = useState(false);
  
  // Set mobile view based on screen width
  useEffect(() => {
    setIsMobile(width < 768);
  }, [width]);

  // Render individual tab button
  const renderTabButton = (category: EventCategory, isMobileView: boolean) => (
    <TouchableOpacity
      key={category}
      style={[
        isMobileView ? tabStyles.mobileTab : tabStyles.tab,
        selectedCategory === category && 
          (isMobileView ? tabStyles.selectedMobileTab : tabStyles.selectedTab)
      ]}
      onPress={() => onSelectCategory(category)}
    >
      <Text 
        style={selectedCategory === category ? tabStyles.selectedText : tabStyles.tabText}
        numberOfLines={1}
      >
        {category}
      </Text>
    </TouchableOpacity>
  );

  // Render mobile view with grid layout
  const renderMobileView = () => (
    <View style={tabStyles.wrapContainer}>
      <FlatList
        data={categories}
        horizontal={false}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item) => item}
        contentContainerStyle={tabStyles.mobileListContainer}
        renderItem={({ item }) => renderTabButton(item, true)}
      />
    </View>
  );

  // Render web view with horizontal scroll
  const renderWebView = () => (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false} 
      contentContainerStyle={tabStyles.scrollContainer}
    >
      <View style={tabStyles.container}>
        {categories.map((category) => renderTabButton(category, false))}
      </View>
    </ScrollView>
  );

  return isMobile ? renderMobileView() : renderWebView();
}

const tabStyles = StyleSheet.create({
  wrapContainer: {
    marginHorizontal: 16,
    marginTop: 10,
    marginBottom: 10,
  },
  scrollContainer: {
    paddingVertical: 5,
    paddingHorizontal: 16,
  },
  container: {
    flexDirection: 'row',
    backgroundColor: '#D9D9D9',
    borderRadius: 90,
    padding: 4,
    marginTop: 10,
    marginLeft: 10,
    marginRight: 10,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    marginHorizontal: 4,
    borderRadius: 20,
    alignItems: 'center',
  },
  selectedTab: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  mobileListContainer: {
    paddingVertical: 8,
    paddingHorizontal: 8,
    backgroundColor: '#D9D9D9',
    borderRadius: 16,
  },
  mobileTab: {
    flex: 1,
    marginHorizontal: 4,
    marginVertical: 4,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 100,
  },
  selectedMobileTab: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tabText: {
    fontSize: 14,
    color: '#6c757d',
    fontWeight: '500',
    textAlign: 'center',
  },
  selectedText: {
    fontSize: 14,
    color: '#212529',
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default CategoryTabs;