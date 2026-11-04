// 临时显隐标记不参与文件序列化，发送预览时单独应用到副本。
export function applyThemePreviewVisibility(content, model) {
  const hide = (draft, component) => { if (draft && component?._hidden) draft.hidden = true }
  for (const key of ['dialogBox', 'option', 'keyPrompt']) hide(content[key], model?.[key])
  for (const [key, portrait] of Object.entries(model?.portrait || {})) hide(content.portrait?.[key], portrait)
  model?.functionalButton?.forEach((button, index) => hide(content.functionalButton?.[index], button))
  return content
}
