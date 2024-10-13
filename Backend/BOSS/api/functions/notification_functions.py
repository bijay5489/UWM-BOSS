from api.models import Notification


class NotificationManager:
    def get(self, query: str, identity: str) -> Notification | None:
        try:
            return Notification.objects.get(id=query, rider=identity)
        except Notification.DoesNotExist:
            return None

    def get_all(self) -> list:
        return list(Notification.objects.all())
    