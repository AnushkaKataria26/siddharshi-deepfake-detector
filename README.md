# Siddharshi Detect — Deepfake Detection Frontend

A standalone, static frontend for an AI-generated media detection service. This repository is intentionally independent of any existing project.

## What's included

- Responsive landing page and media-analysis workspace
- Image, video, and audio mode selection
- Drag-and-drop upload and local preview
- File extension, MIME type, and 20 MB size validation
- Demo-only results state that does **not** claim a file is authentic or fake
- Optional backend integration point in `script.js`
- GitHub Pages custom-domain configuration for `siddharshi.tech`

## Run locally

No package manager or build step is required.

```bash
python3 -m http.server 8000
```

Open http://localhost:8000.

## Create a new GitHub repository

Create a new **public** repository named `siddharshi-deepfake-detector` under your GitHub account. Do not import or fork another repository. Upload these files to the repository root, or push this directory with Git:

```bash
git init
git add .
git commit -m "Initial standalone deepfake detection frontend"
git branch -M main
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/siddharshi-deepfake-detector.git
git push -u origin main
```

Replace `YOUR_GITHUB_USERNAME` with your GitHub username.

## Publish on GitHub Pages

1. Open the new repository's **Settings → Pages**.
2. Under **Build and deployment**, select **Deploy from a branch**.
3. Select branch `main`, folder `/ (root)`, and save.
4. In the **Custom domain** field, enter `siddharshi.tech` and save.
5. In the DNS settings for `siddharshi.tech`, configure the records recommended by GitHub Pages. For an apex domain, GitHub documents these A records:
   - `185.199.108.153`
   - `185.199.109.153`
   - `185.199.110.153`
   - `185.199.111.153`
6. Remove conflicting A/AAAA records if they point elsewhere, but do not delete unrelated email records.
7. After DNS resolves, enable **Enforce HTTPS** in Pages settings.

DNS changes can take up to 24 hours. Keep the `CNAME` file in the repository root. Verify the domain and use GitHub's current Pages instructions before changing DNS.

## Connect a real detection backend

The frontend does not include a deepfake detection model. In `script.js`, set `API_ENDPOINT` to your deployed HTTPS API endpoint. The current integration sends a `multipart/form-data` POST request containing:

- `file`: selected media file
- `media_type`: `image`, `video`, or `audio`

The backend must permit browser requests from your website through CORS, validate uploaded files server-side, enforce size/time limits, and return a documented JSON response. Map that response to the results interface before presenting real scores or labels. Do not place API secrets in this public frontend.

## Privacy and limitations

- File previews are generated locally in the browser.
- In demo mode, files are not sent to a server and no authenticity verdict is computed.
- When an API endpoint is configured, selected files are sent to that endpoint.
- A detector can make false-positive and false-negative predictions. Avoid treating a model score as definitive proof.

## Project structure

```text
siddharshi-deepfake-detector/
├── index.html
├── styles.css
├── script.js
├── CNAME
├── .nojekyll
└── README.md
```
