const createImage = (url) =>
  new Promise((resolve, reject) => {
    const image = new Image()
    image.addEventListener('load', () => resolve(image))
    image.addEventListener('error', (error) => reject(error))
    image.setAttribute('crossOrigin', 'anonymous') // needed to avoid cross-origin issues on CodeSandbox
    image.src = url
  })

function getRadianAngle(degreeValue) {
  return (degreeValue * Math.PI) / 180
}

interface GetCropedImgDTO {
  imageSrc: string
  pixelCrop: { width: number; height: number; x: number; y: number }
  rotation?: number
}

export async function getCroppedImg({ imageSrc, pixelCrop, rotation = 0 }: GetCropedImgDTO) {
  const image = (await createImage(imageSrc)) as any
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')

  const maxSize = Math.max(image.width, image.height)
  const safeArea = 2 * ((maxSize / 2) * Math.sqrt(2))

  canvas.width = safeArea
  canvas.height = safeArea

  ctx.translate(safeArea / 2, safeArea / 2)
  ctx.rotate(getRadianAngle(rotation))
  ctx.translate(-safeArea / 2, -safeArea / 2)

  // draw rotated image and store data.
  ctx.drawImage(image, safeArea / 2 - image.width * 0.5, safeArea / 2 - image.height * 0.5)

  const data = ctx.getImageData(0, 0, safeArea, safeArea)

  // set canvas width to final desired crop size - this will clear existing context
  canvas.width = pixelCrop.width
  canvas.height = pixelCrop.height

  // paste generated rotate image with correct offsets for x,y crop values.
  ctx.putImageData(
    data,
    0 - safeArea / 2 + image.width * 0.5 - pixelCrop.x,
    0 - safeArea / 2 + image.height * 0.5 - pixelCrop.y
  )

  // As Base64 string
  return canvas.toDataURL('image/jpeg')
  // return canvas
}

interface GenerateDownloadDTO {
  imageSrc: string
  crop: { width: number; height: number; x: number; y: number }
}

export const generateDownload = async ({ imageSrc, crop }: GenerateDownloadDTO) => {
  if (!crop || !imageSrc) {
    return
  }

  const canvas = await getCroppedImg({ imageSrc, pixelCrop: crop })

  return canvas
  // canvas.toBlob(
  //   (blob) => {
  //     const previewUrl = window.URL.createObjectURL(blob)
  //     console.log({ previewUrl })

  //     // const anchor = document.createElement('a')
  //     // anchor.download = 'image.jpeg'
  //     // anchor.href = URL.createObjectURL(blob)
  //     // anchor.click()
  //     // window.URL.revokeObjectURL(previewUrl)
  //   },
  //   'image/jpeg',
  //   0.66
  // )
}

// To convert dataUrl (which we get from our blob) to a a file object
export const dataURLtoFile = (dataurl, filename) => {
  const arr = dataurl.split(',')
  const mime = arr[0].match(/:(.*?);/)[1]
  const bstr = atob(arr[1])
  let n = bstr.length
  const u8arr = new Uint8Array(n)

  while (n--) u8arr[n] = bstr.charCodeAt(n)

  return new File([u8arr], filename, { type: mime })
}

export function readFile(file) {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.addEventListener('load', () => resolve(reader.result), false)
    reader.readAsDataURL(file)
  })
}
