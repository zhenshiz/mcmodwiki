import ChatBox from '@/assets/mod/icon/cahtbox.png'
import ViScriptShop from '@/assets/mod/icon/ViScriptShop.png'

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

export const modList = [
  {
    lang: 'mod.name.1',
    icon: ChatBox,
    description: 'mod.description.1',
    availableHere: [
      {
        icon: availableHere.MODRINTH,
        href: 'https://modrinth.com/mod/chatbox',
      },
      {
        icon: availableHere.GITHUB,
        href: 'https://github.com/zhenshiz/chatbox/',
      },
      {
        icon: availableHere.CURSE_FORGE,
        href: 'https://www.curseforge.com/minecraft/mc-mods/chatbox-for-mc',
      },
    ],
    moreUtil: [{
      lang: 'more.name.1',
      router: '/chatbox/theme'
    }],
    modVersion: '1.1'
  },
  {
    lang: 'mod.name.2',
    icon: ViScriptShop,
    description: 'mod.description.2',
    availableHere: [
      {
        icon: availableHere.MODRINTH,
        href: 'https://modrinth.com/mod/viscriptshop',
      },
      {
        icon: availableHere.GITHUB,
        href: 'https://github.com/zhenshiz/ViScriptShop',
      },
      {
        icon: availableHere.CURSE_FORGE,
        href: 'https://www.curseforge.com/minecraft/mc-mods/viscriptshop',
      },
    ],
    moreUtil: [],
    modVersion: '1.0.4'
  }
]

export const moreUtilList = [{ lang: 'more.name.1', link: '/chatbox/theme' }]
