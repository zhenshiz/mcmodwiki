import ChatBox from '@/assets/textures/mod/cahtbox.png'
import ViScriptShop from '@/assets/textures/mod/ViScriptShop.png'
import { t } from '@/languages/index.js'

const availableHere = {
  CURSE_FORGE: {
    name: 'CurseForge',
    icon: 'simple-icons:curseforge',
    lightColor: '#f16436',
    darkColor: '#f16436',
  },
  MODRINTH: {
    name: 'Modrinth',
    icon: 'simple-icons:modrinth',
    lightColor: '#1cd96a',
    darkColor: '#1cd96a',
  },
  GITHUB: { name: 'Github', icon: 'mdi:github', lightColor: '#000', darkColor: '#fff' },
  GITEE: { name: 'Gitee', icon: 'simple-icons:gitee', lightColor: '#d90013', darkColor: '#d90013' },
}

export const modLoader = [
  { label: 'NeoForge', value: 'NeoForge' },
  { label: 'Fabric', value: 'Fabric' },
  { label: 'Forge', value: 'Forge' },
]

export const moreUtilList = () => {
  return [{
    lang: t('JSON生成器'),
    router: '/chatbox/visual'
  }]
}

export const modList = () => {
  return [
    {
      lang: 'ChatBox',
      icon: ChatBox,
      description: t('打造沉浸式RPG/GAL剧情体验'),
      availableHere: [
        {
          icon: availableHere.MODRINTH,
          href: 'https://modrinth.com/mod/chatbox'
        },
        {
          icon: availableHere.GITHUB,
          href: 'https://github.com/zhenshiz/chatbox/'
        },
        {
          icon: availableHere.CURSE_FORGE,
          href: 'https://www.curseforge.com/minecraft/mc-mods/chatbox-for-mc'
        }
      ],
      moreUtil: () => [moreUtilList()[0]],
      modVersion: '1.1'
    },
    {
      lang: 'ViScriptShop',
      icon: ViScriptShop,
      description: t('更加现代化的商店系统'),
      availableHere: [
        {
          icon: availableHere.MODRINTH,
          href: 'https://modrinth.com/mod/viscriptshop'
        },
        {
          icon: availableHere.GITHUB,
          href: 'https://github.com/zhenshiz/ViScriptShop'
        },
        {
          icon: availableHere.CURSE_FORGE,
          href: 'https://www.curseforge.com/minecraft/mc-mods/viscriptshop'
        }
      ],
      moreUtil: ()=>[],
      modVersion: '1.0.6'
    }
  ]
}
