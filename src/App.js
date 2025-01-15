import React, { useState, useEffect, useRef } from "react";
import { Unity, useUnityContext } from "react-unity-webgl";
import "./App.css";
import Manthan from "./components/manthan";

const formatTime = (date) => {
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  return `${hours}:${minutes}:${seconds}`;
};

function App() {
  const { unityProvider, loadingProgression, isLoaded, sendMessage } =
    useUnityContext({
      loaderUrl: "Build/Build.loader.js",
      dataUrl: "Build/Build.data",
      frameworkUrl: "Build/Build.framework.js",
      codeUrl: "Build/Build.wasm",
    });

  const unityContainerRef = useRef(null);
  const [inputText, setInputText] = useState("");
  const [sendButton, setSendButton] = useState(false);
  const [speaker, setSpeaker] = useState(false);
  const [mic, setMic] = useState(false);
  const [download, setDownload] = useState(false);
  const [loading, setLoading] = useState(false);
  const [unityInput, setUnityInput] = useState([]);
  const [unityOutput, setUnityOutput] = useState([]);
  const [sceneActivate, setSceneActivate] = useState("deactivate");
  const [showViewButton, setShowViewButton] = useState(false);
  const [viewDetails, setViewDetails] = useState(false);

  const handleInputChange = (input) => {
    setInputText(input);
  };

  const handleSendButton = () => {
    setSendButton(true);
  };

  const handleSpeaker = () => {
    setSpeaker(!speaker);
  };

  const handleMic = () => {
    setMic(!mic);
  };

  const handleDownload = () => {
    setDownload(true);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      setSendButton(true);
    }
  };

  const handleViewDetails = () => {
    setViewDetails(true);
  };

  useEffect(() => {
    const unityContainer = unityContainerRef.current;
    const handleResize = () => {
      const canvas = unityContainer.querySelector("canvas");
      if (canvas) {
        canvas.style.width = "100vw";
        canvas.style.height = "100vh";
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    };
    window.addEventListener("resize", handleResize);

    if (isLoaded) {
      handleResize();
    }
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [isLoaded, inputText]);

  useEffect(() => {
    // Send data to Unity when Unity is loaded and input changes
    if (isLoaded) {
      if (sendButton) {
        let inputArr = unityInput;
        if (!inputText) {
          setSendButton(false);
          return;
        }
        inputArr.push({ input: inputText, time: formatTime(new Date()) });
        setUnityInput(inputArr);
        sendMessage("Scripts", "sendQueryWebgl", inputText);
        setSendButton(false);
        setLoading(true);
        setInputText("");
        setShowViewButton(false);
      }
    }
  }, [inputText, isLoaded, sendButton, sendMessage]);

  useEffect(() => {
    if (isLoaded) {
      sendMessage("VoiceRecognition", "handleMicWebgl", String(mic));
    }
  }, [isLoaded, sendMessage, mic]);

  useEffect(() => {
    if (isLoaded) {
      sendMessage("Scripts", "handleSpeakerWebgl", String(speaker));
    }
  }, [isLoaded, speaker, sendMessage]);

  useEffect(() => {
    if (isLoaded && download) {
      sendMessage("FileDownloader", "DownloadTextFile", String(download));
      setDownload(false);
    }
  }, [isLoaded, download, sendMessage]);

  useEffect(() => {
    if (isLoaded && viewDetails) {
      sendMessage("Scripts", "downloadTableEntries", String(viewDetails));
      setViewDetails(false);
    }
  }, [isLoaded, viewDetails, sendMessage]);

  window.onApiResponse = (message) => {
    console.log("Message from Unity: ", message);
    let outputArr = unityOutput;
    if (unityInput.length > unityOutput.length) {
      outputArr.push([{ output: message, time: formatTime(new Date()) }]);
    } else {
      outputArr[outputArr.length - 1].push({
        output: message,
        time: formatTime(new Date()),
      });
    }
    setUnityOutput(outputArr);
    setLoading(false);
  };

  window.onMicResponse = (message) => {
    console.log("Message from Unity for mic: ", message);
    setInputText(message);
  };

  //For activating and dectivating the chat panel in webgl
  window.chatPanel = (message) => {
    console.log("Scene loaded ", message);
    setSceneActivate(message);
    if (message === "deactivate") {
      setUnityInput([]);
      setUnityOutput([]);
      setShowViewButton(false);
    }
  };

  window.showViewDetails = (message) => {
    console.log("show view button ", message);
    setShowViewButton(message);
  };

  return (
    <div
      ref={unityContainerRef}
      className="unity-container relative w-full h-screen"
    >
      {!isLoaded && (
        <p>Loading Application... {Math.round(loadingProgression * 100)}%</p>
      )}
      <Unity
        unityProvider={unityProvider}
        style={{ visibility: isLoaded ? "visible" : "hidden" }}
      />
      {isLoaded && sceneActivate === "activate" && (
        <Manthan
          handleInputChange={handleInputChange}
          inputText={inputText}
          handleSendButton={handleSendButton}
          speaker={speaker}
          handleSpeaker={handleSpeaker}
          mic={mic}
          handleMic={handleMic}
          download={download}
          handleDownload={handleDownload}
          loading={loading}
          unityInput={unityInput}
          unityOutput={unityOutput}
          handleKeyDown={handleKeyDown}
          handleViewDetails={handleViewDetails}
          showViewButton={showViewButton}
        />
      )}
    </div>
  );
}

export default App;
