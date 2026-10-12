# Siddharshi Detect — AI Media Forensics Platform

[![Website](https://img.shields.io/badge/Live_Site-siddharshi.tech-0b1020?style=for-the-badge&logo=googlechrome&logoColor=78e9dc)](https://siddharshi.tech)
[![Deployment](https://img.shields.io/badge/Deployment-GitHub_Pages-181717?style=for-the-badge&logo=github)](https://siddharshi.tech)
[![Stack](https://img.shields.io/badge/Tech_Stack-HTML5_•_CSS3_•_ES6+-0a84ff?style=for-the-badge)](https://siddharshi.tech)
[![Status](https://img.shields.io/badge/Status-Live_Production-34c759?style=for-the-badge)](https://siddharshi.tech)

**Live Application:** [https://siddharshi.tech](https://siddharshi.tech)

---

## Overview

**Siddharshi Detect** is a digital media forensics web platform designed to analyze images, videos, and audio files for signatures of synthetic generation, deepfake manipulation, and AI artifacts. Built with a dark, high-contrast visual forensics user interface, the platform provides an intuitive, privacy-conscious workspace for digital provenance and authenticity verification.

The web application is deployed in production at [siddharshi.tech](https://siddharshi.tech).

---

## Key Features

- **Multimodal Verification Pipeline**: Specialized inspection workspaces tailored for image, video, and audio assets.
- **Client-Side Privacy First**: Media files are processed and previewed directly in the browser via native HTML5 File and Blob APIs; no media leaves the client during local inspections.
- **Rigorous Client-Side Validation**: Enforces MIME type matching, extension verification, and strict file size caps (up to 20 MB) with clear diagnostics.
- **Dynamic Media Previews**: Instant inline previews for images, video metadata parsing, and dedicated audio inspect modules.
- **Forensic HUD Interface**: Sleek, responsive cyberpunk/forensic aesthetic featuring animated signal analyzers, scanlines, and diagnostic parameter readouts.
- **Modular API Architecture**: Pre-configured integration point for connecting machine learning inference engines and deepfake classification microservices.
- **Evidence-Led Assessment Philosophy**: Emphasizes transparent signal verification to assist human analysts rather than presenting opaque, automated verdicts.

---

## Supported Media Specifications

| Media Type | Formats & Extensions | Accepted MIME Types | Max Size |
| :--- | :--- | :--- | :--- |
| **Images** | `.jpg`, `.jpeg`, `.png`, `.webp` | `image/jpeg`, `image/png`, `image/webp` | 20 MB |
| **Videos** | `.mp4`, `.webm`, `.mov` | `video/mp4`, `video/webm`, `video/quicktime` | 20 MB |
| **Audio** | `.mp3`, `.wav`, `.m4a`, `.aac`, `.ogg` | `audio/mpeg`, `audio/wav`, `audio/mp4`, `audio/x-m4a`, `audio/aac`, `audio/ogg` | 20 MB |

---

## Project Structure

```text
siddharshi-deepfake-detector/
├── index.html        # Semantic HTML5 layout, HUD components, and workspace UI
├── styles.css        # Custom CSS design system (tokens, glassmorphism, animations)
├── script.js         # Reactive UI logic, file validation, previews & API dispatcher
├── CNAME             # Production apex domain configuration (siddharshi.tech)
├── .nojekyll         # Disables Jekyll processing for direct asset serving
└── README.md         # Repository documentation
```

---

## Backend Integration

The frontend includes a plug-and-play API gateway to connect with any deployed deepfake detection model or inference backend.

### Configuration

In [`script.js`](script.js), configure the `API_ENDPOINT` constant:

```javascript
// Set to your deployed detection microservice
const API_ENDPOINT = "https://api.siddharshi.tech/analyze";
```

### Request Payload

The frontend dispatches a `multipart/form-data` `POST` request:

| Field | Type | Description |
| :--- | :--- | :--- |
| `file` | `Binary / File` | The selected media asset (image, video, or audio) |
| `media_type` | `String` | Analysis target: `"image"`, `"video"`, or `"audio"` |

### Backend Requirements

1. **CORS Headers**: Backend must accept `POST` requests originating from `https://siddharshi.tech`.
2. **Server-Side Validation**: Re-validate file size and MIME signatures before inference.
3. **Response Schema**: Return structured JSON containing classification scores, confidence intervals, and detected artifact regions.

---

## Privacy & Limitations

- **Local Preview Security**: Previews utilize temporary browser Object URLs that are automatically revoked on file reset or window unload.
- **Demonstration Mode**: In the absence of an active `API_ENDPOINT`, all operations remain purely client-side without transmitting any user data over the network.
- **Analytical Fallibility**: Deepfake detection systems generate probabilistic signals. Detection scores should be evaluated alongside context, metadata, and independent verification.

---

## Production Deployment

- **Domain**: [https://siddharshi.tech](https://siddharshi.tech)
- **SSL / TLS**: Enforced HTTPS with automatic certificate renewal
- **Infrastructure**: Distributed CDN with apex domain DNS routing
