<template>
  <v-card
    variant="outlined"
    class="mx-auto rounded-xl stakleni-okvir"
    max-width="900"
  >
    <v-card-title class="text-center py-6 text-white text-uppercase font-weight-bold text-h5">
      Popis Trenera
    </v-card-title>

    <v-table class="mx-auto mt-2 custom-table">
      <thead>
        <tr>
          <th class="text-center text-grey-lighten-1">#</th>
          <th class="text-center text-white">Ime i Prezime</th>
          <th class="text-center text-white">Specijalnost</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(trener, index) in prikazaniTreneri" :key="trener.id" class="table-row">
          <td class="text-center text-grey-lighten-1">{{ (page - 1) * itemPerPage + index + 1 }}.</td>

          <td class="text-center font-weight-bold text-white">
            <div class="d-flex align-center justify-center">
              <v-icon size="small" color="blue-lighten-3" class="mr-2">mdi-account-star</v-icon>
              {{ trener.ime }} {{ trener.prezime }}
            </div>
          </td>

          <td class="text-center">
            <v-chip
              color="rgba(255, 255, 255, 0.1)"
              size="small"
              label
              variant="flat"
              class="text-white border-white-subtle"
            >
              {{ trener.specijalnost }}
            </v-chip>
          </td>
        </tr>
      </tbody>
    </v-table>

    <v-divider color="white" style="opacity: 0.1"></v-divider>

    <div class="text-center py-4">
      <v-pagination
        v-model="page"
        :length="ukupnoStranica"
        rounded="circle"
        density="comfortable"
        active-color="white"
        color="grey-lighten-1"
      ></v-pagination>
    </div>

    <v-card-text v-if="treneri.length === 0" class="text-center pa-10 text-white">
      <v-progress-circular indeterminate color="white"></v-progress-circular>
      <div class="mt-2">Učitavam trenere...</div>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'

const treneri = ref([])
const page = ref(1)
const itemPerPage = 10

const prikazaniTreneri = computed(() => {
  const start = (page.value - 1) * itemPerPage
  const end = start + itemPerPage
  return treneri.value.slice(start, end)
})

const ukupnoStranica = computed(() => {
  return Math.ceil(treneri.value.length / itemPerPage)
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