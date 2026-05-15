<template>
  <v-container>
    <v-dialog v-model="dialog" max-width="500px">
      <v-card class="rounded-lg" theme="dark" color="#1e1e1e">
        <v-card-title class="text-center py-4 bg-green-darken-3 text-white">
          UPIS NOVOG ČLANA
        </v-card-title>
        <v-card-text class="pa-6">
          <v-form ref="form">
            <p class="text-caption text-grey-lighten-1 mb-1 ml-1">Ime člana</p>
            <v-text-field v-model="noviClan.ime" variant="outlined" bg-color="#2a2a2a" density="compact" color="green" class="mb-4" hide-details autocomplete="off"></v-text-field>

            <p class="text-caption text-grey-lighten-1 mb-1 ml-1">Prezime člana</p>
            <v-text-field v-model="noviClan.prezime" variant="outlined" bg-color="#2a2a2a" density="compact" color="green" class="mb-4" hide-details autocomplete="off"></v-text-field>

            <p class="text-caption text-grey-lighten-1 mb-1 ml-1">Paket članarine</p>
            <v-select v-model="noviClan.paket_id" :items="paketi" item-title="naziv" item-value="id" variant="outlined" bg-color="#2a2a2a" color="green" class="mb-4" hide-details></v-select>

            <p class="text-caption text-grey-lighten-1 mb-1 ml-1">Trener</p>
            <v-select v-model="noviClan.trener_id" :items="treneriOpcije" item-title="prikaz" item-value="id" variant="outlined" bg-color="#2a2a2a" color="green" class="mb-4" hide-details></v-select>
          </v-form>
        </v-card-text>
        <v-card-actions class="pa-4 justify-end">
          <v-btn color="grey-lighten-1" variant="text" @click="dialog = false">Odustani</v-btn>
          <v-btn color="green-darken-3" variant="elevated" @click="spremiClana" class="px-6">Spremi</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-row justify="center" class="mt-8">
      <v-col cols="12" md="11" lg="10">
        <v-card
          theme="dark"
          variant="outlined"
          class="pa-8 rounded-xl"
          style="border: 1px solid white !important; background-color: rgba(0, 0, 0, 0.7) !important; backdrop-filter: blur(10px);"
        >
          <div class="text-center mb-10">
            <h1 class="text-h4 font-weight-bold text-white">Pregled Sustava</h1>
          </div>

          <v-row justify="center" align="start">
            <v-col cols="12" sm="6" md="3" class="text-center mb-6">
              <v-icon size="50" color="green-lighten-2" icon="mdi-account-group" class="mb-2"></v-icon>
              <div class="text-overline text-grey-lighten-1">UKUPNO ČLANOVA</div>
              <div class="text-h3 font-weight-black text-green">{{ statistika.broj_clanova }}</div>
            </v-col>

            <v-col cols="12" sm="6" md="3" class="text-center mb-6">
              <v-icon size="50" color="blue-lighten-2" icon="mdi-account-star" class="mb-2"></v-icon>
              <div class="text-overline text-grey-lighten-1">AKTIVNI TRENERI</div>
              <div class="text-h3 font-weight-black text-blue">{{ statistika.broj_trenera }}</div>
            </v-col>

            <v-col cols="12" sm="6" md="3" class="text-center mb-6">
              <v-icon size="50" color="yellow-darken-2" icon="mdi-currency-eur" class="mb-2"></v-icon>
              <div class="text-overline text-grey-lighten-1">UKUPNA ZARADA</div>
              <div class="text-h3 font-weight-black text-yellow-darken-2">{{ statistika.ukupna_zarada }}€</div>
            </v-col>

            <v-col cols="12" sm="6" md="3" class="text-center mb-6">
              <v-icon size="50" color="red-lighten-1" icon="mdi-run-fast" class="mb-2"></v-icon>
              <div class="text-overline text-grey-lighten-1">DOLASCI DANAS</div>
              <div class="text-h3 font-weight-black text-red-lighten-1">{{ statistika.dolasci_danas }}</div>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>

    <v-row justify="center" class="mt-10">
      <v-btn
        variant="outlined"
        color="white"
        size="x-large"
        prepend-icon="mdi-plus"
        class="custom-btn-frame px-10 py-6"
        @click="dialog = true"
      >
        Postani Član
      </v-btn>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'

const dialog = ref(false)
const paketi = ref([])
const treneriRaw = ref([])

// Novi objekt za statistiku koji povlači sve odjednom
const statistika = ref({
  broj_clanova: 0,
  broj_trenera: 0,
  ukupna_zarada: 0,
  dolasci_danas: 0
})

const noviClan = ref({
  ime: '',
  prezime: '',
  paket_id: null,
  trener_id: null
})

const treneriOpcije = computed(() => {
  const lista = treneriRaw.value.map(t => ({
    id: t.id,
    prikaz: `${t.ime} ${t.prezime}`
  }))
  return [{ id: null, prikaz: 'Ne želim trenera (Samostalan trening)' }, ...lista]
})

const dohvatiPodatke = async () => {
  try {
    // 1. Dohvaćamo novu statistiku za dashboard
    const resStat = await axios.get('http://127.0.0.1:5000/dashboard-statistika')
    statistika.value = resStat.data

    // 2. Dohvaćamo opcije za formu (paketi i treneri)
    const [resTreneri, resPaketi] = await Promise.all([
      axios.get('http://127.0.0.1:5000/treneri'),
      axios.get('http://127.0.0.1:5000/paketi')
    ])
    treneriRaw.value = resTreneri.data
    paketi.value = resPaketi.data
  } catch (error) {
    console.error("Greška pri dohvaćanju podataka:", error)
  }
}

const spremiClana = async () => {
  if (!noviClan.value.ime || !noviClan.value.prezime || !noviClan.value.paket_id) {
    alert("Molimo ispunite ime, prezime i odaberite paket!");
    return;
  }
  try {
    await axios.post('http://127.0.0.1:5000/clanovi', noviClan.value);
    dialog.value = false;
    noviClan.value = { ime: '', prezime: '', paket_id: null, trener_id: null };
    await dohvatiPodatke(); // Osvježi brojeve na dashboardu
    alert("Novi član je uspješno dodan!");
  } catch (error) {
    console.error("Greška pri spremanju:", error);
  }
}

onMounted(() => {
  dohvatiPodatke()
})
</script>

<style scoped>
/* Zadržavamo tvoj stil pozadine i gumba */
:global(.v-application__wrap) {
  background-image: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7)),
                    url('@/assets/pozadina.jpg') !important;
  background-size: cover !important;
  background-position: center !important;
  background-attachment: fixed !important;
}

.custom-btn-frame {
  border: 1px solid white !important;
  border-radius: 12px !important;
  background-color: rgba(0, 0, 0, 0.6) !important;
  backdrop-filter: blur(5px);
  font-weight: bold !important;
  transition: 0.3s ease;
}

.custom-btn-frame:hover {
  background-color: white !important;
  color: black !important;
  transform: scale(1.05);
}
</style>