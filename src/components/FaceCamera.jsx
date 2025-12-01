// src/components/FaceCamera.jsx
import { useEffect, useRef, useState } from 'react'
import * as faceapi from 'face-api.js'

const MODEL_URL = '/models'

// public/faces 밑에 있는 사람 폴더 이름들로 바꿔줘
// 예: public/faces/jumi/1.jpg ... 이면 'jumi'
const LABELS = ['jumi', 'cho', 'yun']

function FaceCamera({ onRecognized }) {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const [status, setStatus] = useState('모델 로딩 중...')
  const recognizedOnceRef = useRef(false)

  useEffect(() => {
    let stream
    let intervalId

    async function loadModels() {
      setStatus('모델 로딩 중...')
      await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL)
      await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL)
      await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL)
      setStatus('모델 로딩 완료, 카메라를 준비 중입니다.')
    }

    async function loadLabeledImages() {
      const labeledDescriptors = []

      for (const label of LABELS) {
        const descriptors = []

        for (let i = 1; i <= 5; i++) {
          const imgUrl = `/faces/${label}/${i}.jpg`
          try {
            const img = await faceapi.fetchImage(imgUrl)
            const detection = await faceapi
              .detectSingleFace(img, new faceapi.TinyFaceDetectorOptions())
              .withFaceLandmarks()
              .withFaceDescriptor()

            if (detection && detection.descriptor) {
              descriptors.push(detection.descriptor)
            }
          } catch (e) {
            console.warn('failed to load face image', imgUrl, e)
          }
        }

        if (descriptors.length > 0) {
          labeledDescriptors.push(
            new faceapi.LabeledFaceDescriptors(label, descriptors)
          )
        }
      }

      return labeledDescriptors
    }

    async function start() {
      try {
        await loadModels()
        const labeledDescriptors = await loadLabeledImages()
        const faceMatcher = new faceapi.FaceMatcher(labeledDescriptors, 0.6)

        // 카메라 열기
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user' },
          audio: false,
        })

        if (!videoRef.current) return
        videoRef.current.srcObject = stream

        videoRef.current.onloadedmetadata = () => {
          const video = videoRef.current
          if (!video) return

          video.play()
          setStatus('카메라 켜짐 – 얼굴을 화면에 맞춰주세요.')

          const canvas = canvasRef.current
          const displaySize = {
            width: video.videoWidth || 640,
            height: video.videoHeight || 480,
          }

          canvas.width = displaySize.width
          canvas.height = displaySize.height

          intervalId = setInterval(async () => {
            if (!video || video.readyState !== 4) return

            const detections = await faceapi
              .detectAllFaces(
                video,
                new faceapi.TinyFaceDetectorOptions({ inputSize: 416 })
              )
              .withFaceLandmarks()
              .withFaceDescriptors()

            const resizedDetections = faceapi.resizeResults(
              detections,
              displaySize
            )

            const context = canvas.getContext('2d')
            context.clearRect(0, 0, canvas.width, canvas.height)

            faceapi.draw.drawDetections(canvas, resizedDetections)

            resizedDetections.forEach((d) => {
              const bestMatch = faceMatcher.findBestMatch(d.descriptor)
              const box = d.detection.box
              const drawBox = new faceapi.draw.DrawBox(box, {
                label: bestMatch.toString(),
              })
              drawBox.draw(canvas)

              if (
                bestMatch.label !== 'unknown' &&
                !recognizedOnceRef.current &&
                onRecognized
              ) {
                recognizedOnceRef.current = true
                onRecognized(bestMatch.label)
                setStatus(`얼굴 인식 완료: ${bestMatch.label}`)
              }
            })
          }, 500)
        }
      } catch (err) {
        console.error(err)
        setStatus(`에러 발생: ${err.message}`)
      }
    }

    start()

    return () => {
      if (intervalId) clearInterval(intervalId)
      if (stream) {
        stream.getTracks().forEach((track) => track.stop())
      }
    }
  }, [onRecognized])

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        background: '#000',
        borderRadius: '12px',
        overflow: 'hidden',
      }}
    >
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: 10,
          left: 10,
          color: 'white',
          fontSize: '0.9rem',
          textShadow: '0 0 4px rgba(0,0,0,0.8)',
          background: 'rgba(0,0,0,0.4)',
          padding: '4px 8px',
          borderRadius: 4,
        }}
      >
        {status}
      </div>
    </div>
  )
}

export default FaceCamera
