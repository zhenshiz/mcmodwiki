<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { Icon } from '@iconify/vue'
import { visibleModList } from '@/assets/info/mod.js'
import Button from '@/components/Button.vue'
import grass from '@/assets/textures/item/grass_block.png'
import book from '@/assets/textures/item/book.png'
import craftingTable from '@/assets/textures/item/crafting_table.png'
import emerald from '@/assets/textures/item/emerald.png'
import diamond from '@/assets/textures/item/diamond.png'
import sapling from '@/assets/textures/item/oak_sapling.png'

const mods = computed(() => visibleModList())
const materials = [grass, book, craftingTable, emerald, diamond, sapling]
const accents = [
  '120 214 224',
  '220 246 99',
  '244 180 121',
  '181 159 215',
  '145 195 145',
  '238 171 180',
]
const browseMods = () => document.getElementById('mods')?.scrollIntoView({ behavior: 'smooth' })
</script>

<template>
  <div class="home-page">
    <section class="home-hero">
      <div class="hero-copy">
        <span class="mc-tag hero-eyebrow"><span class="status-square" /> MINECRAFT MOD WIKI</span>
        <h1>
          {{ t('模组的每一种可能，') }}<br /><span>{{ t('从这里开始。') }}</span>
        </h1>
        <p>{{ t('浏览模组文档，探索玩法与配置，使用可视化工具完成你的下一次创作。') }}</p>
        <div class="hero-actions">
          <Button variant="primary" @click="browseMods"
            >{{ t('浏览模组') }}<Icon icon="lucide:arrow-down" width="18"
          /></Button>
          <RouterLink to="/chatbox/visual" class="hero-tool-link"
            >{{ t('打开 ChatBox 编辑器') }}<Icon icon="lucide:arrow-up-right" width="17"
          /></RouterLink>
        </div>
        <div class="hero-notes">
          <span><Icon icon="lucide:book-open" width="15" />{{ t('模组文档') }}</span
          ><span><Icon icon="lucide:sliders-horizontal" width="15" />{{ t('可视化工具') }}</span
          ><span><Icon icon="lucide:languages" width="15" />{{ t('多语言支持') }}</span>
        </div>
      </div>
      <div class="workbench mc-panel" aria-hidden="true">
        <div class="workbench-title">
          <span>MC / WORKBENCH</span>
          <div><i /><i /><i /></div>
        </div>
        <div class="workbench-body">
          <div class="workbench-caption"><span>BUILD SOMETHING NEW</span><span>01 — 06</span></div>
          <div class="inventory-grid">
            <div v-for="(material, index) in materials" :key="material" class="inventory-slot">
              <img :src="material" alt="" /><span>0{{ index + 1 }}</span>
            </div>
          </div>
          <div class="workbench-footer">
            <span><i /> ENDLESS POSSIBILITIES</span><Icon icon="lucide:move-up-right" width="20" />
          </div>
        </div>
        <div class="grass-strip" />
        <div class="soil-strip" />
      </div>
    </section>

    <section id="mods" class="mod-section">
      <div class="section-heading">
        <div>
          <div class="mc-label">EXPLORE THE COLLECTION</div>
          <h2>
            {{ t('我们的 Minecraft 模组')
            }}<span class="collection-count">{{ String(mods.length).padStart(2, '0') }}</span>
          </h2>
        </div>
        <p>{{ t('选择一个模组，开始探索。') }}</p>
      </div>
      <div class="mod-grid">
        <RouterLink
          v-for="(item, index) in mods"
          :key="item.lang"
          :to="`/wiki/${item.lang}`"
          class="mod-card"
          :style="{ '--card-accent': accents[index % accents.length] }"
        >
          <div class="mod-art">
            <span class="mod-index">0{{ index + 1 }}</span
            ><span class="mc-tag mod-version">v{{ item.modVersion }}</span
            ><img :src="item.icon" :alt="item.lang" loading="lazy" />
          </div>
          <div class="mod-content">
            <h3>{{ item.lang }}</h3>
            <p>{{ item.description }}</p>
            <div class="mod-card-footer">
              <span>{{ t('阅读文档') }}</span
              ><span class="card-arrow"><Icon icon="lucide:arrow-up-right" width="19" /></span>
            </div>
          </div>
        </RouterLink>
      </div>
    </section>

    <footer class="home-footer">
      <span class="font-bold">MCModWiki<span class="footer-dot">■</span></span
      ><span>{{ t('为每一次探索，留下一份指南。') }}</span
      ><span class="mc-label">CRAFTED FOR YOUR WORLD</span>
    </footer>
  </div>
