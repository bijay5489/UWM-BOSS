from api.models import Report


class ReportManager:
    def get(self, query: str, identity: str) -> Report | None:
        try:
            return Report.objects.get(id=query, reporter=identity)
        except Report.DoesNotExist:
            return None

    def get_all(self) -> list:
        return list(Report.objects.all())