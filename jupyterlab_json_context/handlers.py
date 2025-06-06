import os
import json

from jupyter_server.base.handlers import APIHandler
from jupyter_server.utils import url_path_join
import tornado
from tornado.web import StaticFileHandler


class RouteHandler(APIHandler):
    # The following decorator should be present on all verb methods (head, get, post,
    # patch, put, delete, options) to ensure only authorized user can request the
    # Jupyter server
    @tornado.web.authenticated
    def get(self):
        self.finish(json.dumps({
            "data": "This is /jupyterlab_json_context/hello endpoint!"
        }))

class LogJsonHandler(APIHandler):
    @tornado.web.authenticated
    def post(self):
        response_body = self.get_json_body()
        json_loads = json.loads(response_body)
        print("response: " + response_body)
        self.finish(json.dumps(json_loads))

def setup_handlers(web_app):
    host_pattern = ".*$"

    base_url = web_app.settings["base_url"]
    # Prepend the base_url so that it works in a JupyterHub setting
    route_pattern = url_path_join(base_url, "jupyterlab_json_context", "hello")
    json_pattern = url_path_join(base_url, "jupyterlab_json_context", "json")

    handlers = [
        (route_pattern, RouteHandler),
        (json_pattern, LogJsonHandler)
    ]

    web_app.add_handlers(host_pattern, handlers)

    # Prepend the base_url so that it works in a JupyterHub setting
    doc_url = url_path_join(base_url, "jupyterlab_json_context", "public")
    doc_dir = os.getenv(
        "JLAB_SERVER_EXAMPLE_STATIC_DIR",
        os.path.join(os.path.dirname(__file__), "public"),
    )
    handlers = [("{}/(.*)".format(doc_url), StaticFileHandler, {"path": doc_dir})]
    web_app.add_handlers(host_pattern, handlers)