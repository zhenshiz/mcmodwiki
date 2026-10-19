import { t } from '@/languages/index.js'

export function diagnosticText(item) {
  const messages = {
    'cross-file': t('暂不支持跨文件跳转，请改为当前文件中的对话组'),
    'missing-group': t('目标组不存在或为空'),
    'dynamic-command': t('指令目标无法静态确定，请手动检查'),
    'mvel-ignored': t('MVEL 保留原样，本版不分析其中的跳转'),
    'inactive-trigger': t('当前组件不会触发此时机，未绘制跳转'),
    'option-event-order': t('选项先执行 next，再执行点击事件；后续跳转的上下文可能改变'),
    'theme-unavailable': t('主题未能读取，主题事件连线可能不完整'),
    'runtime-theme': t('未指定主题，游戏当前主题中的跳转未纳入分析'),
    'invalid-document': t('对话文件缺少有效的 dialogues 对象'),
    'invalid-group': t('对话组必须是数组'),
    'invalid-frame': t('对话必须是有效对象'),
    'invalid-options': t('对话选项必须是数组')
  }
  return `${messages[item.code] || item.code}${item.detail ? ` · ${item.detail}` : ''}`
}
