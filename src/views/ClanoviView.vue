<template>
  <div class="glavni-sadrzaj-wrapper">

    <v-card elevation="5" class="stakleni-kontejner">
      <v-card-title class="text-center py-5 text-white font-weight-bold uppercase-title">
        POPIS ČLANOVA TERETANE
      </v-card-title>

      <div class="px-4 pt-4">
        <v-text-field
          v-model="searchQuery"
          prepend-inner-icon="mdi-magnify"
          label="Pretraži člana po imenu, treneru ili paketu..."
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
            <th class="text-center text-white font-weight-bold">Član</th>
            <th class="text-center text-white font-weight-bold">Dodijeljeni Trener</th>
            <th class="text-center text-white font-weight-bold">Odabrani Paket</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(clan, index) in filtriraniPrikazaniClanovi" :key="clan.id" class="table-row">
            <td class="text-center text-white">{{ (page - 1) * itemPerPage + index + 1 }}.</td>
            <td class="text-center text-white">{{ clan.ime }} {{ clan.prezime }}</td>

            <td class="text-center">
              <v-chip v-if="clan.trener !== 'Samostalan trening'" color="indigo-lighten-3" size="small" variant="tonal">
                {{ clan.trener }}
              </v-chip>
              <span v-else class="text-grey italic">Bez trenera</span>
            </td>

            <td class="text-center">
              <v-chip
                v-if="clan.paket !== 'Nema paketa'"
                color="success"
                size="small"
                label
              >
                {{ clan.paket }}
              </v-chip>
              <v-chip v-else color="error" size="small" variant="outlined" label>
                Nema paketa
              </v-chip>
            </td>
          </tr>

          <tr v-if="filtriraniPrikazaniClanovi.length === 0 && clanovi.length > 0">
            <td colspan="4" class="text-center text-grey-lighten-1 py-6">
              Nema članova koji odgovaraju pretrazi "{{ searchQuery }}"
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

      <v-card-text v-if="clanovi.length === 0" class="text-center pa-10">
        <v-progress-circular indeterminate color="green"></v-progress-circular>
        <div class="mt-2 text-white">Dohvaćam listu članova...</div>
      </v-card-text>
    </v-card>

  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import axios from 'axios'

const clanovi = ref([])
const page = ref(1)
const itemPerPage = 10

const searchQuery = ref('')

// Kada se upiše pojam u tražilicu, vraćamo korisnika na 1. stranicu paginacije
watch(searchQuery, () => {
  page.value = 1
})

// 1. Duboko filtriranje baze članova prema više parametara odjednom
const filtriraniClanovi = computed(() => {
  if (!searchQuery.value) {
    return clanovi.value
  }
  const query = searchQuery.value.toLowerCase().trim()
  return clanovi.value.filter(clan => {
    const punoIme = `${clan.ime} ${clan.prezime}`.toLowerCase()
    const trener = (clan.trener || '').toLowerCase()
    const paket = (clan.paket || '').toLowerCase()

    return punoIme.includes(query) ||
           trener.includes(query) ||
           paket.includes(query)
  })
})

// 2. Rezanje rezultata za paginaciju (isključivo na temelju filtriranog skupa)
const filtriraniPrikazaniClanovi = computed(() => {
  const start = (page.value - 1) * itemPerPage
  const end = start + itemPerPage
  return filtriraniClanovi.value.slice(start, end)
})

// 3. Dinamički izračun broja stranica ovisno o rezultatima pretrage
const ukupnoStranica = computed(() => {
  return Math.ceil(filtriraniClanovi.value.length / itemPerPage) || 1
})

const dohvatiClanove = async () => {
  try {
    const response = await axios.get('http://127.0.0.1:5000/clanovi')
    clanovi.value = response.data
  } catch (error) {
    console.error("Greška pri dohvaćanju članova:", error)
  }
}

onMounted(() => {
  dohvatiClanove()
})
</script>

<style scoped>
/* Glavni stakleni efekt */
.stakleni-okvir {
  border: 1px solid white !important;
  background-color: rgba(0, 0, 0, 0.7) !important;
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
}

/* Prozirna tablica */
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
  padding: 12px !important;
}

.table-row:hover {
  background-color: rgba(255, 255, 255, 0.05) !important;
}

.border-green-subtle {
  border: 1px solid rgba(76, 175, 80, 0.4) !important;
}

:deep(.v-pagination__item) {
  color: white !important;
}

:deep(.v-pagination__btn) {
  color: white !important;
}
</style>