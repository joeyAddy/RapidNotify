import { Image } from "react-native";

export type OnboardingDataType = {
  title: string;
  subtitle: string;
  imageUri: string;
};

export const onboardingData = [
  {
    title: "Report issues with just a few taps",
    subtitle:
      "We make it easy to report any suspicious activity, vandalism, or emergencies.",
    imageUri: Image.resolveAssetSource(
      require("@assets/images/onboarding-image-1.png")
    ).uri,
  },
  {
    title: "Geo-Tagging Technology",
    subtitle:
      "Our app utilizes advanced geo-tagging technology to pinpoint your location accurately",
    imageUri: Image.resolveAssetSource(
      require("@assets/images/onboarding-image-2.png")
    ).uri,
  },
  {
    title: "Report safely and discreetly",
    subtitle:
      "You submit reports without disclosing your personal information, ensuring your safety and privacy.",
    imageUri: Image.resolveAssetSource(
      require("@assets/images/onboarding-image-3.png")
    ).uri,
  },
  {
    title: "Get Real-Time Updates",
    subtitle:
      "As events unfold, you'll receive instant notifications and be able to follow the progress of response efforts.",
    imageUri: Image.resolveAssetSource(
      require("@assets/images/onboarding-image-4.png")
    ).uri,
  },
] as const;
