import React, { useRef, useCallback, useEffect } from "react"
import "@tensorflow/tfjs"
import * as facemesh from "@tensorflow-models/face-landmarks-detection"
import { applyDogFilter, applyMaskFilter } from "./filterUtilities"

export const OutputCanvas = (props) => {
  const { filterType } = props
  const frameId = useRef(null)
  const videoRef = useRef(null)
  const canvasReference = useRef(null)

  const setupCamera = useCallback(async (videoElement) => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        width: 640,
        height: 480,
        facingMode: "user",
      },
      audio: true,
    })
    videoElement.srcObject = stream
    return new Promise((resolve) => {
      videoElement.onloadedmetadata = () => {
        videoElement.play()
        resolve()
      }
    })
  }, [])

  const detectFeatureAndApplyFilter = async (model) => {
    if (videoRef.current && canvasReference.current) {
      const videoElement = videoRef.current
      const canvasElement = canvasReference.current
      const context = canvasElement.getContext("2d")

      let leftDogEar, rightDogEar, dogNose, maskFilterImage

      if (filterType) {
        leftDogEar = document.createElement("img")
        leftDogEar.objectFit = "contain"
        leftDogEar.src = "https://i.ibb.co/bFJf33z/dog-ear-right.png"
        rightDogEar = document.createElement("img")
        rightDogEar.objectFit = "contain"
        rightDogEar.src = "https://i.ibb.co/dggwZ1q/dog-ear-left.png"
        dogNose = document.createElement("img")
        dogNose.objectFit = "contain"
        dogNose.onload = renderFrame()
        dogNose.src = "https://i.ibb.co/PWYGkw1/dog-nose.png"
      } else {
        maskFilterImage = document.createElement("img")
        maskFilterImage.objectFit = "contain"
        maskFilterImage.onload = renderFrame()
        maskFilterImage.src = "images/mask.png"
      }

      async function renderFrame() {
        const predictions = await model.estimateFaces({
          input: videoElement,
          returnTensors: false,
          flipHorizontal: false,
          predictIrises: false,
        })
        context.clearRect(0, 0, canvasElement.width, canvasElement.height)
        context.drawImage(
          videoElement,
          0,
          0,
          canvasElement.width,
          canvasElement.height
        )
        if (predictions.length > 0) {
          const keypoints = predictions[0].scaledMesh

          if (filterType) {
            applyDogFilter(keypoints, leftDogEar, rightDogEar, dogNose, context)
          } else {
            applyMaskFilter(keypoints, maskFilterImage, context)
          }
        }
        frameId.current = requestAnimationFrame(renderFrame)
      }
    }
  }

  const cleanUpFrames = useCallback(() => {
    frameId && cancelAnimationFrame(frameId.current)
  }, [frameId])

  useEffect(() => {
    return () => {
      cleanUpFrames()
    }
  }, [])

  const loadCamAndModel = async () => {
    const videoElement = videoRef.current
    const canvasElement = canvasReference.current
    await setupCamera(videoElement)
    const model = await facemesh.load(
      facemesh.SupportedPackages.mediapipeFacemesh
    )
    videoElement.width = videoElement.videoWidth
    videoElement.height = videoElement.videoHeight
    canvasElement.width = videoElement.videoWidth
    canvasElement.height = videoElement.videoHeight

    detectFeatureAndApplyFilter(model)
  }

  useEffect(() => {
    loadCamAndModel()
  }, [])

  return (
    <>
      <video ref={videoRef} id="input" muted></video>
      <canvas
        ref={canvasReference}
        id="canvas"
        style={{
          marginLeft: "auto",
          marginRight: "auto",
          left: 0,
          right: 0,
          textAlign: "center",
          zindex: 9,
        }}
      />
    </>
  )
}
