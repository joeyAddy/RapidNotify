import { Text, View } from "@/components/Themed";
import { reportsAtom } from "@/store/reports";
import { useAtom } from "jotai";
import React from "react";

const MyReports = () => {
  const [reports] = useAtom(reportsAtom);

  console.log("REPORTS", reports);

  return (
    <View className="flex-1 px-4">
      {reports.length < 1 ? (
        <View className="flex-1 items-center">
          <Text className="text-2xl text-gray-400 font-bold mt-44">
            No reports here yet
          </Text>
        </View>
      ) : (
        <View>
          <Text>hey</Text>
        </View>
      )}
    </View>
  );
};

export default MyReports;
