export const getHeadUrl = (val) => {
  if (!val || val === '@s') {
    return 'https://visage.surgeplay.com/face/128/c06f89064c8a49119c29ea1dbd1aab82'
  }

  return `https://visage.surgeplay.com/face/128/${val}`
}
