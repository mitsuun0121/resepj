<template>
  <v-container>
    <v-card
      class="mx-auto
      mt-5 
      pb-2
      rounded-xl"
      width="400">
      <v-card-title class="justify-center">会員登録が完了致しました</v-card-title>

      <v-divider></v-divider>

      <v-card-text
        class="text-center
        mt-5">この度は無料会員登録にお申込みいただき
        <br>誠にありがとうございます。
      </v-card-text>

      <v-card-text
        class="text-center">引き続き
        <NuxtLink to="/users/login"
          class="success--text
          font-weight-bold
          text-decoration-none">ログイン
        </NuxtLink>
        していただくことで、
        <br>下記サービスをご利用いただけます。
      </v-card-text>

      <v-card-text
        class="text-center
        mb-n3
        pl-1
        body-1
        font-weight-bold">
        <v-icon
        class="mb-1"
        color="info"
        left>mdi-information</v-icon>
        お店のご予約
      </v-card-text>

      <v-card-text
        class="text-center
        mb-n3
        pl-9
        body-1
        font-weight-bold">
        <v-icon
        class="mb-1"
        color="info"
        left>mdi-information</v-icon>
        お気に入りの登録
      </v-card-text>

      <v-card-text
        class="text-center
        pl-5
        body-1
        font-weight-bold">
        <v-icon
        class="mb-1"
        color="info"
        left>mdi-information</v-icon>
        レビューの投稿
      </v-card-text>
      
      <!-- 画面遷移 -->
      <div
        class="d-flex
        mt-6
        mb-2
        justify-space-around">
        
        <NuxtLink to="/" class="top-btn">
          トップページへ
        </NuxtLink>
      
        <NuxtLink to="/users/login" class="login-btn">
          ログインページへ
        </NuxtLink>
      </div>
      
    </v-card>
  </v-container>
</template>

<script>

export default {
  name: 'ThanksForm',
}
</script>

<style scoped>
.top-btn {
  color: #3A4EFE;
  font-weight: bold;
  text-decoration: none;
  border: 2px solid #3A4EFE;
  border-radius: 4px;
  padding: 10px;
  transition: 0.7s;
}

.top-btn:hover {
  opacity: 0.6;
}

.login-btn {
  color: #2E7D32;
  font-weight: bold;
  text-decoration: none;
  border: 2px solid #2E7D32;
  border-radius: 4px;
  padding: 10px;
  transition: 0.7s;
}

.login-btn:hover {
  opacity: 0.6;
}
</style>