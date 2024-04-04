<template>
  <v-container>
    <v-row justify="center" align="center">
      <v-col cols="12" sm="10" md="8">
        <h2 class="text-center
          mb-3">店舗責任者
        </h2>

        <v-bottom-navigation v-model="bottomNav" grow color="primary">

          <v-btn value="shop">
            <span class="mt-1">店舗</span>
            <v-icon>mdi-home-plus</v-icon>
          </v-btn>

          <v-btn value="reservation">
            <span class="mt-1">予約</span>
            <v-icon>mdi-calendar-month-outline</v-icon>
          </v-btn>

          <v-btn value="mail">
            <span class="mt-1">メール</span>
            <v-icon>mdi-email-arrow-right-outline</v-icon>
          </v-btn>

        </v-bottom-navigation>
        <v-divider></v-divider>

        <ShopForm v-if="bottomNav === 'shop'" />
        <ReservationForm v-if="bottomNav === 'reservation'" />
        <MailForm v-if="bottomNav === 'mail'" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import ShopForm from '~/components/ownerpage/ShopForm.vue';
import ReservationForm from '~/components/ownerpage/ReservationForm.vue';
import MailForm from '~/components/ownerpage/MailForm.vue';

export default {
  name: 'ManagementPage',
  layout: 'dashboard',
  components: {
    ShopForm,
    ReservationForm,
    MailForm,
  },

  data() {
    return {
       bottomNav: 'shop'
    };

  },
};
</script>

<style>
/* 影を非表示 */
.v-application .v-bottom-navigation {
  box-shadow: none;
}
</style>