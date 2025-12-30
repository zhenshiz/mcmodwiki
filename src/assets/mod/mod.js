import MapperPluginIcon from '@/assets/mod/icon/MapperPlugin.png'
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
    icon: MapperPluginIcon,
    description: 'mod.description.1',
    availableHere: [
      {
        icon: availableHere.MODRINTH,
        href: 'https://modrinth.com/mod/mapperplugin',
      },
    ],
    moreUtil: [],
    mcVersion: ['1.21-1.21.1'],
    modLoader: ['NeoForge', 'Fabric'],
    modVersion: ['1.4.4'],
  },
  {
    lang: 'mod.name.2',
    icon: ChatBox,
    description: 'mod.description.2',
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
    mcVersion: ['1.21.1'],
    modLoader: ['NeoForge'],
    modVersion: ['1.0.9', '1.0.8', '1.0.7', '1.0.6', '1.0.5', '1.0.4', '1.0.3', '1.0.2', '1.0.1']
  },
  {
    lang: 'mod.name.3',
    icon: ViScriptShop,
    description: 'mod.description.3',
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
    mcVersion: ['1.21.1'],
    modLoader: ['NeoForge'],
    modVersion: ['1.0.1', '1.0.0']
  }
]

export const moreUtilList = [{ lang: 'more.name.1', link: '/chatbox/theme' }]
