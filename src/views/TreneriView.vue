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

          <tr v-if="treneri.length === 0 && !loading">
            <td colspan="3" class="text-center text-grey-lighten-1 py-6">
              Nema trenera koji odgovaraju pretrazi.
            </td>
          </tr>

          <div class="text-center py-4">
            <v-pagination
              v-model="page"
              :length="totalPages"
              rounded="circle"
              density="comfortable"
              color="white"
            ></v-pagination>
          </div>

          <v-card-text v-if="loading" class="text-center pa-10">
            <v-progress-circular indeterminate color="green"></v-progress-circular>
            <div class="mt-2 text-white">Učitavam trenere...</div>
          </v-card-text>
        </tbody>
      </v-table>
    </v-card>

  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import axios from 'axios'

const treneri = ref([])
const page = ref(1)
const itemPerPage = 10
const totalPages = ref(1) // Backend će nam reći koliko ukupno ima stranica
const searchQuery = ref('')
const loading = ref(false) // Dodajemo loading stanje za bolji UX

// Glavna funkcija za dohvaćanje podataka s backenda
const dohvatiTrenere = async () => {
  loading.value = true
  try {
    // Šaljemo parametre kao query string: ?page=1&search=nešto&per_page=10
    const response = await axios.get('http://127.0.0.1:5000/treneri', {
      params: {
        page: page.value,
        per_page: itemPerPage,
        search: searchQuery.value
      }
    })

    // Backend treba vratiti objekt koji sadrži listu trenera i ukupan broj stranica
    treneri.value = response.data.treneri
    totalPages.value = response.data.ukupnoStranica
  } catch (error) {
    console.error("Greška pri dohvaćanju trenera:", error)
  } finally {
    loading.value = false
  }
}

// Kada korisnik upiše nešto u tražilicu, vraćamo na 1. stranicu i povlačimo nove podatke
watch(searchQuery, () => {
  page.value = 1
  dohvatiTrenere()
})

// Kada korisnik klikne na drugu stranicu u <v-pagination>, povlačimo podatke za tu stranicu
watch(page, () => {
  dohvatiTrenere()
})

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