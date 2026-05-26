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

    <div class="glavni-sadrzaj-wrapper">

      <div class="pregled-sustava-kontejner">

        <h1 class="glavni-naslov">Pregled Sustava</h1>

        <div class="kartice-red">

          <div class="statistika-kartica">
            <v-icon size="32" color="white" icon="mdi-account-group"></v-icon>
            <h3 class="naslov">UKUPNO ČLANOVA</h3>
            <p class="broj">{{ statistika.broj_clanova }}</p>
          </div>

          <div class="statistika-kartica">
            <v-icon size="32" color="white" icon="mdi-account-star"></v-icon>
            <h3 class="naslov">AKTIVNI TRENERI</h3>
            <p class="broj">{{ statistika.broj_trenera }}</p>
          </div>

          <div class="statistika-kartica">
            <v-icon size="32" color="white" icon="mdi-currency-eur"></v-icon>
            <h3 class="naslov">UKUPNA ZARADA</h3>
            <p class="broj">{{ statistika.ukupna_zarada }}€</p>
          </div>

          <div class="statistika-kartica">
            <v-icon size="32" color="white" icon="mdi-run-fast"></v-icon>
            <h3 class="naslov">DOLASCI DANAS</h3>
            <p class="broj">{{ statistika.dolasci_danas }}</p>
          </div>

        </div>
      </div>

      <div class="gumb-wrapper">
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
      </div>

    </div>
  </v-container>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'

const dialog = ref(false)
const paketi = ref([])
const treneriRaw = ref([])

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
    const resStat = await axios.get('http://127.0.0.1:5000/dashboard-statistika')
    statistika.value = resStat.data

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
    await dohvatiPodatke();
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

/* Dodatni mali popravak za naslov unutar ove komponente */
.glavni-naslov {
  font-size: 28px;
  font-weight: bold;
  color: #ffffff;
  margin-bottom: 20px;
}
</style>