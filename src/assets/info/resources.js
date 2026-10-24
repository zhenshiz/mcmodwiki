// 新增资源只需在这里维护信息，站内下载文件放入 public/downloads/ 对应目录。
export default [
  {
    id: 'flashlight',
    title: '手电筒模组',
    category: 'mod',
    icon: 'lucide:flashlight',
    description: '提供手持手电筒、固定照明支架与可调节的舞台摇头灯，适合地图制作和场景布光。',
    tags: ['手电筒', 'NeoForge', '1.21.1'],
    docs: '/wiki/Flashlight',
    usage: '许可证：GNU LGPL 3.0。',
    releases: [
      {
        version: '1.0.0',
        minecraft: ['1.21.1'],
        loaders: ['NeoForge'],
        dependencies: ['LDLib2', 'Photon', 'Kilagraph'],
        optionalDependencies: ['TaCZ', 'Curios', 'Create Aeronautics'],
        filename: 'Flashlight-neoforge-1.21.1-1.0.0.jar',
        url: '/downloads/flashlight/Flashlight-neoforge-1.21.1-1.0.0.jar',
        size: '122.7 KiB',
      },
    ],
  },
]

// 前置/联动模组的 CurseForge 页面 slug，下载弹窗按名称生成跳转按钮；新增依赖时在此维护。
const curseforgeSlugs = {
  LDLib2: 'ldlib',
  Photon: 'photon',
  Kilagraph: 'kilagraph',
  TaCZ: 'timeless-and-classics-zero',
  Curios: 'curios',
  'Create Aeronautics': 'create-aeronautics',
}

export const curseforgeModUrl = (name) =>
  curseforgeSlugs[name] ? `https://www.curseforge.com/minecraft/mc-mods/${curseforgeSlugs[name]}` : null