</template>

<style scoped>
.home-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 32px;
}
.home-hero {
  display: grid;
  grid-template-columns: 1.15fr 1fr;
  gap: 64px;
  align-items: center;
  padding: 70px 0 64px;
}
.hero-eyebrow {
  background: rgb(var(--ui-surface));
  box-shadow: 2px 2px 0 rgb(var(--ui-shadow));
  font-size: 10px;
  letter-spacing: 0.08em;
}
.status-square {
  width: 7px;
  height: 7px;
  background: rgb(var(--ui-link));
}
h1 {
  margin: 24px 0 20px;
  font-size: clamp(32px, 3.6vw, 48px);
  font-weight: 850;
  line-height: 1.28;
  letter-spacing: -0.04em;
}
h1 > span {
  position: relative;
  isolation: isolate;
}
h1 > span::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: 2px;
  height: 13px;
  background: rgb(var(--ui-primary));
  z-index: -1;
  opacity: 0.7;
}
.hero-copy > p {
  max-width: 390px;
  color: rgb(var(--ui-muted));
  font-size: 15px;
  line-height: 1.9;
}
.hero-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 25px;
  margin-top: 28px;
}
.hero-tool-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 650;
  padding: 8px 0;
  border-bottom: 1px solid rgb(var(--ui-line));
}
.hero-tool-link:hover {
  color: rgb(var(--ui-link));
  border-color: currentColor;
}
.hero-notes {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-top: 30px;
  color: rgb(var(--ui-muted));
  font-size: 11px;
}
.hero-notes > span {
  display: inline-flex;
  gap: 6px;
  align-items: center;
}
.workbench {
  transform: rotate(1deg);
}
.workbench-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 13px 17px;
  background: rgb(var(--ui-on-accent));
  color: #eaf0e5;
  font: 700 10px monospace;
  letter-spacing: 0.04em;
}
.workbench-title > div {
  display: flex;
  gap: 5px;
}
.workbench-title i {
  width: 7px;
  height: 7px;
  background: #dcf663;
}
.workbench-title i:nth-child(2) {
  background: #78d6e0;
}
.workbench-title i:nth-child(3) {
  background: #f4b479;
}
.workbench-body {
  padding: 24px;
  background: rgb(var(--ui-secondary) / 0.15);
}
.workbench-caption {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  font: 700 9px monospace;
  letter-spacing: 0.03em;
  color: rgb(var(--ui-muted));
  margin-bottom: 17px;
}
.inventory-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}
.inventory-slot {
  position: relative;
  display: grid;
  place-items: center;
  aspect-ratio: 1.22;
  background: rgb(var(--ui-surface));
  border: 2px solid rgb(var(--ui-border));
  box-shadow: inset 3px 3px 0 rgb(var(--ui-line));
}
.inventory-slot img {
  width: 52px;
  height: 52px;
  image-rendering: pixelated;
}
.inventory-slot span {
  position: absolute;
  right: 7px;
  bottom: 5px;
  font: 9px monospace;
  color: rgb(var(--ui-muted));
}
.workbench-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
  font: 700 9px monospace;
}
.workbench-footer > span {
  display: flex;
  gap: 6px;
  align-items: center;
}
.workbench-footer i {
  width: 6px;
  height: 6px;
  background: rgb(var(--ui-link));
}
.grass-strip {
  height: 12px;
  border-top: 2px solid rgb(var(--ui-border));
  background: #719c4b;
}
.soil-strip {
  height: 21px;
  background: repeating-linear-gradient(
    90deg,
    #694e38 0 10px,
    #76583f 10px 20px,
    #604831 20px 30px
  );
}
.mod-section {
  scroll-margin-top: 24px;
  border-top: 2px solid rgb(var(--ui-border));
  padding-top: 32px;
}
.section-heading {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 25px;
}
.section-heading h2 {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-top: 7px;
  font-size: 25px;
  font-weight: 800;
  letter-spacing: -0.03em;
}
.collection-count {
  padding: 3px 7px;
  border: 1px solid rgb(var(--ui-line));
  font: 12px monospace;
  color: rgb(var(--ui-muted));
}
.section-heading p {
  color: rgb(var(--ui-muted));
  font-size: 12px;
  padding-bottom: 3px;
}
.mod-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 24px;
}
.mod-card {
  min-width: 0;
  display: flex;
  flex-direction: column;
  border: 2px solid rgb(var(--ui-border));
  background: rgb(var(--ui-surface));
  box-shadow: 4px 4px 0 rgb(var(--ui-shadow));
  transition:
    transform 140ms,
    box-shadow 140ms;
}
.mod-card:hover {
  transform: translate(-2px, -2px);
  box-shadow: 6px 6px 0 rgb(var(--ui-shadow));
}
.mod-art {
  position: relative;
  height: 160px;
  display: grid;
  place-items: center;
  background-color: rgb(var(--card-accent) / 0.18);
  background-image:
    linear-gradient(rgb(var(--ui-border) / 0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgb(var(--ui-border) / 0.04) 1px, transparent 1px);
  background-size: 20px 20px;
  border-bottom: 2px solid rgb(var(--ui-border));
}
.mod-art > img {
  width: 90px;
  height: 90px;
  object-fit: contain;
  transition: transform 140ms;
}
.mod-card:hover .mod-art > img {
  transform: translateY(-3px);
}
.mod-index {
  position: absolute;
  top: 12px;
  left: 14px;
  color: rgb(var(--ui-muted));
  font: 11px monospace;
}
.mod-version {
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgb(var(--ui-surface));
  font: 10px monospace;
}
.mod-content {
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 19px 20px 14px;
}
.mod-content h3 {
  font-size: 20px;
  font-weight: 800;
  letter-spacing: -0.04em;
}
.mod-content > p {
  margin-top: 6px;
  color: rgb(var(--ui-muted));
  font-size: 13px;
  line-height: 1.8;
}
.mod-card-footer {
  margin-top: auto;
  padding-top: 19px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 12px;
  font-weight: 700;
}
.card-arrow {
  display: grid;
  place-items: center;
  width: 29px;
  height: 29px;
  border: 1px solid rgb(var(--ui-border));
  background: rgb(var(--ui-inset));
}
.mod-card:hover .card-arrow {
  background: rgb(var(--ui-primary));
  color: rgb(var(--ui-on-accent));
}
.home-footer {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
  margin-top: 40px;
  border-top: 1px solid rgb(var(--ui-line));
  padding: 22px 0 30px;
  color: rgb(var(--ui-muted));
  font-size: 11px;
}
.footer-dot {
  margin-left: 8px;
  color: rgb(var(--ui-link));
}
@media (max-width: 1023px) {
  .home-hero {
    gap: 32px;
    padding: 48px 0;
  }
  .workbench-body {
    padding: 18px;
  }
  .inventory-slot img {
    width: 40px;
    height: 40px;
  }
  .mod-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
@media (max-width: 639px) {
  .home-page {
    padding: 0 20px;
  }
  .home-hero {
    grid-template-columns: 1fr;
    gap: 32px;
    padding: 36px 0;
  }
  .hero-copy h1 {
    font-size: 34px;
  }
  .hero-copy > p {
    max-width: 100%;
  }
  .workbench {
    max-width: 420px;
    width: 100%;
    justify-self: center;
    transform: none;
  }
  .workbench-body {
    padding: 20px;
  }
  .inventory-slot {
    aspect-ratio: 1.5;
  }
  .inventory-slot img {
    width: 45px;
    height: 45px;
  }
  .section-heading {
    align-items: flex-start;
    flex-direction: column;
    gap: 10px;
  }
  .section-heading h2 {
    font-size: 22px;
  }
  .mod-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  .mod-art {
    height: 150px;
  }
  .home-footer > .mc-label {
    display: none;
  }
}
</style>
