<template>
  <v-container>
    <!-- お店の詳細 予約フォームを表示 -->
    <v-row justify="center">
      <v-col cols="12" sm="12" md="6" lg="6" xl="4">
        <DetailForm />
      </v-col>
      <v-col cols="12" sm="12" md="6" lg="6" xl="4" class="pt-15">
        <ReservationForm />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import DetailForm from '~/components/shop/DetailForm.vue';
import ReservationForm from '~/components/shop/ReservationForm.vue';

export default {
  name: 'ShopPage',
  layouts: 'default',

  components: {
    DetailForm,
    ReservationForm,
  },

  data() {
    return {

    };
  },
};
</script>

<style>
.v-rating .v-icon {
  padding: 0.1em; /* デフォルトのpaddingを上書き */
}
</style>
