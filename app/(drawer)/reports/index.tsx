import { Text, View } from "@/components/Themed";
import { reportsAtom } from "@/store/reports";
import { useAtom } from "jotai";
import React from "react";
import { Image, ScrollView } from "react-native";

const MyReports = () => {
  const [reports] = useAtom(reportsAtom);

  console.log("REPORTS", reports);

  return (
    <View className="flex-1 px-4">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="py-5 space-y-5">
          {reports.length > 0 ? (
            reports.map((report, index) => (
              <View
                key={index}
                style={{
                  shadowColor: "gray",
                }}
                className="shadow-xl rounded-xl p-3 space-y-2"
              >
                <View className="flex-row items-center justify-between space-x-4 s">
                  <Image
                    resizeMode="cover"
                    className="h-16 w-16 rounded-xl"
                    src={
                      report.attachment ??
                      require("@assets/images/onboarding-image-1.png")
                    }
                  />
                  <View className="flex-1">
                    <Text className="capitalize font-bold text-lg">
                      {report.incidentType}
                    </Text>
                    <Text className="">{report.description}</Text>
                  </View>
                </View>
                <View className="flex-row justify-between">
                  <View className="flex-row space-x-1">
                    <Text className="text-sm">News Validity:</Text>
                    <Text className="text-green-700 text-sm">
                      {report.senderReputaion}
                    </Text>
                  </View>
                  <Text className="text-sm font-bold">
                    {report.time}, {report.date}
                  </Text>
                </View>
              </View>
            ))
          ) : (
            <Text className="font-bold text-lg text-gray-500 text-center">
              No reports yet
            </Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default MyReports;
