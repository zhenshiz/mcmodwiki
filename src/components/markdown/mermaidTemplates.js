// All 22 diagram families bundled with Mermaid 11.12.2, including all five C4 views.
// Node IDs stay simple; visible labels can be edited without changing relationships.
export const mermaidTemplates = [
  {
    id: 'flowchart',
    label: '流程图',
    keyword: 'flowchart',
    code: `flowchart TD
  A[开始] --> B{是否满足条件}
  B -->|是| C[执行任务]
  B -->|否| D[结束]
  C --> D`,
  },
  {
    id: 'sequence',
    label: '时序图',
    keyword: 'sequenceDiagram',
    code: `sequenceDiagram
  participant Player as 玩家
  participant Server as 服务器
  Player->>Server: 请求领取任务
  Server-->>Player: 返回任务详情
  Player->>Server: 提交任务
  Server-->>Player: 发放奖励`,
  },
  {
    id: 'class',
    label: '类图',
    keyword: 'classDiagram',
    code: `classDiagram
  class Player {
    +String name
    +int level
    +acceptQuest()
  }
  class Quest {
    +String title
    +complete()
  }
  Player "1" --> "many" Quest : accepts`,
  },
  {
    id: 'state',
    label: '状态图',
    keyword: 'stateDiagram-v2',
    code: `stateDiagram-v2
  [*] --> Locked
  Locked --> Available: 解锁
  Available --> Active: 接取
  Active --> Completed: 完成
  Completed --> [*]`,
  },
  {
    id: 'er',
    label: '实体关系图',
    keyword: 'erDiagram',
    code: `erDiagram
  PLAYER ||--o{ QUEST : accepts
  QUEST ||--o{ REWARD : grants
  PLAYER {
    int id PK
    string name
  }
  QUEST {
    int id PK
    string title
  }
  REWARD {
    int id PK
    int amount
  }`,
  },
  {
    id: 'journey',
    label: '用户旅程图',
    keyword: 'journey',
    code: `journey
  title 新玩家体验
  section 初次进入
    阅读指引: 4: 玩家
    领取装备: 5: 玩家, 向导
  section 开始探索
    寻找目标: 3: 玩家
    完成任务: 5: 玩家`,
  },
  {
    id: 'gantt',
    label: '甘特图',
    keyword: 'gantt',
    code: `gantt
  title 模组制作计划
  dateFormat YYYY-MM-DD
  section 设计
    需求整理 :done, design, 2026-01-01, 3d
    原型制作 :active, prototype, after design, 5d
  section 实现
    功能开发 :dev, after prototype, 7d
    测试发布 :after dev, 3d`,
  },
  {
    id: 'pie',
    label: '饼图',
    keyword: 'pie',
    code: `pie showData
  title 资源分布
  "木材" : 40
  "石材" : 35
  "矿物" : 25`,
  },
  {
    id: 'quadrant',
    label: '象限图',
    keyword: 'quadrantChart',
    code: `quadrantChart
  title 功能优先级
  x-axis "低成本" --> "高成本"
  y-axis "低收益" --> "高收益"
  quadrant-1 "重点投入"
  quadrant-2 "优先实现"
  quadrant-3 "暂缓开发"
  quadrant-4 "谨慎评估"
  "新手指引": [0.2, 0.8]
  "新维度": [0.8, 0.9]
  "装饰方块": [0.3, 0.3]`,
  },
  {
    id: 'requirement',
    label: '需求图',
    keyword: 'requirementDiagram',
    code: `requirementDiagram
  requirement save_progress {
    id: 1
    text: Save player progress
    risk: medium
    verifymethod: test
  }
  element save_system {
    type: module
  }
  save_system - satisfies -> save_progress`,
  },
  {
    id: 'git',
    label: 'Git 分支图',
    keyword: 'gitGraph',
    code: `gitGraph
  commit id: "初始化"
  branch feature
  checkout feature
  commit id: "添加功能"
  checkout main
  commit id: "修复问题"
  merge feature
  commit id: "发布版本"`,
  },
  {
    id: 'c4-context',
    label: 'C4 系统上下文图',
    keyword: 'C4Context',
    code: `C4Context
  title 游戏系统上下文
  Person(player, "玩家", "参与游戏")
  System(game, "游戏服务器", "运行模组与世界")
  System_Ext(wiki, "模组百科", "提供使用文档")
  Rel(player, game, "游玩")
  Rel(player, wiki, "查阅")`,
  },
  {
    id: 'c4-container',
    label: 'C4 容器图',
    keyword: 'C4Container',
    code: `C4Container
  title 游戏系统容器
  Person(player, "玩家")
  System_Boundary(game, "游戏系统") {
    Container(client, "客户端", "Minecraft", "展示游戏界面")
    Container(server, "服务器", "Java", "处理游戏逻辑")
    ContainerDb(data, "存档", "文件", "保存玩家数据")
  }
  Rel(player, client, "操作")
  Rel(client, server, "同步")
  Rel(server, data, "读写")`,
  },
  {
    id: 'c4-component',
    label: 'C4 组件图',
    keyword: 'C4Component',
    code: `C4Component
  title 任务系统组件
  Container_Boundary(mod, "任务模组") {
    Component(api, "任务接口", "Java", "接收玩家操作")
    Component(service, "任务服务", "Java", "计算任务进度")
    ComponentDb(store, "任务存储", "NBT", "持久化任务")
  }
  Rel(api, service, "调用")
  Rel(service, store, "读写")`,
  },
  {
    id: 'c4-dynamic',
    label: 'C4 动态图',
    keyword: 'C4Dynamic',
    code: `C4Dynamic
  title 任务领取过程
  Person(player, "玩家")
  Container(server, "服务器", "Java")
  ContainerDb(data, "存档", "NBT")
  Rel(player, server, "1. 请求任务")
  Rel(server, data, "2. 保存进度")
  Rel(server, player, "3. 返回结果")`,
  },
  {
    id: 'c4-deployment',
    label: 'C4 部署图',
    keyword: 'C4Deployment',
    code: `C4Deployment
  title 游戏服务部署
  Deployment_Node(device, "玩家电脑", "桌面系统") {
    Container(client, "游戏客户端", "Minecraft")
  }
  Deployment_Node(host, "服务主机", "Linux") {
    Container(server, "游戏服务器", "Java")
    ContainerDb(data, "世界存档", "文件")
  }
  Rel(client, server, "连接")
  Rel(server, data, "读写")`,
  },
  {
    id: 'mindmap',
    label: '思维导图',
    keyword: 'mindmap',
    code: `mindmap
  root((模组设计))
    玩法
      探索
      战斗
    内容
      方块
      物品
    支持
      文档
      本地化`,
  },
  {
    id: 'timeline',
    label: '时间线',
    keyword: 'timeline',
    code: `timeline
  title 模组发布历程
  2026 Q1 : 玩法原型 : 核心功能
  2026 Q2 : 封闭测试
  2026 Q3 : 公开发布 : 文档上线`,
  },
  {
    id: 'sankey',
    label: '桑基图',
    keyword: 'sankey-beta',
    code: `sankey-beta

Wood,Crafting,30
Wood,Fuel,10
Ore,Furnace,25
Fuel,Furnace,10
Furnace,Ingots,35`,
  },
  {
    id: 'xychart',
    label: 'XY 图',
    keyword: 'xychart-beta',
    code: `xychart-beta
  title "资源产量"
  x-axis [Mon, Tue, Wed, Thu, Fri]
  y-axis "数量" 0 --> 100
  bar [20, 35, 50, 70, 90]
  line [15, 30, 45, 60, 80]`,
  },
  {
    id: 'block',
    label: '块图',
    keyword: 'block-beta',
    code: `block-beta
  columns 3
  A["输入"] B["处理"] C["输出"]
  A --> B
  B --> C`,
  },
  {
    id: 'packet',
    label: '数据包图',
    keyword: 'packet-beta',
    code: `packet-beta
  0-7: "类型"
  8-15: "标志"
  16-31: "数据长度"
  32-63: "玩家 ID"
  64-95: "数据内容"`,
  },
  {
    id: 'kanban',
    label: '看板',
    keyword: 'kanban',
    code: `kanban
  todo[待办]
    docs[编写文档]
    balance[调整平衡]
  active[进行中]
    feature[开发新功能]
  done[已完成]
    prototype[完成原型]`,
  },
  {
    id: 'architecture',
    label: '架构图',
    keyword: 'architecture-beta',
    code: `architecture-beta
  group game(cloud)[Game]
  service client(internet)[Client] in game
  service server(server)[Server] in game
  service data(database)[Save] in game
  client:R --> L:server
  server:R --> L:data`,
  },
  {
    id: 'radar',
    label: '雷达图',
    keyword: 'radar-beta',
    code: `radar-beta
  title 角色能力
  axis atk["攻击"], def["防御"], speed["速度"], magic["魔法"], health["生命"]
  curve warrior["战士"]{8, 9, 4, 2, 9}
  curve mage["法师"]{3, 4, 6, 10, 5}
  max 10`,
  },
  {
    id: 'treemap',
    label: '矩形树图',
    keyword: 'treemap-beta',
    code: `treemap-beta
  "资源"
    "建筑材料"
      "木材": 40
      "石材": 30
    "矿物"
      "铁": 20
      "金": 10`,
  },
]
