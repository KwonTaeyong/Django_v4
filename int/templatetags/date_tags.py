from django import template
from datetime import datetime, timedelta

register = template.Library()


@register.simple_tag
def today():
    now = datetime.now()
    return str(now)[0:10]


@register.simple_tag
def week_ago(week):
    now = datetime.now()
    return str(now - timedelta(weeks=week))[0:10]


@register.simple_tag
def week_later(week):
    now = datetime.now()
    return str(now + timedelta(weeks=week))[0:10]
