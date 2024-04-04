<template>
  <v-container>
    <v-card class="mx-auto
      mt-5 
      pb-10
      rounded-xl"
      width="400">
      <v-card-title class="justify-center">お支払いが完了致しました</v-card-title>

      <v-divider></v-divider>

      <v-card-text class="text-body-1
        text-center
        mt-5">この度Stripe決済をご利用いただき<br>誠にありがとうございます。
      </v-card-text>

      <!-- 料理人画像 -->
      <div class="text-center mt-5">
        <img src="~assets/img/payment.jpg" width="50">
      </div>

      <!-- トップ画面へ遷移 -->
      <div class="text-center
        mt-10
        mb-5">
        <NuxtLink to="/" class="top-btn">
          トップページへ
        </NuxtLink>
      </div>

    </v-card>
  </v-container>
</template>

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