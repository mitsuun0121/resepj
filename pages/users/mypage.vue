<template>
  <v-container>
    <v-row justify="center" align="center">
      <v-col cols="12" sm="10" md="8">
        <h1 class="text-center
          mb-3">マイページ
        </h1>

        <p class="text-center
          text-h6
          pb-2">{{ $auth.user.name }}　様
        </p>

        <v-bottom-navigation v-model="bottomNav" grow color="primary">

          <v-btn value="reservation">
            <span class="mt-1">予約</span>
            <v-icon>mdi-calendar-month-outline</v-icon>
          </v-btn>

          <v-btn value="favorite">
            <span class="mt-1">お気に入り</span>
            <v-icon>mdi-heart-outline</v-icon>
          </v-btn>

          <v-btn value="review">
            <span class="mt-1">口コミ</span>
            <v-icon>mdi-tooltip-text-outline</v-icon>
          </v-btn>

        </v-bottom-navigation>
        <v-divider></v-divider>

        <ReservationForm v-if="bottomNav === 'reservation'" />
        <FavoriteForm v-if="bottomNav === 'favorite'" />
        <ReviewForm v-if="bottomNav === 'review'" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import ReservationForm from '~/components/mypage/ReservationForm.vue';
import FavoriteForm from '~/components/mypage/FavoriteForm.vue';
import ReviewForm from '~/components/mypage/ReviewForm.vue';

export default {
  name: 'MyPage',
  layouts: 'default',

  components: {
    ReservationForm,
    FavoriteForm,
    ReviewForm,
  },

  data() {
    return {
       bottomNav: 'reservation'
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
