<template>
  <v-app>
    <v-app-bar flat class="custom-navbar px-4">
      <v-app-bar-title class="font-weight-bold">
        <router-link to="/" style="text-decoration: none; color: inherit; cursor: pointer">
          Gym Hub
        </router-link>
      </v-app-bar-title>
      <v-spacer></v-spacer>
      <v-btn to="/" variant="text" class="me-4 nav-btn">Početna</v-btn>
      <v-btn to="/treneri" variant="text" class="me-4 nav-btn">Treneri</v-btn>
      <v-btn to="/clanovi" variant="text" class="me-4 nav-btn">Članovi</v-btn>
      <v-btn to="/dolasci" variant="text" class="me-10 nav-btn">Dolasci</v-btn>
    </v-app-bar>

    <v-main style="padding-top: 15px">
      <v-container fluid class="mt-16">
        <v-row justify="center">
          <v-col cols="12" md="10" lg="8" class="d-flex justify-center">
            <div style="width: 100%;">
              <router-view />
            </div>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<style>

.custom-navbar {
  background-color: rgba(0, 0, 0, 0.3) !important;
  backdrop-filter: blur(12px) !important;
  -webkit-backdrop-filter: blur(12px) !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important;
  color: white !important;
}


.nav-btn {
  font-weight: 500 !important;
  color: white !important;
}


.v-application {
  background: none !important;
}
</style>