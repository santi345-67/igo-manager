import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';

export async function requestPushPermissions() {
  if (!Device.isDevice) {
    return false;
  }
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  return finalStatus === 'granted';
}

export async function scheduleDeadlineNotifications(deadline?: string) {
  if (!deadline) return;
  const date = new Date(deadline);
  if (isNaN(date.getTime())) return;

  const before24 = new Date(date.getTime() - 24 * 60 * 60 * 1000);
  const before1 = new Date(date.getTime() - 60 * 60 * 1000);

  if (before24 > new Date()) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Recordatorio IGO',
        body: 'Tu plan de acción vence en 24 horas.',
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: before24,
      },
    });
  }

  if (before1 > new Date()) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Recordatorio IGO',
        body: 'Queda 1 hora para el deadline de tu plan.',
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: before1,
      },
    });
  }
}

export async function scheduleInactivityReminder() {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Revisa tus prioridades',
      body: 'Hace 7 días no actualizas tus planes en IGO Manager.',
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: 7 * 24 * 60 * 60,
      repeats: false,
    },
  });
}

export async function scheduleWeeklySummary() {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Resumen semanal IGO',
      body: 'Revisa los avances y tareas completadas esta semana.',
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
      weekday: 1,
      hour: 9,
      minute: 0,
      repeats: true,
    },
  });
}
