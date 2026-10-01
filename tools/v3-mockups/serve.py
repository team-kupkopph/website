# Serves the V3 design artboards with this folder's support.js shim, and saves the PNGs that
# capture.html posts back into ./raw/.  Usage:  python3 serve.py <path-to design/mobile-v3> [port]
import http.server
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
DESIGN = os.path.abspath(sys.argv[1])
PORT = int(sys.argv[2]) if len(sys.argv) > 2 else 8766
RAW = os.path.join(HERE, "raw")
OWN = {"/support.js", "/capture.html"}


class Handler(http.server.SimpleHTTPRequestHandler):
    def translate_path(self, path):
        clean = path.split("?", 1)[0]
        if clean in OWN:
            return os.path.join(HERE, clean.lstrip("/"))
        return os.path.join(DESIGN, clean.lstrip("/"))

    def do_POST(self):
        name = os.path.basename(self.path)
        if not name.endswith(".png"):
            self.send_response(400)
            self.end_headers()
            return
        os.makedirs(RAW, exist_ok=True)
        with open(os.path.join(RAW, name), "wb") as f:
            f.write(self.rfile.read(int(self.headers["Content-Length"])))
        self.send_response(200)
        self.end_headers()


print(f"http://localhost:{PORT}/capture.html  (artboards from {DESIGN})")
http.server.ThreadingHTTPServer(("127.0.0.1", PORT), Handler).serve_forever()
