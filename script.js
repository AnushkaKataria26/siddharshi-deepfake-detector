(() => {
  "use strict";

  // Set this to your deployed backend endpoint when a real detector is ready.
  // Example: const API_ENDPOINT = "https://api.siddharshi.tech/analyze";
  const API_ENDPOINT = "";
  const MAX_SIZE = 20 * 1024 * 1024;
  const modes = {
    image: { label: "Image file", accept: "image/jpeg,image/png,image/webp", extensions: [".jpg", ".jpeg", ".png", ".webp"], formats: "JPG, PNG, WEBP", preview: "image" },
    video: { label: "Video file", accept: "video/mp4,video/webm,video/quicktime", extensions: [".mp4", ".webm", ".mov"], formats: "MP4, WEBM, MOV", preview: "video" },
    audio: { label: "Audio file", accept: "audio/mpeg,audio/wav,audio/mp4,audio/x-m4a,audio/aac,audio/ogg", extensions: [".mp3", ".wav", ".m4a", ".aac", ".ogg"], formats: "MP3, WAV, M4A, AAC, OGG", preview: "audio" }
  };
  const input = document.getElementById("file-input");
  const dropzone = document.getElementById("dropzone");
  const browse = document.getElementById("browse-btn");
  const preview = document.getElementById("file-preview");
  const previewThumb = document.getElementById("preview-thumb");
  const fileName = document.getElementById("file-name");
  const fileDetails = document.getElementById("file-details");
  const analyzeBtn = document.getElementById("analyze-btn");
  const notice = document.getElementById("notice");
  const resultPanel = document.getElementById("result-panel");
  let mode = "image";
  let selectedFile = null;
  let previewUrl = null;

  function formatBytes(bytes) {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  }
  function showNotice(message) {
    notice.textContent = message;
    notice.classList.remove("hidden");
  }
  function clearNotice() {
    notice.textContent = "";
    notice.classList.add("hidden");
  }
  function releasePreview() {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    previewUrl = null;
  }
  function setMode(nextMode) {
    mode = nextMode;
    document.querySelectorAll(".mode-tab").forEach(button => {
      const active = button.dataset.mode === mode;
      button.classList.toggle("active", active);
      button.setAttribute("aria-selected", String(active));
    });
    input.accept = modes[mode].accept;
    document.getElementById("file-spec").innerHTML = `${modes[mode].formats} <span>·</span> Max 20 MB`;
    document.getElementById("param-type").textContent = modes[mode].label;
    resetFile();
    clearNotice();
  }
  function resetFile() {
    selectedFile = null;
    releasePreview();
    input.value = "";
    preview.classList.add("hidden");
    dropzone.classList.remove("hidden");
    analyzeBtn.disabled = true;
    resultPanel.classList.add("hidden");
  }
  function isValidFile(file) {
    const lowerName = file.name.toLowerCase();
    const validExtension = modes[mode].extensions.some(ext => lowerName.endsWith(ext));
    const validMime = !file.type || file.type.startsWith(`${mode}/`) ||
      (mode === "image" && file.type.startsWith("image/")) ||
      (mode === "video" && file.type.startsWith("video/")) ||
      (mode === "audio" && file.type.startsWith("audio/"));
    if (!validExtension || !validMime) {
      showNotice(`That file does not match the selected ${mode} mode. Choose: ${modes[mode].formats}.`);
      return false;
    }
    if (file.size > MAX_SIZE) {
      showNotice("This file exceeds the 20 MB limit. Choose a smaller file.");
      return false;
    }
    if (file.size === 0) {
      showNotice("This file is empty. Choose a different file.");
      return false;
    }
    return true;
  }
  function acceptFile(file) {
    clearNotice();
    if (!file || !isValidFile(file)) return;
    resetFile();
    selectedFile = file;
    previewUrl = URL.createObjectURL(file);
    fileName.textContent = file.name;
    fileDetails.textContent = `${mode[0].toUpperCase() + mode.slice(1)} · ${formatBytes(file.size)}`;
    previewThumb.replaceChildren();
    if (mode === "image") {
      const img = document.createElement("img");
      img.src = previewUrl;
      img.alt = "Selected image preview";
      previewThumb.appendChild(img);
    } else if (mode === "video") {
      const video = document.createElement("video");
      video.src = previewUrl;
      video.muted = true;
      video.preload = "metadata";
      previewThumb.appendChild(video);
    } else {
      const audioMark = document.createElement("span");
      audioMark.textContent = "∿ AUDIO";
      previewThumb.appendChild(audioMark);
    }
    dropzone.classList.add("hidden");
    preview.classList.remove("hidden");
    analyzeBtn.disabled = false;
  }

  document.querySelectorAll(".mode-tab").forEach(button => {
    button.addEventListener("click", () => setMode(button.dataset.mode));
  });
  browse.addEventListener("click", event => { event.stopPropagation(); input.click(); });
  dropzone.addEventListener("click", event => {
    if (event.target.closest("button")) return;
    input.click();
  });
  dropzone.addEventListener("keydown", event => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      input.click();
    }
  });
  input.addEventListener("change", () => {
    if (input.files && input.files[0]) acceptFile(input.files[0]);
  });
  ["dragenter", "dragover"].forEach(name => dropzone.addEventListener(name, event => {
    event.preventDefault();
    dropzone.classList.add("dragging");
  }));
  ["dragleave", "drop"].forEach(name => dropzone.addEventListener(name, event => {
    event.preventDefault();
    dropzone.classList.remove("dragging");
  }));
  dropzone.addEventListener("drop", event => {
    const file = event.dataTransfer && event.dataTransfer.files[0];
    if (file) acceptFile(file);
  });
  document.getElementById("remove-file").addEventListener("click", () => {
    resetFile();
    clearNotice();
  });
  document.getElementById("reset-analysis").addEventListener("click", () => {
    resetFile();
    clearNotice();
    document.getElementById("analyzer").scrollIntoView({ behavior: "smooth", block: "start" });
  });

  analyzeBtn.addEventListener("click", async () => {
    if (!selectedFile) return;
    clearNotice();
    analyzeBtn.disabled = true;
    analyzeBtn.innerHTML = "Preparing file <span>…</span>";
    resultPanel.classList.add("hidden");
    try {
      if (API_ENDPOINT) {
        const formData = new FormData();
        formData.append("file", selectedFile);
        formData.append("media_type", mode);
        const response = await fetch(API_ENDPOINT, { method: "POST", body: formData });
        if (!response.ok) throw new Error(`Analysis service returned HTTP ${response.status}.`);
        const result = await response.json();
        // Replace this presentation with fields from your backend's documented response schema.
        // Do not assume any response field represents a calibrated probability unless the model supports it.
        showNotice("The API responded successfully, but its response schema has not yet been mapped to the results UI. Inspect the response in your browser's Network panel.");
        console.info("Detection API response:", result);
      } else {
        resultPanel.classList.remove("hidden");
        resultPanel.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    } catch (error) {
      showNotice(`Could not complete analysis: ${error.message} Check that your backend is running and configured for browser requests (CORS).`);
    } finally {
      analyzeBtn.disabled = !selectedFile;
      analyzeBtn.innerHTML = 'Analyze media <span>→</span>';
    }
  });

  window.addEventListener("beforeunload", releasePreview);
})();