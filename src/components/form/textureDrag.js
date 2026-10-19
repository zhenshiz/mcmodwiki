export const TEXTURE_DRAG_TYPE = 'application/x-chatbox-texture'

export const isTextureDrag = (dataTransfer) =>
  Array.from(dataTransfer?.types || []).includes(TEXTURE_DRAG_TYPE)
