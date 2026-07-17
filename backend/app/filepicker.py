"""Open a native OS file/folder dialog and return the chosen path.

Because the backend runs locally (same machine as the browser), we can pop the
real Explorer/Finder dialog. It runs in a short-lived subprocess so Tk never
touches the async server's thread. Returns "" if cancelled or unavailable.

Local-convenience only — never expose this in a hosted deployment.
"""
from __future__ import annotations

import subprocess
import sys

_SCRIPT = """
import sys
try:
    import tkinter as tk
    from tkinter import filedialog
except Exception:
    print("")
    sys.exit(0)

root = tk.Tk()
root.withdraw()
try:
    root.attributes("-topmost", True)
except Exception:
    pass
mode = sys.argv[1] if len(sys.argv) > 1 else "directory"
path = filedialog.askopenfilename() if mode == "file" else filedialog.askdirectory()
try:
    root.destroy()
except Exception:
    pass
print(path or "")
"""


def pick_path(mode: str = "directory", timeout: int = 300) -> str:
    """Open a folder ("directory") or file dialog; return the selected path or ""."""
    try:
        result = subprocess.run(
            [sys.executable, "-c", _SCRIPT, "file" if mode == "file" else "directory"],
            capture_output=True,
            text=True,
            timeout=timeout,
        )
        return result.stdout.strip()
    except Exception:
        return ""
