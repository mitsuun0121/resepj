<template>
  <v-container>
    <v-card
        class="mx-auto
        mt-10 
        pb-2
        rounded-xl"
        width="400">
        <v-card-title class="justify-center">メールアドレス認証</v-card-title>

        <v-divider></v-divider>

        <v-card-text class="mt-5">
          ご本人様確認のため登録されたメールアドレスにメールを送信いたします。
        </v-card-text>

        <v-card-text class="mt-n2">
          届いたメールを開封していただき、メール内のリンクをクリックしてください．
        </v-card-text>

        <v-card-text class="mt-n2">
          メールアドレス認証が終了しましたら、会員登録が完了致します。
        </v-card-text>

        <v-list-item class="justify-start">
          <NuxtLink
            class="confirm-btn"
            to="/users/register"
          >戻る
          </NuxtLink>
        </v-list-item>
    </v-card>

  </v-container>
</template>

<script>
export default {
  name: 'ConfirmForm',
  
};
</script>

<style scoped>
.confirm-btn {
  font-size: clamp(0.8rem, calc(0.4vw + 0.5rem), 1.8rem);
  color: #ffffff;
  text-decoration: none;
  background-color: #838282;
  letter-spacing: 0.1em;
  padding: 7px 18px;
  border-radius: 24px;
  margin-left: 12px;
  box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.2);
  transition: 0.6s;
}

.confirm-btn:hover {
  opacity: 0.8;
}
</style>