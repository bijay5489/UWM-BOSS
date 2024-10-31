from api.models import Van


class VanManagement:
    def get_by_id(self, _id: int) -> Van:
        return Van.objects.get(id=_id)

    def get_by_driver_id(self, username) -> Van:
        return Van.objects.get(driver=username)