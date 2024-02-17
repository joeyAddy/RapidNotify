import React from "react";
import { SafeAreaView, Text, View } from "@/components/Themed";
import { Image, ImageBackground, ScrollView } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import blogPosts from "@/locales/blog";
import TrendingBlogPostCard from "@/components/blog/TrendingBlogPostCard";

const Blog = () => {
  return (
    <SafeAreaView className="flex-1">
      <View className="flex-row items-center justify-between px-4 -mt-5">
        <View>
          <Text className="text-3xl font-bold dark:text-white/50">
            Trending blogs
          </Text>
        </View>
        <View>
          <Text className="text-lg font-bold">See all</Text>
        </View>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="flex-1 p-4"
      >
        {blogPosts.map((post, index) => (
          <TrendingBlogPostCard key={post.id} index={index} post={post} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Blog;
