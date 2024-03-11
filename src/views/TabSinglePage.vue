<template>
  <ion-page>
    <HeaderBar :name="title" />

    <ion-content id="main-content" :fullscreen="true">
      <div class="ion-padding" v-html="content"></div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="js">
import {IonPage, IonContent} from '@ionic/vue';
import HeaderBar from "@/components/HeaderBar.vue";
</script>

<script lang="js">
// add some page data
export default {
  data() {
    return {
      title: 'Travelling and Accommodation',
      content: '<h5>Travelling</h5>' +
          '<p>Below you can find a map where the main points are highlighted: the airport, the city center main stop and DTU’s main bus stop. To travel between the airport and the city center there is a single metro line. To travel between the city center and DTU the easiest way is using the bus line 150S (which runs every 10 minutes in both directions).</p>' +
          '\n' +
          '\n' +
          '\n' +
          '<p><strong>How to get to Copenhagen City Center from Copenhagen Airport</strong><br>Take the Metro Line M2 destination&nbsp;<em>Vanløse</em>&nbsp;to&nbsp;<em>Nørreport Station</em>. We encourage you to travel on public transportation to lower your carbon footprint.</p>\n' +
          '\n' +
          '\n' +
          '\n' +
          '<p><strong>How to get to DTU from Copenhagen City Center</strong><br>From the area around Kongens Nytorv: Take the Metro or walk to&nbsp;<em>Nørreport Station</em>&nbsp;and take&nbsp;either bus line 150S destination&nbsp;<em>Kokkedal St.</em>, departing from above ground. Get off at&nbsp;<em>Rævehøjvej, DTU</em>, and walk to the Campus.</p>\n' +
          '\n' +
          '\n' +
          '\n' +
          '<p>From the area around Copenhagen City Hall and Copenhagen Central Station (Vesterbro): Walk to Copenhagen Central Station and take the S-train line A destination&nbsp;<em>Hillerød St</em>., get off at&nbsp;<em>Lyngby Station&nbsp;</em>and change to bus line 40E destination&nbsp;<em>Rævehøjvej, DTU,&nbsp;</em>get off at the terminus and walk to the Campus.</p>\n' +
          '\n' +
          '\n' +
          '\n' +
          '<p>Walking direction from bus stop <em>Rævehøjvej, DTU</em> to building 116 (6 minutes):</p>\n' +
          '<div class="wp-block-image"><figure class="aligncenter size-full is-resized"><a href="https://maps.app.goo.gl/oStjnqokKJHViiX77" target="_blank" rel="noopener"><img src="https://icpmconference.org/2024/wp-content/uploads/sites/9/2023/09/map.jpg" alt=""  srcset="https://icpmconference.org/2024/wp-content/uploads/sites/9/2023/09/map.jpg 827w, https://icpmconference.org/2024/wp-content/uploads/sites/9/2023/09/map-300x182.jpg 300w, https://icpmconference.org/2024/wp-content/uploads/sites/9/2023/09/map-768x467.jpg 768w" /></a></figure></div>\n' +
          '<p><strong>Travel Card (Rejsekort)</strong><br>Rejsekort (Travel Card) is a prepaid card for taking public transportations in Denmark. You can obtain an anonymous card in convenient stores or at Rejsekort machines. We suggest you buy your Rejsekort at the airport, since you might find Rejsekort machines outside airport running out of new anonymous cards prepared to be purchased very often.</p>\n'
    }
  }
}
</script>