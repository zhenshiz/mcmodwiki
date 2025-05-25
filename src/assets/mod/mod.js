import MapperPluginIcon from '@/assets/mod/icon/MapperPlugin.png'

const availableHere = {
  CURSE_FORGE: {
    name: 'CurseForge',
    icon: 'simple-icons:curseforge',
    lightColor: '#f16436',
    darkColor: '#f16436'
  },
  MODRINTH: {
    name: 'Modrinth',
    icon: 'simple-icons:modrinth',
    lightColor: '#1cd96a',
    darkColor: '#1cd96a'
  },
  GITHUB: { name: 'Github', icon: 'mdi:github', lightColor: '#000', darkColor: '#fff' },
  GITEE: { name: 'Gitee', icon: 'simple-icons:gitee', lightColor: '#d90013', darkColor: '#d90013' }
}

export const modLoader = [
  { label: 'NeoForge', value: 'NeoForge' },
  { label: 'Fabric', value: 'Fabric' },
  { label: 'Forge', value: 'Forge' }
]

export const modList = [
  {
    lang: 'mod.name.1',
    icon: MapperPluginIcon,
    description: 'mod.description.1',
    availableHere: [{
      icon: availableHere.MODRINTH,
      href: 'https://modrinth.com/mod/mapperplugin'
    }],
    moreUtil: [],
    mcVersion: ['1.21-1.21.1'],
    modLoader: ['NeoForge', 'Fabric'],
    modVersion: ['1.4.4']
  }
]

export const moreUtilList = [
  { lang: 'more.name.1', link: '/chatbox/editor' }
]
