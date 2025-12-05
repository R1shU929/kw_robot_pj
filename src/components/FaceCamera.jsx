// src/components/FaceCamera.jsx
import { useEffect, useRef, useState } from 'react'
import * as faceapi from 'face-api.js'

const MODEL_URL = '/models'

// public/faces 폴더의 사람 이름들
const LABELS = ['jumi', 'cho', 'yun', 'bae']

function FaceCamera({ onRecognized }) {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const [status, setStatus] = useState('모델 로딩 중...')

  // ⭐ 재인식을 위한 throttle 시간 저장
  const lastRecognizedTimeRef = useRef(0)

  useEffect(() => {
    let stream
    let intervalId

    async function loadModels() {
      setStatus('모델 로딩 중...')
      await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL)
      await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL)
      await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL)
      setStatus('모델 로딩 완료, 카메라 준비 중...')
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

        // ⭐ 카메라 실행
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

            const ctx = canvas.getContext('2d')
            ctx.clearRect(0, 0, canvas.width, canvas.height)

            faceapi.draw.drawDetections(canvas, resizedDetections)

            resizedDetections.forEach((d) => {
              const bestMatch = faceMatcher.findBestMatch(d.descriptor)

              const box = d.detection.box
              const drawBox = new faceapi.draw.DrawBox(box, {
                label: bestMatch.toString(),
              })
              drawBox.draw(canvas)

              // ==========================================================
              // ⭐ 변경된 재인식 방식: 1.5초 마다 재인식 허용
              // ⭐ 그리고 label에서 거리값 제거 (출석 오류 해결 핵심)
              // ==========================================================
              if (bestMatch.label !== 'unknown') {
                const now = Date.now()

                if (now - lastRecognizedTimeRef.current > 1500) {
                  lastRecognizedTimeRef.current = now

                  // 🎯 label 정제: "yun (0.43)" → "yun"
                  const pureLabel = bestMatch.label.split(' ')[0]

                  onRecognized?.(pureLabel)
                  setStatus(`얼굴 인식됨: ${pureLabel}`)
                }
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

    // cleanup
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
