<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated >
          <q-bar class="bg-black text-white"  style="height: 70px">
            <q-item-section avatar>
              <q-avatar rounded size="65px">
                <img src="https://cdn.quasar.dev/img/chaosmonkey.png" >
              </q-avatar>
            </q-item-section>
            <div> ANALYZER_APP </div>
            <q-space />
            <div> KEMEL RUANO</div>
            <div> 202006373</div>
            </q-bar>
    </q-header>
   <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
const linksList = [
  {
    title: 'Github',
    icon: "code",
    link: 'https://github.com/KemelRuano'
  },
  {
    title: 'Facebook',
    icon: 'public',
    link: 'https://www.facebook.com/kemel.ruano'
  }
]

export default {
  data () {
    return {

    }
  }
}
</script>
