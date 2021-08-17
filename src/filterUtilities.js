export const applyMaskFilter = (keypoints, filterImage, context) => {
    const maskWidth = Math.abs(keypoints[234][0] - keypoints[454][0])
    const maskHeight = Math.abs(keypoints[234][1] - keypoints[152][1]) + 10
    filterImage.width = `${maskWidth}`
    filterImage.height = `${maskHeight}`

    context.drawImage(
        filterImage,
        keypoints[234][0],
        keypoints[234][1] - 10,
        maskWidth,
        maskHeight
    )
}

export const applyDogFilter = (keypoints, leftDogEar, rightDogEar, dogNose, context) => {
    let maskWidth = 50
    let maskHeight = 70
    leftDogEar.width = `${maskWidth}`
    leftDogEar.height = `${maskHeight}`

    context.drawImage(
        leftDogEar,
        keypoints[54][0] - 30,
        keypoints[54][1] - 40,
        maskWidth,
        maskHeight
    )

    maskWidth = 50
    maskHeight = 70
    rightDogEar.width = `${maskWidth}`
    rightDogEar.height = `${maskHeight}`

    context.drawImage(
        rightDogEar,
        keypoints[284][0],
        keypoints[284][1] - 40,
        maskWidth,
        maskHeight
    )

    maskWidth = Math.abs(keypoints[129][0] - keypoints[331][0]) + 10
    maskHeight = 40
    dogNose.width = `${maskWidth}`
    dogNose.height = `${maskHeight}`

    context.drawImage(
        dogNose,
        keypoints[129][0],
        keypoints[129][1] - 20,
        maskWidth,
        maskHeight
    )
}
