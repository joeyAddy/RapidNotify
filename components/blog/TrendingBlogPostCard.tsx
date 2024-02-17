import { FontAwesome } from "@expo/vector-icons";
import { Text, View } from "../Themed";
import { BlogPost } from "@/locales";
import { Image, useColorScheme } from "react-native";
import blogPosts from "@/locales/blog"; // should come from global state
import Colors from "@/constants/Colors";

interface TrendingBlogPostCardProps {
  index: number;
  post: BlogPost;
}

const TrendingBlogPostCard = ({ index, post }: TrendingBlogPostCardProps) => {
  const colorScheme = useColorScheme();
  return (
    <View
      style={{
        borderColor: Colors[colorScheme ?? "dark"].text,
      }}
      className={`w-60 h-[50%] relative dark:border-2 rounded-xl  ${index === blogPosts.length - 1 ? "mr-8" : "mr-4"}`}
    >
      <Image
        className="h-full w-full rounded-xl"
        source={{
          uri: post.image,
        }}
      />
      <View className="absolute bg-black/40 top-0 bottom-0 right-0 left-0  rounded-xl p-5 justify-between">
        <View className="bg-transparent items-end">
          <FontAwesome name="bookmark-o" size={24} color="white" />
        </View>
        <View className="bg-transparent flex-1 justify-end">
          <Text className="text-white text-3xl">{post.title}</Text>
          <View className="flex-row space-x-2 bg-transparent">
            <Image
              className="h-10 w-10 rounded-lg"
              source={{
                uri:
                  post.image ??
                  Image.resolveAssetSource(require("@assets/images/splash.png"))
                    .uri,
              }}
            />
            <View className="bg-transparent">
              <Text className="text-white font-bold text-lg">
                {post.author}
              </Text>
              <Text className="text-white">{post.relativeTime}</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default TrendingBlogPostCard;
