RIVINGTON MARX — DESIGN STUDY HUB

LOCAL USE
Open this folder's index.html, not the folder itself.
The six buttons open study-1/index.html through study-6/index.html in new tabs.
Explicit HTML filenames work both from disk and on a static web server.
Keep the whole folder structure together; do not upload just the HTML files.

RECOMMENDED GITHUB STRUCTURE
Upload the contents of outputs/ directly to the repository root:

index.html
vercel.json
.gitignore
README.txt
assets/
study-1/
study-2/
study-3/
study-4/
study-5/
study-6/

All assets are shared. Studies refer to ../assets/ with exact, case-sensitive
filenames. Keep the images inside assets/ and the CSS/JS beside their HTML.
The source Client Images folder is not required in the deployed repository.

VERCEL SETTINGS
Framework Preset: Other.
Root Directory: repository root (leave empty or ./) when using the structure
above. If your repository contains an outputs/ wrapper folder instead, select
outputs as the Root Directory. Choose only one of these structures.
No build or install command is required; output is the selected root itself.
vercel.json declares these static-site settings. Clear any old dashboard
overrides pointing to dist/, public/, or a previous framework configuration.

Upload the entire current set, including renamed Studies 3–5 and new Study 6,
so GitHub contains the same numbering as the local folder. Commit changes and
let the connected Vercel project redeploy. Existing deployment settings must
point to the folder containing the hub index.html and vercel.json.

This preparation does not upload, commit, or deploy anything automatically.
