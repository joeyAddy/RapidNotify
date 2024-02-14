import React from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  Dimensions,
  StyleSheet,
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
} from "react-native-reanimated";

const { width } = Dimensions.get("window");

interface PageProps {
  image: any;
  text: string;
}

interface PagesProps {
  pages: PageProps[];
  currentPage: number;
}

const Pages = ({ pages, currentPage }: PagesProps) => {
  const position = useSharedValue(0);

  const panGesture = Gesture.Pan()
    .onUpdate(({ translationX }) => {
      position.value = translationX;
    })
    .onEnd((event) => {
      if (event.translationX > 0 && event.translationX > width / 2) {
        position.value = withTiming(width, { duration: 100 });
      } else if (event.translationX < 0 && event.translationX < -width / 2) {
        position.value = withTiming(-width, { duration: 100 });
      } else {
        position.value = withTiming(0, { duration: 100 });
      }
    });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: -width * currentPage }],
    };
  });

  const renderItem = ({ item }: { item: PageProps }) => (
    <Animated.View style={[{ width }, animatedStyle]}>
      <Image source={item.image} style={{ width: 200, height: 200 }} />
      <Text>{item.text}</Text>
    </Animated.View>
  );

  return (
    <GestureDetector gesture={panGesture}>
      <View style={{ flex: 1 }}>
        <FlatList
          data={pages}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
        />
        <View style={styles.dotsContainer}>
          {pages.map((_, index) => (
            <View
              key={index}
              style={[styles.dot, index === currentPage && styles.activeDot]}
            />
          ))}
        </View>
      </View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#888",
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: "#333",
  },
});

export default Pages;
