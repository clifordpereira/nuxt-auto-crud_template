<script setup lang="ts">
const { data: page } = await useAsyncData('index', () => queryCollection('index').first())

const { copy, copied } = useClipboard()

const title = page.value?.seo?.title || page.value?.title
const description = page.value?.seo?.description || page.value?.description

useSeoMeta({
  titleTemplate: '',
  title,
  ogTitle: title,
  description,
  ogDescription: description
})
</script>

<template>
  <div v-if="page">
    <UPageHero
      :title="page.title"
      :description="page.description"
      :links="page.hero.links"
    >
      <template #top>
        <HeroBackground />
      </template>

      <template #title>
        <MDC
          :value="page.title"
          unwrap="p"
        />
      </template>

      <template #description>
        {{ page.description }}
        <div v-if="page.command" class="flex items-center gap-3 bg-gray-100/50 dark:bg-gray-900/50 p-1 rounded-md border border-gray-200 dark:border-gray-800 w-fit mx-auto mt-6 mb-2">
          <UBadge
            label="Quick Install"
            variant="subtle"
            size="sm"
            class="rounded"
          />
          <code class="text-[11px] font-mono text-muted-foreground">{{ page.command }}</code>
          <UButton
            :icon="copied ? 'i-lucide-check' : 'i-lucide-copy'"
            color="neutral"
            variant="ghost"
            size="xs"
            @click="copy(page.command)"
          />
        </div>
      </template>

      <PromotionalVideo />
    </UPageHero>
    
    <UPageSection
      :title="page.features.title"
      :description="page.features.description"
    >
      <UPageGrid>
        <UPageCard
          v-for="(item, index) in page.features.items"
          :key="index"
          v-bind="item"
          spotlight
        />
      </UPageGrid>
    </UPageSection>

    <UPageSection
      v-for="(section, index) in page.sections"
      :key="index"
      :title="section.title"
      :description="section.description"
      :orientation="section.orientation"
      :reverse="section.reverse"
      :features="section.features"
      :links="section.links"
    >
      <MDC
        v-if="section.code"
        :value="'```typescript\n' + section.code + '\n```'"
        class="prose prose-primary dark:prose-invert max-w-none"
      />
      <NuxtImg
        v-else-if="(section as any).image"
        :src="(section as any).image"
        :alt="section.title"
        class="w-full rounded-md shadow-xl ring-1 ring-gray-300 dark:ring-gray-700"
        loading="lazy"
      />
      <ImagePlaceholder v-else />
    </UPageSection>

    <UPageSection
      id="testimonials"
      :headline="page.testimonials?.headline"
      :title="page.testimonials?.title"
      :description="page.testimonials?.description"
    >
      <LandingTestimonials />
    </UPageSection>

    <USeparator />

    <UPageCTA
      v-bind="page.cta"
      variant="naked"
      class="overflow-hidden"
    >
      <LazyStarsBg />
    </UPageCTA>
  </div>
</template>
