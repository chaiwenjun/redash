import os
import logging
from flask import current_app, render_template, safe_join, send_file
from werkzeug.exceptions import NotFound

from flask_login import login_required
from redash import settings
from redash.handlers import routes
from redash.handlers.authentication import base_href
from redash.handlers.base import org_scoped_rule

logger = logging.getLogger(__name__)

def render_index():
    logger.info('enter render_index')    

    if settings.MULTI_ORG:
        response = render_template("multi_org.html", base_href=base_href())
    else:
        full_path = safe_join(settings.STATIC_ASSETS_PATH, 'index.html')
        response = send_file(full_path, **dict(cache_timeout=0, conditional=True))
        logger.info('full_path: %s',full_path)
    
    logger.info('exiting render_index')    
    logger.info(response)
    return response


@routes.route(org_scoped_rule('/<path:path>'))
@routes.route(org_scoped_rule('/'))
#@login_required
def index(**kwargs):
    logger.info(kwargs)
    return render_index()
