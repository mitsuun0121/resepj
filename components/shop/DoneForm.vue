<template>
  <v-container>
    <v-card
      class="mx-auto
      mt-3 
      pb-10
      rounded-xl"
      width="400">
      <v-card-title class="justify-center">ご予約が完了致しました</v-card-title>

      <v-divider></v-divider>

      <v-card-text
        class="text-body-1
        text-center
        mt-5">この度はご予約いただき誠に
        <br>ありがとうございます。
      </v-card-text>

      <!-- 料理人画像 -->
      <div class="text-center mt-5">
        <img src="~assets/img/done.jpg" width="100">
      </div>

      <!-- トップ画面へ遷移 -->
      <div class="text-center
        mt-10
        mb-5">
        <NuxtLink to="/" class="top-btn">
          トップページへ
        </NuxtLink>
      </div>

      <!-- Stripe決済画面へ遷移 -->
      <div
        class="text-center
        mt-12
        mb-1">
        <v-btn
          class="text-none"
          width="155"
          height="45"
          color="primary"
          @click="stripeCheckout">
          Stripeで決済する
        </v-btn>
      </div>

    </v-card>
  </v-container>
</template>

<script>
export default {
  name: 'DoneForm',

  data() {
    return {
      
    }
  },

  methods: {
    // Stripe決済機能
    async stripeCheckout() {
      const response = await this.$axios.post(`${process.env.API_URL}/api/create-checkout-session`, {
        amount: 1000,
        currency: 'jpy',
      });
      const sessionId = response.data.sessionId;

      const stripe = await this.$stripe;
      stripe.redirectToCheckout({
        sessionId: sessionId,
      }).then(function (result) {
        if (result.error) {
          console.error('支払いエラー:', result.error.message);
        }
      });
    },
  }
}
</script>

<style scoped>
.top-btn {
  color: #3A4EFE;
  font-weight: bold;
  text-decoration: none;
  border: 2px solid #3A4EFE;
  border-radius: 4px;
  padding: 12px 18px;
  transition: 0.7s;
}

.top-btn:hover {
  opacity: 0.6;
}

a {
  text-decoration: none;
  transition: 0.7s;
}

a:hover {
  opacity: 0.8;
  cursor: pointer;
}
</style>
