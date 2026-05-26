<template>
  <div class="glavni-sadrzaj-wrapper">

    <v-card elevation="5" class="stakleni-kontejner">

      <v-card-title class="text-center py-5 text-white font-weight-bold uppercase-title">
        Popis Trenera
      </v-card-title>

      <div class="px-4 pt-4">
        <v-text-field
          v-model="searchQuery"
          prepend-inner-icon="mdi-magnify"
          label="Pretraži trenera po imenu, prezimenu ili specijalnosti..."
          variant="outlined"
          color="white"
          density="comfortable"
          clearable
          class="text-white"
        ></v-text-field>
      </div>

      <v-table hover class="custom-table">
        <thead>
          <tr>
            <th class="text-center text-white font-weight-bold">#</th>
            <th class="text-center text-white font-weight-bold">Ime i Prezime</th>
            <th class="text-center text-white font-weight-bold">Specijalnost</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(trener, index) in filtriraniPrikazaniTreneri" :key="trener.id" class="table-row">
            <td class="text-center text-white">{{ (page - 1) * itemPerPage + index + 1 }}.</td>

            <td class="text-center text-white">
              <div class="d-flex align-center justify-center">
                <v-icon size="small" color="white" class="mr-2">mdi-account-star</v-icon>
                {{ trener.ime }} {{ trener.prezime }}
              </div>
            </td>

            <td class="text-center">
              <v-chip
                color="indigo-lighten-4"
                size="small"
                variant="tonal"
              >
                {{ trener.specijalnost }}
              </v-chip>
            </td>
          </tr>

          <tr v-if="filtriraniPrikazaniTreneri.length === 0 && treneri.length > 0">
            <td colspan="3" class="text-center text-grey-lighten-1 py-6">
              Nema trenera koji odgovaraju pretrazi "{{ searchQuery }}"
            </td>
          </tr>
        </tbody>
      </v-table>

      <v-divider class="border-opacity-15"></v-divider>

      <div class="text-center py-4">
        <v-pagination
          v-model="page"
          :length="ukupnoStranica"
          rounded="circle"
          density="comfortable"
          color="white"
        ></v-pagination>
      </div>

      <v-card-text v-if="treneri.length === 0" class="text-center pa-10">
        <v-progress-circular indeterminate color="green"></v-progress-circular>
        <div class="mt-2 text-white">Učitavam trenere...</div>
      </v-card-text>
    </v-card>

  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import axios from 'axios'

const treneri = ref([])
const page = ref(1)
const itemPerPage = 10 // Ovdje je obična varijabla (nije ref, pa joj u scriptu ne treba .value)

const searchQuery = ref('')

// Kada profesor upiše nešto u tražilicu, automatski vraćamo paginaciju na 1. stranicu
watch(searchQuery, () => {
  page.value = 1
})

// 1. Prvo filtriramo trenere prema upitu iz tražilice
const filtriraniTreneri = computed(() => {
  if (!searchQuery.value) {
    return treneri.value
  }
  const query = searchQuery.value.toLowerCase().trim()
  return treneri.value.filter(trener => {
    const punoIme = `${trener.ime} ${trener.prezime}`.toLowerCase()
    const specijalnost = (trener.specijalnost || '').toLowerCase()
    return punoIme.includes(query) || specijalnost.includes(query)
  })
})

// 2. Primjenjujemo paginaciju isključivo na filtrirane rezultate
const filtriraniPrikazaniTreneri = computed(() => {
  const start = (page.value - 1) * itemPerPage
  const end = start + itemPerPage
  return filtriraniTreneri.value.slice(start, end)
})

// 3. Ukupan broj stranica računamo dinamički na temelju filtriranih rezultata
const ukupnoStranica = computed(() => {
  return Math.ceil(filtriraniTreneri.value.length / itemPerPage) || 1
})

const dohvatiTrenere = async () => {
  try {
    const response = await axios.get('http://127.0.0.1:5000/treneri')
    treneri.value = response.data
  } catch (error) {
    console.error("Greška pri dohvaćanju trenera:", error)
  }
}

onMounted(() => {
  dohvatiTrenere()
})
</script>

<style scoped>
.stakleni-okvir {
  border: 1px solid white !important;
  background-color: rgba(0, 0, 0, 0.7) !important;
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
}

.custom-table {
  background: transparent !important;
}

:deep(.v-table__wrapper) {
  background: transparent !important;
}

:deep(th) {
  background: transparent !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important;
  text-transform: uppercase;
  letter-spacing: 1px;
}

:deep(td) {
  border-bottom: 1px solid rgba(255, 255, 255, 0.05) !important;
  padding: 15px !important;
}

.table-row:hover {
  background-color: rgba(255, 255, 255, 0.05) !important;
}

.border-white-subtle {
  border: 1px solid rgba(255, 255, 255, 0.2) !important;
}

:deep(.v-pagination__item) {
  color: white !important;
}

:deep(.v-pagination__btn) {
  color: white !important;
}
</style>