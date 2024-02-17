import { Image } from "react-native";

export type OnboardingDataType = {
  title: string;
  subtitle: string;
  imageUri: string;
};

export const onboardingData = [
  {
    title: "Welcome Rockseller!",
    subtitle:
      "Your one-stop app for efficient filling station staff management and financial tracking",
    imageUri: Image.resolveAssetSource(
      require("@assets/images/onboarding-illustration-1.png")
    ).uri,
  },
  {
    title: "Sell Smarter & Safer",
    subtitle:
      "Save time and effort with our intuitive tools for scheduling, tasks, and communication",
    imageUri: Image.resolveAssetSource(
      require("@assets/images/onboarding-illustration-2.png")
    ).uri,
  },
  {
    title: "Balance & Track Sales",
    subtitle:
      "Gain real-time visibility into sales, expenses, and profitability with our comprehensive reports",
    imageUri: Image.resolveAssetSource(
      require("@assets/images/onboarding-illustration-3.png")
    ).uri,
  },
] as const;
