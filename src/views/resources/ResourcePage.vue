<script setup>
import { computed, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { Icon } from '@iconify/vue'
import Button from '@/components/Button.vue'
import Modal from '@/components/Modal.vue'
import { t } from '@/languages'
import resourceData, { curseforgeModUrl } from '@/assets/info/resources.js'

const search = ref('')
const category = ref('all')
const minecraft = ref('all')
const selectedResource = ref(null)
const detailsVisible = ref(false)
const categories = computed(() => [
  { id: 'all', label: t('全部资源'), icon: 'lucide:layout-grid' },
  { id: 'mod', label: t('独立模组'), icon: 'lucide:box' },
  { id: 'nbt', label: t('NBT 作品'), icon: 'lucide:file-box' },
  { id: 'other', label: t('其他文件'), icon: 'lucide:files' },
])
const categoryInfo = (id) => categories.value.find((item) => item.id === id)
const resources = computed(() =>
  resourceData.map((item) => ({
    ...item,
    title: t(item.title),
    description: t(item.description),
    tags: item.tags.map((tag) => t(tag)),
    usage: item.usage ? t(item.usage) : '',
  })),
)
const versions = computed(() =>
  [...new Set(resources.value.flatMap((item) => item.releases.flatMap((r) => r.minecraft)))].sort(
    (a, b) => b.localeCompare(a, undefined, { numeric: true }),
  ),
)
const availableCount = computed(() => resources.value.filter((item) => item.releases.length).length)
const filteredResources = computed(() => {
  const query = search.value.trim().toLocaleLowerCase()
  return resources.value.filter((item) => {
    if (category.value !== 'all' && item.category !== category.value) return false
    if (
      minecraft.value !== 'all' &&
      !item.releases.some((r) => r.minecraft.includes(minecraft.value))
    )
      return false
    const text = [
      item.title,
      item.description,
      ...item.tags,
      ...item.releases.flatMap((r) => [r.version, ...r.minecraft, ...r.loaders]),
    ]
      .join(' ')
      .toLocaleLowerCase()
    return !query || text.includes(query)
  })
})
const countCategory = (id) =>
  resources.value.filter((item) => id === 'all' || item.category === id).length
const downloadUrl = (url) =>
  url.startsWith('https://') ? url : `${import.meta.env.BASE_URL}${url.replace(/^\//, '')}`
const latestRelease = (item) =>
  item.releases.find(
    (release) => minecraft.value === 'all' || release.minecraft.includes(minecraft.value),
  )
const showDetails = (item) => {
  selectedResource.value = item
  detailsVisible.value = true
}
const resetFilters = () => {
  search.value = ''
  category.value = 'all'
  minecraft.value = 'all'
}
</script>

<template>
  <main class="resource-page">
    <section class="resource-hero" aria-labelledby="resource-title">
      <div>
        <span class="mc-tag hero-label"
          ><Icon icon="lucide:package-open" width="15" /> RESOURCE WORKSHOP</span
        >
        <h1 id="resource-title">
          {{ t('资源工坊') }}<span class="title-square" aria-hidden="true" />
        </h1>
        <p>{{ t('一些特别的模组，一些创作的小成果。') }}</p>
        <p class="hero-description">
          {{ t('独立发布的模组、商店与任务 NBT，以及更多实用文件，在这里免费下载与学习。') }}
        </p>
      </div>
      <div class="workshop-note">
        <div class="note-icon" aria-hidden="true">
          <Icon icon="lucide:folder-down" width="34" />
        </div>
        <div>
          <span class="mc-label">MADE TO BE SHARED</span>
          <strong>{{ t('从一个文件，开始新的创作。') }}</strong>
          <span class="availability">{{ t('{} 项资源已开放下载', [availableCount]) }}</span>
        </div>
      </div>
    </section>

    <section class="resource-collection" :aria-label="t('资源列表')">
      <div class="collection-toolbar">
        <div class="category-tabs" role="group" :aria-label="t('资源分类')">
          <button
            v-for="item in categories"
            :key="item.id"
            type="button"
            class="category-tab"
            :aria-pressed="category === item.id"
            @click="category = item.id"
          >
            <Icon :icon="item.icon" width="16" />{{ item.label
            }}<span>{{ countCategory(item.id) }}</span>
          </button>
        </div>
        <label class="resource-search">
          <Icon icon="lucide:search" width="18" aria-hidden="true" />
          <input
            v-model="search"
            type="search"
            :placeholder="t('搜索资源、模组或版本…')"
            :aria-label="t('搜索资源')"
          />
        </label>
      </div>
      <div class="collection-summary">
        <p aria-live="polite">{{ t('找到 {} 项资源', [filteredResources.length]) }}</p>
        <label v-if="versions.length" class="version-filter">
          <span>Minecraft</span>
          <select v-model="minecraft" :aria-label="t('筛选 Minecraft 版本')">
            <option value="all">{{ t('全部版本') }}</option>
            <option v-for="version in versions" :key="version" :value="version">
              {{ version }}
            </option>
          </select>
        </label>
        <span v-else class="pending-note"><span />{{ t('首批资源整理中') }}</span>
      </div>

      <div v-if="filteredResources.length" class="resource-grid">
        <article
          v-for="item in filteredResources"
          :key="item.id"
          class="resource-card"
          :class="`resource-card--${item.category}`"
        >
          <div class="resource-art" aria-hidden="true">
            <div class="art-grid" />
            <span class="art-type">{{
              item.category === 'mod' ? 'MOD' : item.category === 'nbt' ? 'NBT' : 'FILE'
            }}</span>
            <div class="art-icon">
              <Icon :icon="item.icon || categoryInfo(item.category).icon" width="48" />
            </div>
            <span class="art-caption">{{ item.tags[0] }}</span>
          </div>
          <div class="resource-body">
            <div class="resource-heading">
              <span class="mc-label">{{ categoryInfo(item.category).label }}</span>
              <span
                class="resource-status"
                :class="{ 'resource-status--available': item.releases.length }"
              >
                <span />{{ item.releases.length ? t('可下载') : t('待发布') }}
              </span>
            </div>
            <h2>
              <button type="button" @click="showDetails(item)">{{ item.title }}</button>
            </h2>
            <p class="resource-description">{{ item.description }}</p>
            <div class="resource-tags">
              <span v-for="tag in item.tags" :key="tag" class="mc-tag">{{ tag }}</span>
            </div>
            <p class="resource-compatibility">
              <Icon icon="lucide:layers" width="15" />
              <template v-if="latestRelease(item)"
                >{{ latestRelease(item).minecraft.join(' / ') }} ·
                {{ latestRelease(item).loaders.join(' / ') || t('通用文件') }}</template
              >
              <template v-else>{{ t('适配信息随文件发布') }}</template>
            </p>
            <RouterLink v-if="item.docs" :to="item.docs" class="documentation-link">
              <Icon icon="lucide:book-open" width="15" />{{ t('模组 Wiki') }}
              <Icon icon="lucide:arrow-up-right" width="15" />
            </RouterLink>
            <div class="resource-actions">
              <a
                v-if="latestRelease(item)"
                class="download-link"
                :href="downloadUrl(latestRelease(item).url)"
                :download="latestRelease(item).filename"
                :target="latestRelease(item).url.startsWith('https://') ? '_blank' : undefined"
                rel="noopener noreferrer"
              >
                <Icon icon="lucide:download" width="16" />{{ t('免费下载') }}
              </a>
              <span v-else class="pending-download"
                ><Icon icon="lucide:clock-3" width="16" />{{ t('文件准备中') }}</span
              >
              <button type="button" class="details-button" @click="showDetails(item)">
                {{ t('查看详情') }}<Icon icon="lucide:arrow-up-right" width="16" />
              </button>
            </div>
          </div>
        </article>
      </div>
      <div v-else class="empty-state">
        <Icon icon="lucide:package-search" width="42" />
        <h2>{{ t('没有找到匹配的资源') }}</h2>
        <p>{{ t('试试其他关键词，或清除筛选条件。') }}</p>
        <Button @click="resetFilters">{{ t('清除筛选') }}</Button>
      </div>
    </section>

    <footer class="resource-footer">
      <Icon icon="lucide:book-open" width="19" />
      <p>
        {{ t('每份资源都会附上适配信息与使用说明。下载前请先确认版本，使用范围以资源说明为准。') }}
      </p>
      <span class="mc-label">KEEP CREATING</span>
    </footer>

    <Modal v-model:show="detailsVisible" :title="selectedResource?.title" width="720px">
      <div v-if="selectedResource" class="resource-detail">
        <p>{{ selectedResource.description }}</p>
        <section>
          <h3><Icon icon="lucide:download" width="18" />{{ t('下载版本') }}</h3>
          <div v-if="!selectedResource.releases.length" class="detail-pending">
            <Icon icon="lucide:package-open" width="28" />
            <div>
              <strong>{{ t('资源正在整理中') }}</strong>
              <p>{{ t('文件与适配说明就绪后，会在这里开放免费下载。') }}</p>
            </div>
          </div>
          <ul v-else class="release-list">
            <li v-for="release in selectedResource.releases" :key="release.version + release.url">
              <div class="release-info">
                <strong>{{ release.version }}</strong>
                <span
                  >Minecraft {{ release.minecraft.join(' / ') }} ·
                  {{ release.loaders.join(' / ') || t('通用文件') }}</span
                >
                <div
                  v-if="release.dependencies?.length || release.optionalDependencies?.length"
                  class="release-deps"
                >
                  <template v-if="release.dependencies?.length">
                    <span class="dep-label">{{ t('依赖模组') }}</span>
                    <template v-for="name in release.dependencies" :key="`dep-${name}`">
                      <a
                        v-if="curseforgeModUrl(name)"
                        class="dep-chip"
                        :href="curseforgeModUrl(name)"
                        target="_blank"
                        rel="noopener noreferrer"
                        >{{ name }}<Icon icon="lucide:arrow-up-right" width="11"
                      /></a>
                      <span v-else class="dep-chip">{{ name }}</span>
                    </template>
                  </template>
                  <template v-if="release.optionalDependencies?.length">
                    <span class="dep-label">{{ t('可选联动') }}</span>
                    <template v-for="name in release.optionalDependencies" :key="`opt-${name}`">
                      <a
                        v-if="curseforgeModUrl(name)"
                        class="dep-chip dep-chip--optional"
                        :href="curseforgeModUrl(name)"
                        target="_blank"
                        rel="noopener noreferrer"
                        >{{ name }}<Icon icon="lucide:arrow-up-right" width="11"
                      /></a>
                      <span v-else class="dep-chip dep-chip--optional">{{ name }}</span>
                    </template>
                  </template>
                </div>
                <span class="release-filename"
                  >{{ release.filename
                  }}<template v-if="release.size"> · {{ release.size }}</template></span
                >
                <span v-if="release.notes">{{ t(release.notes) }}</span>
              </div>
              <a
                class="download-link"
                :href="downloadUrl(release.url)"
                :download="release.filename"
                :target="release.url.startsWith('https://') ? '_blank' : undefined"
                rel="noopener noreferrer"
                ><Icon icon="lucide:download" width="16" />{{ t('下载') }}</a
              >
            </li>
          </ul>
        </section>
        <section v-if="selectedResource.usage">
          <h3>{{ t('使用说明') }}</h3>
          <p class="usage-text">{{ selectedResource.usage }}</p>
        </section>
      </div>
    </Modal>
  </main>
</template>

<style scoped>
.resource-page {
  max-width: 1200px;
  margin: auto;
  padding: 0 32px;
}
.resource-hero {
  display: grid;
  grid-template-columns: 1.6fr 1fr;
  align-items: center;
  gap: 56px;
  padding: 60px 0 44px;
}
.hero-label {
  gap: 8px;
  background: rgb(var(--ui-surface));
  box-shadow: 2px 2px 0 rgb(var(--ui-shadow));
  font-size: 10px;
  letter-spacing: 0.06em;
}
h1 {
  display: flex;
  align-items: baseline;
  gap: 12px;
  margin: 18px 0 14px;
  font-size: clamp(32px, 4vw, 46px);
  font-weight: 850;
  letter-spacing: -0.04em;
}
.title-square {
  width: 12px;
  height: 12px;
  background: rgb(var(--ui-link));
}
.resource-hero p {
  font-size: 17px;
  font-weight: 650;
  line-height: 1.8;
}
.resource-hero .hero-description {
  max-width: 560px;
  margin-top: 8px;
  color: rgb(var(--ui-muted));
  font-size: 14px;
  font-weight: 400;
}
.workshop-note {
  display: flex;
  gap: 20px;
  padding: 24px 0 24px 24px;
  border-left: 2px solid rgb(var(--ui-line));
}
.note-icon {
  display: grid;
  place-items: center;
  width: 68px;
  height: 68px;
  flex-shrink: 0;
  border: 2px solid rgb(var(--ui-border));
  background: rgb(var(--ui-primary));
  color: rgb(var(--ui-on-accent));
  box-shadow: 4px 4px 0 rgb(var(--ui-shadow));
}
.workshop-note strong {
  display: block;
  font-size: 15px;
  margin: 8px 0;
}
.availability {
  color: rgb(var(--ui-muted));
  font-size: 12px;
}
.collection-toolbar {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  padding: 20px 0;
  border-top: 2px solid rgb(var(--ui-border));
  border-bottom: 1px solid rgb(var(--ui-line));
}
.category-tabs {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
.category-tab {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  min-height: 40px;
  padding: 8px 12px;
  border: 2px solid transparent;
  font-size: 12px;
  font-weight: 700;
}
.category-tab > span {
  font: 11px monospace;
  opacity: 0.65;
}
.category-tab:hover {
  background: rgb(var(--ui-inset));
}
.category-tab[aria-pressed='true'] {
  border-color: rgb(var(--ui-border));
  background: rgb(var(--ui-primary));
  color: rgb(var(--ui-on-accent));
  box-shadow: 2px 2px 0 rgb(var(--ui-shadow));
}
.resource-search {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  min-width: 250px;
  border: 1px solid rgb(var(--ui-line));
  background: rgb(var(--ui-surface));
  color: rgb(var(--ui-muted));
}
.resource-search:focus-within {
  outline: 2px solid rgb(var(--ui-link));
  outline-offset: 2px;
}
.resource-search input {
  width: 100%;
  min-width: 0;
  font-size: 12px;
  background: transparent;
  color: rgb(var(--ui-text));
  outline: none;
}
.collection-summary {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  min-height: 60px;
  color: rgb(var(--ui-muted));
  font-size: 12px;
}
.pending-note,
.version-filter {
  display: flex;
  align-items: center;
  gap: 8px;
}
.pending-note > span {
  width: 6px;
  height: 6px;
  background: rgb(var(--ui-muted));
}
.version-filter select {
  padding: 6px 8px;
  border: 1px solid rgb(var(--ui-line));
  background: rgb(var(--ui-surface));
  color: rgb(var(--ui-text));
}
.resource-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 24px;
  padding-bottom: 10px;
}
.resource-card {
  --resource-accent: var(--ui-primary);
  display: flex;
  flex-direction: column;
  min-width: 0;
  border: 2px solid rgb(var(--ui-border));
  background: rgb(var(--ui-surface));
  box-shadow: 4px 4px 0 rgb(var(--ui-shadow));
}
.resource-card--nbt {
  --resource-accent: var(--ui-secondary);
}
.resource-card--other {
  --resource-accent: var(--ui-line);
}
.resource-art {
  position: relative;
  display: grid;
  place-items: center;
  height: 170px;
  overflow: hidden;
  background: rgb(var(--resource-accent) / 0.15);
  border-bottom: 2px solid rgb(var(--ui-border));
}
.art-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgb(var(--ui-line) / 0.5) 1px, transparent 1px),
    linear-gradient(90deg, rgb(var(--ui-line) / 0.5) 1px, transparent 1px);
  background-size: 24px 24px;
  mask-image: linear-gradient(to right, transparent, #000, transparent);
}
.art-type {
  position: absolute;
  left: 16px;
  top: 16px;
  color: rgb(var(--ui-muted));
  font: 700 11px monospace;
  letter-spacing: 0.08em;
}
.art-icon {
  position: relative;
  display: grid;
  place-items: center;
  width: 86px;
  height: 86px;
  background: rgb(var(--resource-accent));
  border: 2px solid rgb(var(--ui-border));
  color: rgb(var(--ui-on-accent));
  box-shadow: 6px 6px 0 rgb(var(--ui-shadow));
  transform: rotate(-5deg);
}
.resource-card:nth-child(2n) .art-icon {
  transform: rotate(5deg);
}
.art-caption {
  position: absolute;
  right: 12px;
  bottom: 12px;
  font: 700 10px monospace;
  color: rgb(var(--ui-muted));
}
.resource-body {
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 22px;
}
.resource-heading {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
}
.resource-status {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  color: rgb(var(--ui-muted));
}
.resource-status > span {
  width: 6px;
  height: 6px;
  background: currentColor;
}
.resource-status--available {
  color: rgb(var(--ui-link));
}
.resource-body h2 {
  margin: 15px 0 10px;
  font-size: 21px;
  font-weight: 800;
  line-height: 1.4;
}
.resource-body h2 button {
  text-align: left;
}
.resource-body h2 button:hover {
  color: rgb(var(--ui-link));
}
.resource-description {
  flex: 1;
  min-height: 66px;
  font-size: 13px;
  color: rgb(var(--ui-muted));
  line-height: 1.85;
}
.resource-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin: 16px 0;
}
.resource-tags .mc-tag {
  padding: 3px 6px;
  font-size: 10px;
  border-color: rgb(var(--ui-line));
}
.resource-compatibility {
  display: flex;
  align-items: center;
  gap: 7px;
  color: rgb(var(--ui-muted));
  font-size: 11px;
  line-height: 1.7;
}
.resource-compatibility svg {
  flex-shrink: 0;
}
.resource-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 18px;
  padding-top: 18px;
  border-top: 1px solid rgb(var(--ui-line));
}
.download-link {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  gap: 7px;
  padding: 8px 12px;
  border: 2px solid rgb(var(--ui-border));
  box-shadow: 2px 2px 0 rgb(var(--ui-shadow));
  background: rgb(var(--ui-primary));
  color: rgb(var(--ui-on-accent));
  font-size: 12px;
  font-weight: 750;
  white-space: nowrap;
}
.download-link:hover {
  background: rgb(var(--ui-secondary));
}
.download-link:active {
  transform: translate(2px, 2px);
  box-shadow: none;
}
.pending-download {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  color: rgb(var(--ui-muted));
  font-size: 12px;
}
.details-button {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-height: 36px;
  font-size: 12px;
  font-weight: 650;
}
.details-button:hover,
.documentation-link:hover {
  color: rgb(var(--ui-link));
}
.empty-state {
  display: flex;
  align-items: center;
  flex-direction: column;
  padding: 70px 20px;
  border: 1px dashed rgb(var(--ui-line));
  text-align: center;
  color: rgb(var(--ui-muted));
}
.empty-state h2 {
  margin: 16px 0 8px;
  font-size: 18px;
  font-weight: 700;
  color: rgb(var(--ui-text));
}
.empty-state p {
  margin-bottom: 24px;
  font-size: 13px;
}
.resource-footer {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 42px 0 0;
  padding: 24px 0 32px;
  border-top: 1px solid rgb(var(--ui-line));
  color: rgb(var(--ui-muted));
  font-size: 12px;
  line-height: 1.8;
}
.resource-footer > svg {
  flex-shrink: 0;
}
.resource-footer .mc-label {
  margin-left: auto;
  white-space: nowrap;
}
.resource-detail > p {
  color: rgb(var(--ui-muted));
  line-height: 1.85;
}
.resource-detail section {
  padding-top: 22px;
}
.resource-detail h3 {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  font-size: 15px;
  font-weight: 750;
}
.detail-pending {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  border: 1px dashed rgb(var(--ui-line));
  background: rgb(var(--ui-inset));
}
.detail-pending > svg {
  flex-shrink: 0;
  color: rgb(var(--ui-muted));
}
.detail-pending p {
  margin-top: 4px;
  color: rgb(var(--ui-muted));
  font-size: 12px;
}
.release-list {
  border: 1px solid rgb(var(--ui-line));
}
.release-list li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  padding: 16px;
}
.release-list li + li {
  border-top: 1px solid rgb(var(--ui-line));
}
.release-info {
  display: flex;
  flex-direction: column;
  gap: 5px;
  min-width: 0;
}
.release-info > span {
  color: rgb(var(--ui-muted));
  font-size: 12px;
}
.release-filename {
  overflow-wrap: anywhere;
  font-family: monospace;
}
.release-deps {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
}
.dep-label {
  color: rgb(var(--ui-muted));
  font-size: 11px;
}
.dep-chip {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 7px;
  border: 1px solid rgb(var(--ui-line));
  background: rgb(var(--ui-surface));
  font-size: 11px;
  font-weight: 650;
}
a.dep-chip:hover {
  color: rgb(var(--ui-link));
  border-color: rgb(var(--ui-link));
}
.dep-chip--optional {
  border-style: dashed;
  color: rgb(var(--ui-muted));
}
.documentation-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-top: 12px;
  font-weight: 650;
}
.usage-text {
  white-space: pre-line;
  line-height: 1.85;
}
@media (max-width: 1023px) {
  .resource-hero {
    gap: 28px;
    grid-template-columns: 1.4fr 1fr;
  }
  .workshop-note {
    padding-left: 20px;
    gap: 14px;
  }
  .note-icon {
    width: 50px;
    height: 50px;
  }
  .workshop-note strong {
    font-size: 13px;
  }
  .resource-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
@media (max-width: 639px) {
  .resource-page {
    padding: 0 20px;
  }
  .resource-hero {
    grid-template-columns: 1fr;
    gap: 24px;
    padding: 36px 0 28px;
  }
  .workshop-note {
    padding: 16px;
    border: 1px solid rgb(var(--ui-line));
    background: rgb(var(--ui-inset));
  }
  .workshop-note strong {
    font-size: 14px;
  }
  .collection-toolbar {
    gap: 16px;
  }
  .category-tabs {
    gap: 4px;
  }
  .category-tab {
    padding: 8px;
    gap: 5px;
    font-size: 11px;
  }
  .category-tab > svg {
    display: none;
  }
  .resource-search {
    width: 100%;
    min-width: 0;
  }
  .resource-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  .resource-art {
    height: 150px;
  }
  .resource-description {
    min-height: 0;
  }
  .resource-footer {
    align-items: flex-start;
    margin-top: 28px;
  }
  .resource-footer .mc-label {
    display: none;
  }
  .release-list li {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>
