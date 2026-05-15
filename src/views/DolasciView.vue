<template>
  <v-container>
    <v-card variant="outlined" class="mx-auto rounded-xl stakleni-okvir pa-6 mb-6" max-width="1000">
      <h2 class="text-white text-center mb-6">EVIDENCIJA DOLAZAKA</h2>
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
          ></v-select>
        </v-col>
        <v-col cols="12" md="4">
          <v-text-field
            v-model="noviDolazak.napomena"
            label="Napomena"
            variant="outlined"
            color="white"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="3">
          <v-btn block height="56" color="white" variant="outlined" @click="evidentirajDolazak">
            Prijavi Ulaz
          </v-btn>
        </v-col>
      </v-row>
    </v-card>

    <v-card class="mx-auto table-container" max-width="1000">
      <div class="table-header">POPIS DOLAZAKA TERETANE</div>

      <v-table theme="dark" class="gym-table">
        <thead>
          <tr>
            <th class="text-center">#</th>
            <th class="text-left">ČLAN</th>
            <th class="text-center">VRIJEME DOLASKA</th>
            <th class="text-center">NAPOMENA</th>
            <th class="text-center">AKCIJE</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(d, index) in prikazaniDolasci" :key="d.id">
            <td class="text-center">{{ (stranica - 1) * 10 + index + 1 }}.</td>
            <td class="text-left font-weight-bold">{{ d.clan_ime }}</td>
            <td class="text-center">{{ d.datum_vrijeme }}</td>
            <td class="text-center">
              <v-chip size="small" variant="tonal" class="text-grey-lighten-1">
                {{ d.napomena || '-' }}
              </v-chip>
            </td>
            <td class="text-center">
              <v-btn icon="mdi-delete" size="small" variant="text" color="red" @click="obrisiDolazak(d.id)"></v-btn>
            </td>
          </tr>
        </tbody>
      </v-table>

      <v-divider></v-divider>
      <div class="pa-4 d-flex justify-center">
        <v-pagination
          v-model="stranica"
          :length="brojStranica"
          rounded="circle"
          color="white"
          active-color="white"
          density="comfortable"
        ></v-pagination>
      </div>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'

const dolasci = ref([])
const clanovi = ref([])
const stranica = ref(1)
const noviDolazak = ref({ clan_id: null, napomena: '' })

// Logika za paginaciju (10 po stranici)
const brojStranica = computed(() => Math.ceil(dolasci.value.length / 10))
const prikazaniDolasci = computed(() => {
  const start = (stranica.value - 1) * 10
  const end = start + 10
  return dolasci.value.slice(start, end)
})

const ucitajPodatke = async () => {
  try {
    const resDolasci = await axios.get('http://127.0.0.1:5000/dolasci')
    // Poredaj dolaske tako da najnoviji budu prvi
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
/* Glavni kontejner za tablicu - Crna pozadina s bijelim rubom */
.table-container {
  background-color: black !important;
  border: 1px solid white !important;
  border-radius: 12px !important;
  overflow: hidden;
}

/* Naslov unutar tablice */
.table-header {
  text-align: center;
  color: white;
  font-size: 1.5rem;
  padding: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

/* Stil same tablice */
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