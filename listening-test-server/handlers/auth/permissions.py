permission_list = {'User', 'Template'}


def add_permission(n: str, enabled_list: set):
    if n not in permission_list:
        return
    enabled_list.add(n)
