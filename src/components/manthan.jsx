import React, { useEffect, useRef } from "react";
import DownloadIcon from "../assets/images/Downlaod.png";
import SendIcon from "../assets/images/Enter.png";
import MicOffIcon from "../assets/images/micoff.png";
import MicOnIcon from "../assets/images/micon.png";
import MuteIcon from "../assets/images/mute.png";
import SpeakerIcon from "../assets/images/speak.png";
import { ThreeDotsLoader } from "./loader";

const Manthan = ({
  handleInputChange,
  inputText,
  handleSendButton,
  speaker,
  handleSpeaker,
  mic,
  handleMic,
  handleDownload,
  loading,
  unityInput,
  unityOutput,
  handleKeyDown,
  handleViewDetails,
  showViewButton,
}) => {
  const paragraphRef = useRef(null);

  useEffect(() => {
    if (unityInput.length) {
      paragraphRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [unityInput.length]);

  return (
    <div className="absolute bottom-0 left-0 w-[70%] flex flex-col gap-y-1 z-10">
      <div className="w-full h-[270px] overflow-y-auto relative rounded-lg bg-black bg-opacity-50 ">
        {/* <hr className="h-px bg-gray-400 border-0"></hr> */}
        <div className=" rounded-md overflow-y-auto">
          {unityInput.map((item, index) => {
            return (
              <div key={index}>
                <div
                  className="flex justify-start gap-x-4 mx-5 my-5"
                  ref={paragraphRef}
                >
                  <div className="flex items-center justify-center w-14 h-14 bg-[blue] bg-opacity-35 text-white rounded-full">
                    <span className="text-xl font-semibold">You</span>
                  </div>
                  <div className="flex flex-col relative py-2 px-3 min-w-[150px] max-w-[70%] bg-[blue] bg-opacity-35 text-white rounded-lg ">
                    <span className="leading-5 ">{item?.input}</span>
                    <div className="mt-2 flex justify-end text-[14px]">
                      {item?.time}
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-x-4 mx-5 my-5">
                  <div className="flex flex-col gap-y-2 min-w-[150px] max-w-[70%]">
                    {unityOutput.length > 0 &&
                      unityOutput[index] &&
                      unityOutput[index].map((item, i) => {
                        return (
                          <div
                            key={i}
                            className="flex flex-col relative py-2 px-3 bg-[#d075a4] bg-opacity-35 text-white rounded-lg "
                          >
                            <span className="leading-5 ">{item?.output}</span>
                            <div className="mt-2 flex justify-end text-[12px]">
                              {item?.time}
                            </div>
                          </div>
                        );
                      })}
                    {/* {unityOutput.length > 0 && unityOutput[index] && (
                    <div className="flex flex-col relative py-2 px-3 min-w-[150px] max-w-[70%] bg-[#d075a4] bg-opacity-35 text-white rounded-lg ">
                      <span className="leading-5 ">
                        {unityOutput[index]?.output}
                      </span>
                      <div className="mt-2 flex justify-end text-[14px]">
                        {unityOutput[index]?.time}
                      </div>
                    </div>
                  )} */}
                  </div>
                  {!unityOutput[index] && loading && (
                    <div className="flex flex-col relative py-3 px-3 min-w-[150px] max-w-[70%] bg-[#d075a4] bg-opacity-35 text-white rounded-lg ">
                      <ThreeDotsLoader />
                    </div>
                  )}
                  <div className="flex flex-col justify-end py-3 ">
                    <div className="flex items-center justify-center w-14 h-14 bg-[#d075a4] bg-opacity-35 text-white rounded-full">
                      <span className="text-xl font-semibold">AI</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        {showViewButton && (
          <div className="flex justify-end pb-5">
            <button
              className="mr-5 py-1 px-2 text-[14px] text-white bg-[#3535a9] border border-black rounded-md "
              onClick={handleViewDetails}
            >
              View details
            </button>
          </div>
        )}
      </div>
      <div className=" flex rounded-lg w-full gap-x-5 py-3 px-4 box-border bg-black bg-opacity-60">
        <input
          type="text"
          name="q"
          id="query"
          placeholder="Enter Text ..."
          value={inputText}
          onChange={(e) => handleInputChange(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-[70%] box-border px-4 py-3 text-white rounded-lg border border-black bg-black bg-opacity-50 "
        />
        <button onClick={handleSendButton}>
          <img
            src={SendIcon}
            className="w-[3.2rem] h-[3rem] "
            alt="send-button"
          />
        </button>
        <button onMouseDown={handleMic} onMouseUp={handleMic}>
          <img
            src={mic ? MicOnIcon : MicOffIcon}
            className="w-[3.2rem] h-[3rem] "
            alt="mic-off-button"
          />
        </button>
        <button onClick={handleSpeaker}>
          <img
            src={speaker ? SpeakerIcon : MuteIcon}
            className="w-[3.2rem] h-[3rem] "
            alt="mute-button"
          />
        </button>
        <button onClick={handleDownload}>
          <img
            src={DownloadIcon}
            className="w-[3.2rem] h-[3.1rem] "
            alt="mic-off-button"
          />
        </button>
      </div>
    </div>
  );
};

export default Manthan;
