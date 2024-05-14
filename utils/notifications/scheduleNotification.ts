import * as Notifications from "expo-notifications";

export default async function schedulePushNotification(
  title: string,
  body: any,
  data: any,
  trigger: any
) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      data,
    },
    trigger: trigger ?? { seconds: 2 },
  });
}
