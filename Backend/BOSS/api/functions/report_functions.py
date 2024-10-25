from api.models import Report, User
from api.serializer import ReportSerializer


class ReportManager:
    def create(info: dict) -> bool:
        user = User.objects.get(username=info['reporter'])

        required_fields = ['report_type', 'context']
        if not all(field in info for field in required_fields):
            return False

        report = Report(
            reporter= user,
            report_type = info['report_type'],
            context = info['context'],
        )
        report.save()
        return True

    def get(self, query: str, identity: str) -> Report | None:
        try:
            return Report.objects.get(id=query, reporter=identity)
        except Report.DoesNotExist:
            return None

    def get_all(self) -> list:
        reports = Report.objects.all()
        serializer = ReportSerializer(reports, many=True)
        return serializer.data