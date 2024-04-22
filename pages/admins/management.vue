<template>
  <v-container>
    <v-row justify="center" align="center">
      <v-col cols="12" sm="10" md="8">
        <h2 class="text-center
          mb-3">管理者
        </h2>

        <v-bottom-navigation v-model="bottomNav" grow color="primary">

          <v-btn value="owners">
            <span class="mt-1">店舗代表者</span>
            <v-icon>mdi-account-plus</v-icon>
          </v-btn>

          <v-btn value="shops">
            <span class="mt-1">店舗</span>
            <v-icon>mdi-home-plus</v-icon>
          </v-btn>

          <v-btn value="reviews">
            <span class="mt-1">口コミ</span>
            <v-icon>mdi-tooltip-text-outline</v-icon>
          </v-btn>

        </v-bottom-navigation>
        <v-divider></v-divider>

        <RegisterForm v-if="bottomNav === 'owners'" />
        <ShopForm v-if="bottomNav === 'shops'" />
        <ReviewForm v-if="bottomNav === 'reviews'" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import RegisterForm from '~/components/adminpage/RegisterForm.vue';
import ShopForm from '~/components/adminpage/ShopForm.vue';
import ReviewForm from '~/components/adminpage/ReviewForm.vue';

export default {
  name: 'ManagementPage',
  layout: 'dashboard',
  components: {
    RegisterForm,
    ShopForm,
    ReviewForm,
  },

  data() {
    return {
       bottomNav: 'owners'
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
