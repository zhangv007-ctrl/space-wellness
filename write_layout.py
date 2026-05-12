import os
path = "src/app/[locale]/layout.tsx"
os.makedirs(os.path.dirname(path), exist_ok=True)
with open(path, "w") as f:
    f.write(open(os.path.expanduser("~/Downloads/layout.tsx")).read())
print("Done! File written.")
