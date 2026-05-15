<template>
  <v-container>
    <v-card variant="outlined" class="mx-auto rounded-xl stakleni-okvir pa-6 mb-6" max-width="1000">
      <h2 class="text-white text-center mb-6">EVIDENCIJA UPLATA</h2>
      <v-row align="center">
        <v-col cols="12" md="4">
          <v-select
            v-model="novaUplata.clan_id"
            :items="clanovi"
            item-title="ime_prezime"
            item-value="id"
            label="Član"
            variant="outlined"
            color="white"
          ></v-select>
        </v-col>
        <v-col cols="12" md="4">
          <v-select
            v-model="novaUplata.paket_id"
            :items="paketi"
            item-title="naziv"
            item-value="id"
            label="Paket"
            variant="outlined"
            color="white"
          ></v-select>
        </v-col>
        <v-col cols="12" md="4">
          <v-btn block height="56" color="green-darken-2" variant="elevated" @click="spremiUplatu">
            Proknjiži uplatu
          </v-btn>
        </v-col>
      </v-row>
    </v-card>

    <v-card class="mx-auto table-container" max-width="1000">
      <div class="table-header">POVIJEST TRANSAKCIJA</div>
      <v-table theme="dark" class="gym-table">
        <thead>
          <tr>
            <th class="text-center">#</th>
            <th class="text-left">ČLAN</th>
            <th class="text-center">PAKET</th>
            <th class="text-center">IZNOS</th>
            <th class="text-center">DATUM</th>
            <th class="text-center">AKCIJE</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(u, index) in prikazaneUplate" :key="u.id">
            <td class="text-center">{{ index + 1 }}.</td>
            <td class="text-left font-weight-bold">{{ u.clan_ime }}</td>
            <td class="text-center">{{ u.paket_naziv }}</td>
            <td class="text-center text-green-accent-3">{{ u.iznos }} EUR</td>
            <td class="text-center">{{ u.datum }}</td>
            <td class="text-center">
              <v-btn icon="mdi-delete" size="small" variant="text" color="red" @click="obrisi(u.id)"></v-btn>
            </td>
          </tr>
        </tbody>
      </v-table>

      <v-pagination
        v-model="stranica"
        :length="Math.ceil(uplate.length / 10)"
        color="white"
        class="pa-4"
      ></v-pagination>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'

const uplate = ref([])
const clanovi = ref([])
const paketi = ref([])
const stranica = ref(1)
const novaUplata = ref({ clan_id: null, paket_id: null })

const prikazaneUplate = computed(() => {
  const start = (stranica.value - 1) * 10
  return uplate.value.slice(start, start + 10)
})

const ucitajSve = async () => {
  const [resU, resC, resP] = await Promise.all([
    axios.get('http://127.0.0.1:5000/uplate'),
    axios.get('http://127.0.0.1:5000/clanovi'),
    axios.get('http://127.0.0.1:5000/paketi')
  ])
  uplate.value = resU.data.reverse()
  clanovi.value = resC.data.map(c => ({ id: c.id, ime_prezime: `${c.ime} ${c.prezime}` }))
  paketi.value = resP.data
}

const spremiUplatu = async () => {
  if (!novaUplata.value.clan_id || !novaUplata.value.paket_id) return
  await axios.post('http://127.0.0.1:5000/uplate', novaUplata.value)
  novaUplata.value = { clan_id: null, paket_id: null }
  await ucitajSve()
}

const obrisi = async (id) => {
  if (confirm("Obriši zapis o uplati?")) {
    await axios.delete(`http://127.0.0.1:5000/uplate/${id}`)
    await ucitajSve()
  }
}

onMounted(ucitajSve)
</script>

<style scoped>
.table-container { background-color: black !important; border: 1px solid white !important; border-radius: 12px; }
.table-header { text-align: center; color: white; padding: 20px; border-bottom: 1px solid rgba(255,255,255,0.2); }
.gym-table { background-color: black !important; }
:deep(td) { border-bottom: 1px solid rgba(255,255,255,0.1) !important; color: white !important; }
.stakleni-okvir { background-color: rgba(0,0,0,0.7) !important; border: 1px solid white !important; }
</style>