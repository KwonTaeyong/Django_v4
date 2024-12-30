from django.db import connections


def dictfetchall(cursor):
    if cursor.description:
        columns = [col[0] for col in cursor.description]
    else:
        columns = []
    return [
        dict(zip(columns, row))
        for row in cursor.fetchall()
    ]


def proc(procname, params=None):
    with connections['default'].cursor() as cursor:
        cursor.callproc(procname, params)

        results = dictfetchall(cursor)
    return results


def execone(query):
    with connections['default'].cursor() as cursor:
        cursor.execute(query)

        results = cursor.fetchone()
    return results

def execall(query):
    with connections['default'].cursor() as cursor:
        cursor.execute(query)

        results = dictfetchall(cursor)
    return results
