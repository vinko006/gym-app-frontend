<template>
  <div class="glavni-sadrzaj-wrapper">

    <v-card elevation="5" class="stakleni-kontejner">

      <v-card-title class="text-center py-5 text-white font-weight-bold uppercase-title">
        <v-icon icon="mdi-dumbbell" class="mr-2"></v-icon>
        Popis Trenera
      </v-card-title>

      <v-row class="px-4 pt-4 ma-0">

        <v-col cols="12" md="8" class="pa-1">
          <v-text-field
            v-model="searchQuery"
            prepend-inner-icon="mdi-magnify"
            label="Pretraži trenera..."
            variant="outlined"
            color="white"
            density="comfortable"
            clearable
            class="text-white"
          ></v-text-field>
        </v-col>

        <v-col cols="12" md="4" class="pa-1">
          <v-select
            v-model="filterType"
            :items="['Sve', 'Ime i prezime', 'Specijalnost']"
            label="Filtriraj po"
            variant="outlined"
            color="white"
            density="comfortable"
            class="text-white"
            prepend-inner-icon="mdi-filter-variant"
          ></v-select>
        </v-col>

      </v-row>

      <div v-if="loading" class="text-center pa-10">
        <v-progress-circular indeterminate color="green"></v-progress-circular>
        <div class="mt-2 text-white">Učitavam trenere...</div>
      </div>

      <v-table v-else hover class="custom-table">
        <thead>
          <tr>
            <th class="text-center text-white font-weight-bold">#</th>
            <th class="text-center text-white font-weight-bold">Ime i Prezime</th>
            <th class="text-center text-white font-weight-bold">Specijalnost</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(trener, index) in treneri" :key="trener.id" class="table-row">
            <td class="text-center text-white">{{ (page - 1) * itemPerPage + index + 1 }}.</td>

            <td class="text-center text-white">
              <div class="d-flex align-center justify-center">
                <v-icon size="small" color="white" class="mr-2">mdi-account-star</v-icon>
                {{ trener.ime }} {{ trener.prezime }}
              </div>
            </td>

            <td class="text-center">
              <v-chip color="indigo-lighten-4" size="small" variant="tonal">
                {{ trener.specijalnost }}
              </v-chip>
            </td>
          </tr>

          <tr v-if="treneri.length === 0">
            <td colspan="3" class="text-center text-grey-lighten-1 py-6">
              Nema trenera koji odgovaraju pretrazi.
            </td>
          </tr>
        </tbody>
      </v-table>

      <div v-if="totalPages > 1 && !loading" class="text-center py-4">
        <v-pagination
          v-model="page"
          :length="totalPages"
          rounded="circle"
          density="comfortable"
          color="white"
        ></v-pagination>
      </div>

    </v-card>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import axios from 'axios'

const treneri = ref([])
const page = ref(1)
const itemPerPage = 10
const totalPages = ref(1)
const searchQuery = ref('')
const loading = ref(false)

const filterType = ref('Sve')// Šalje backend-u šta želim filtrirati

let searchTimeout = null


// Funkcija za povlačenje podataka sa Flask backend-a
const dohvatiTrenere = async () => {
  loading.value = true
  try {
    const response = await axios.get('http://127.0.0.1:5000/treneri', {
      params: {
        page: page.value,
        per_page: itemPerPage,
        search: searchQuery.value,
        tip_filtera: filterType.value
      }
    })

    // Mapiranje podataka sa backenda
    treneri.value = response.data.treneri || []
    totalPages.value = response.data.ukupnoStranica || 1
  } catch (error) {
    console.error("Greška pri dohvaćanju trenera:", error)
  } finally {
    loading.value = false
  }
}

// Watcher za pretragu sa ugrađenim debounce-om (čeka 500ms nakon zadnjeg klika)
watch(searchQuery, () => {
  page.value = 1

  if (searchTimeout) clearTimeout(searchTimeout)

  searchTimeout = setTimeout(() => {
    dohvatiTrenere()
  }, 500)
})

// Watcher za promjenu stranice (odmah reaguje)
watch(page, () => {
  dohvatiTrenere()
})

onMounted(() => {
  dohvatiTrenere()
})
</script>

<style scoped>
.stakleni-kontejner {
  border: 1px solid rgba(255, 255, 255, 0.2) !important;
  background-color: rgba(0, 0, 0, 0.7) !important;
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  border-radius: 12px;
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

.uppercase-title {
  text-transform: uppercase;
  letter-spacing: 2px;
}

:deep(.v-pagination__item) {
  color: white !important;
}

:deep(.v-pagination__btn) {
  color: white !important;
}
</style>