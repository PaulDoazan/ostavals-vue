<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import Menu from '../Menu/index.vue'

const { t } = useI18n()

// Project description (full text in locale)
const projectDescription = computed(() => t('credits.project.description'))

// Organizations list (institutions and associations) - split into 2 columns
const allOrganizations = [
  'Agence Française des Chemins de Compostelle',
  'Office de Tourisme Pays Basque',
  'CAUE Pyrénées-Atlantiques',
  'Agence d\'urbanisme Pays Basque',
  'Association BLE CIVAM Bio',
  'AOP Ossau-Iraty',
  'AOP Piment d\'Espelette',
  'Filière du Kintoa',
  'AOC Vin d\'Irouléguy',
  'IGP Kiwi de l\'Adour',
  'IGP Jambon de Bayonne',
  'Hazi Sarea'
]

const organizationsCol1 = computed(() => allOrganizations.slice(0, Math.ceil(allOrganizations.length / 2)))
const organizationsCol2 = computed(() => allOrganizations.slice(Math.ceil(allOrganizations.length / 2)))

// Photographers list (other photo credits) - split into 2 columns
const allPhotographers = [
  'Rieger Bertrand / hemis.fr',
  'Adobe Stock',
  'Agence COM\' BY AVM',
  'Alexas Fotos',
  'elapoppies-photography',
  'Lviatour',
  'Cyrille Marlin',
  '© CPB / CôtéSudPhotos',
  '© Mathieu Prat',
  '© Carole Pro',
  '© B Valcke'
]

const photographersCol1 = computed(() => allPhotographers.slice(0, Math.ceil(allPhotographers.length / 2)))
const photographersCol2 = computed(() => allPhotographers.slice(Math.ceil(allPhotographers.length / 2)))
</script>

<template>
  <div class="w-screen h-screen bg-background relative overflow-y-auto">
    <Menu />
    <div class="w-full px-16 pt-16">
      <!-- Title -->
      <h1 class="text-5xl font-bold font-athelas mb-12 text-center">{{ t('credits.title') }}</h1>

      <!-- Project Description -->
      <div class="mb-8">
        <p class="font-soleil leading-relaxed text-center max-w-6xl mx-auto" style="font-size: 28px; line-height: 1.5">
          {{ projectDescription }}
        </p>
      </div>

      <!-- Images Section -->
      <div class="">
        <h2 class="font-semibold font-soleil mb-8 text-center" style="font-size: 32px">
          {{ t('credits.images.title') }}
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-12">
          <!-- Organizations -->
          <div>
            <h3 class="font-bold font-athelas mb-6 text-red" style="font-size: 24px">
              {{ t('credits.images.organizations.title') }}
            </h3>
            <div class="grid grid-cols-2 gap-4">
              <!-- Organizations Column 1 -->
              <ul class="space-y-3 font-soleil">
                <li v-for="(org, index) in organizationsCol1" :key="index" style="font-size: 24px; line-height: 1.3">
                  {{ org }}
                </li>
              </ul>
              <!-- Organizations Column 2 -->
              <ul class="space-y-3 font-soleil">
                <li v-for="(org, index) in organizationsCol2" :key="index" style="font-size: 24px; line-height: 1.3">
                  {{ org }}
                </li>
              </ul>
            </div>
          </div>

          <!-- Photographers -->
          <div>
            <h3 class="font-bold font-athelas mb-6 text-red" style="font-size: 24px">
              {{ t('credits.images.photographers.title') }}
            </h3>
            <div class="grid grid-cols-2 gap-4">
              <!-- Photographers Column 1 -->
              <ul class="space-y-3 font-soleil">
                <li v-for="(photographer, index) in photographersCol1" :key="index"
                  style="font-size: 24px; line-height: 1.3">
                  {{ photographer }}
                </li>
              </ul>
              <!-- Photographers Column 2 -->
              <ul class="space-y-3 font-soleil">
                <li v-for="(photographer, index) in photographersCol2" :key="index"
                  style="font-size: 24px; line-height: 1.3">
                  {{ photographer }}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
