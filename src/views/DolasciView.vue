<template>
  <div class="glavni-sadrzaj-wrapper">

    <v-card elevation="5" class="stakleni-kontejner mb-6">

      <div class="text-center py-2 text-white font-weight-bold uppercase-title border-0 pb-4 mb-6">
        EVIDENCIJA DOLAZAKA
      </div>

      <v-row align="center">
        <v-col cols="12" md="5">
          <v-select
            v-model="noviDolazak.clan_id"
            :items="clanovi"
            item-title="ime_prezime"
            item-value="id"
            label="Odaberi člana"
            variant="outlined"
            color="white"
            density="comfortable"
            class="text-white"
          ></v-select>
        </v-col>

        <v-col cols="12" md="4">
          <v-text-field
            v-model="noviDolazak.napomena"
            label="Napomena"
            variant="outlined"
            color="white"
            density="comfortable"
            class="text-white"
          ></v-text-field>
        </v-col>

        <v-col cols="12" md="3">
          <v-btn
            block
            height="48"
            color="white"
            variant="outlined"
            class="rounded-lg font-weight-bold"
            @click="evidentirajDolazak"
          >
            Prijavi Ulaz
          </v-btn>
        </v-col>
      </v-row>
    </v-card>

    <v-card elevation="5" class="stakleni-kontejner">

      <v-card-title class="text-center py-5 text-white font-weight-bold uppercase-title">
        POPIS DOLAZAKA TERETANE
      </v-card-title>

      <v-table hover class="custom-table">
        <thead>
          <tr>
            <th class="text-center text-white font-weight-bold">#</th>
            <th class="text-left text-white font-weight-bold">ČLAN</th>
            <th class="text-center text-white font-weight-bold">VRIJEME DOLASKA</th>
            <th class="text-center text-white font-weight-bold">NAPOMENA</th>
            <th class="text-center text-white font-weight-bold">AKCIJE</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(d, index) in prikazaniDolasci" :key="d.id" class="table-row">
            <td class="text-center text-white">{{ (stranica - 1) * 10 + index + 1 }}.</td>
            <td class="text-left text-white font-weight-bold">{{ d.clan_ime }}</td>
            <td class="text-center text-white">{{ d.datum_vrijeme }}</td>
            <td class="text-center">
              <v-chip
                size="small"
                variant="tonal"
                :color="d.napomena ? 'indigo-lighten-4' : 'grey-darken-1'"
              >
                {{ d.napomena || '-' }}
              </v-chip>
            </td>
            <td class="text-center">
              <v-btn
                icon="mdi-delete"
                size="small"
                variant="text"
                color="red-lighten-1"
                @click="obrisiDolazak(d.id)"
              ></v-btn>
            </td>
          </tr>
        </tbody>
      </v-table>

      <v-divider class="border-opacity-15"></v-divider>

      <div class="text-center py-4">
        <v-pagination
          v-model="stranica"
          :length="brojStranica"
          rounded="circle"
          density="comfortable"
          color="white"
        ></v-pagination>
      </div>
    </v-card>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'

const dolasci = ref([])
const clanovi = ref([])
const stranica = ref(1)
const noviDolazak = ref({ clan_id: null, napomena: '' })

// Paginacija (10 po stranici)
const brojStranica = computed(() => Math.ceil(dolasci.value.length / 10))
const prikazaniDolasci = computed(() => {
  const start = (stranica.value - 1) * 10
  const end = start + 10
  return dolasci.value.slice(start, end)
})

const ucitajPodatke = async () => {
  try {
    const resDolasci = await axios.get('http://127.0.0.1:5000/dolasci')
    dolasci.value = resDolasci.data.reverse()

    const resClanovi = await axios.get('http://127.0.0.1:5000/clanovi')
    clanovi.value = resClanovi.data.map(c => ({
      id: c.id,
      ime_prezime: `${c.ime} ${c.prezime}`
    }))
  } catch (e) { console.error(e) }
}

const evidentirajDolazak = async () => {
  if (!noviDolazak.value.clan_id) return
  await axios.post('http://127.0.0.1:5000/dolasci', noviDolazak.value)
  noviDolazak.value = { clan_id: null, napomena: '' }
  await ucitajPodatke()
}

const obrisiDolazak = async (id) => {
  if (confirm("Obrisati?")) {
    await axios.delete(`http://127.0.0.1:5000/dolasci/${id}`)
    await ucitajPodatke()
  }
}

onMounted(ucitajPodatke)
</script>

<style scoped>
.table-container {
  background-color: black !important;
  border: 1px solid white !important;
  border-radius: 12px !important;
  overflow: hidden;
}

.table-header {
  text-align: center;
  color: white;
  font-size: 1.5rem;
  padding: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.gym-table {
  background-color: black !important;
}

:deep(th) {
  font-weight: bold !important;
  color: white !important;
  border-bottom: 1px solid white !important;
}

:deep(td) {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important;
  padding: 15px !important;
  color: white !important;
}

.stakleni-okvir {
  background-color: rgba(0, 0, 0, 0.7) !important;
  backdrop-filter: blur(10px);
  border: 1px solid white !important;
}
</style>