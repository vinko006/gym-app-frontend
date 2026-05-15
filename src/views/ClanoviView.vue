<template>
  <v-card elevation="5" class="mx-auto rounded-lg stakleni-okvir" max-width="750">
    <v-card-title class="text-center py-4 bg-green-darken-3 text-white">
      POPIS ČLANOVA TERETANE
    </v-card-title>

    <v-table hover class="mx-auto mt-5 rounded-lg border-0 stakleni-okvir" style="max-width: 1000px;">
      <thead>
        <tr>
          <th class="text-center">#</th>
          <th class="text-center">Član</th>
          <th class="text-center">Dodijeljeni Trener</th>
          <th class="text-center">Odabrani Paket</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(clan, index) in prikazaniClanovi" :key="clan.id">
          <td class="text-center">{{ (page - 1) * itemPerPage + index + 1 }}.</td>
          <td class="text-center">{{ clan.ime }} {{ clan.prezime }}</td>

          <td class="text-center">
            <v-chip v-if="clan.trener !== 'Samostalan trening'" color="indigo" size="small" variant="tonal">
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
      </tbody>
    </v-table>

    <v-divider></v-divider>
    <div class="text-center py-4">
      <v-pagination
        v-model="page"
        :length="ukupnoStranica"
        rounded="circle"
        density="comfortable"
        color="green-darken-3"
      ></v-pagination>
    </div>

    <v-card-text v-if="clanovi.length === 0" class="text-center pa-10">
      <v-progress-circular indeterminate color="green"></v-progress-circular>
      <div class="mt-2">Dohvaćam listu članova...</div>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'

const clanovi = ref([])
const page = ref(1)
const itemPerPage = 10

const prikazaniClanovi = computed(() => {
  const start = (page.value - 1) * itemPerPage
  const end = start + itemPerPage
  return clanovi.value.slice(start, end)
})

const ukupnoStranica = computed(() => {
  return Math.ceil(clanovi.value.length / itemPerPage)
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

/* Hover efekt za redove */
.table-row:hover {
  background-color: rgba(255, 255, 255, 0.05) !important;
}

/* Suptilni zeleni okvir za pakete */
.border-green-subtle {
  border: 1px solid rgba(76, 175, 80, 0.4) !important;
}

/* Stil za paginaciju */
:deep(.v-pagination__item) {
  color: white !important;
}

:deep(.v-pagination__btn) {
  color: white !important;
}
</style>