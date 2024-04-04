<template>
  <v-container>
    <v-card
      class="mx-auto
      mt-5
      pb-2
      rounded-xl"
      max-width="400">
      <v-toolbar color="secondary" dark flat>
        <v-toolbar-title
          style="margin: 0 auto;
          letter-spacing: 0.2em;">
          新規会員登録
        </v-toolbar-title>
      </v-toolbar>
      <v-card-text>
        <div align="center">
        <v-alert
          class="mt-3"
          width="250"
          color="red"
          dense
          text
        ><div class="mt-1">※入力項目は全て必須</div>
        </v-alert>
        </div>

        <ValidationObserver ref="registerserver">
          <v-form @submit.prevent="userRegister">
            <!-- 名前入力 -->
            <v-row>
              <v-col cols="12">
                <ValidationProvider
                  rules="required"
                  v-slot="{ errors }"
                  name="名前">
                  <v-text-field
                    class="pt-2"
                    prepend-icon="mdi-account-circle"
                    v-model="name"
                    name="名前"
                    label="名前"
                    :error-messages="errors"
                    placeholder="例）山田　太郎"
                    hint="姓と名の間に全角スペースを入力"
                    persistent-hint
                    required>
                  </v-text-field>
                </ValidationProvider>
              </v-col>
            </v-row>

            <!-- メールアドレス入力 -->
            <v-row class="mt-1">
              <v-col cols="12">
                <ValidationProvider
                  rules="required|email"
                  v-slot="{ errors }"
                  name="メールアドレス">
                  <v-text-field
                    class="pt-2"
                    prepend-icon="mdi-email"
                    v-model="email"
                    name="メールアドレス"
                    label="メールアドレス"
                    :error-messages="errors"
                    placeholder="例）mail@example.com"
                    type="email"
                    hint="有効なメールアドレスの形式"
                    persistent-hint
                    required>
                  </v-text-field>
                </ValidationProvider>
              </v-col>
            </v-row>

            <!-- パスワード入力 -->
            <v-row class="mt-1">
              <v-col cols="12">
                <ValidationProvider
                  rules="required|min:8|max:16|alphanumeric"
                  v-slot="{ errors }"
                  name="パスワード">
                  <v-text-field
                    class="pt-2"
                    prepend-icon="mdi-lock"
                    :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                    :type="showPassword ? 'text' : 'password'"
                    v-model="password"
                    name="パスワード"
                    label="パスワード"
                    :error-messages="errors"
                    placeholder="例）1234abcd　1234ABCD"
                    hint="半角英数字の混合　8文字以上16文字以下"
                    persistent-hint
                    @click:append="showPassword = !showPassword"
                    required>
                  </v-text-field>
                </ValidationProvider>
              </v-col>
            </v-row>

            <!-- 会員登録ボタン -->
            <v-row>
              <v-col cols="12">
                <div class="text-center mt-2 pb-1">
                  <!-- class="text-noneは英語の頭文字以降を小文字にする" -->
                  <v-btn
                    @click="userRegister()"
                    class="text-body-1"
                    color="secondary"
                    rounded
                    valiant="flat"
                    width="150"
                    height="50">
                    会員登録する
                  </v-btn>
                </div>
              </v-col>
            </v-row>
          </v-form>
        </ValidationObserver>
      </v-card-text>
    </v-card>

    <!-- ログインページへ -->
    <div class="text-center mt-8">
      <NuxtLink
        class="link-btn"
        to="/users/login">
        ログインの方はこちら
        <v-icon color="success" class="mb-1">
         mdi-chevron-right
        </v-icon>
      </NuxtLink>
    </div>
  </v-container>
</template>

<script>
import { ValidationObserver } from 'vee-validate';

export default {
  name: 'RegisterForm',
  components: { ValidationObserver },
    
  data() {
    return {
      showPassword: false,
      name: '',
      email: '',
      password: '',
    };
  },
  methods: {
    // フォームのバリデーションを実行するメソッド
    async validateForm() {
        return this.$refs.registerserver.validate();
    },

    // 新規登録
    async userRegister() {
      try {
        if (await this.validateForm()) {
          const response = await this.$axios.post(`${process.env.API_URL}/api/auth/user/register`, {
            name: this.name,
            email: this.email,
            password: this.password
          });

          this.$router.push("/users/confirm");
          console.log('登録されました。', response.data);
        }
      } catch (error) {
        console.error('登録に失敗しました', error);
      }
    },
  },
};
</script>

<style scoped>
.link-btn {
  position: relative;
  display: inline-block;
  color: #2E7D32;
  font-weight: bold;
  text-decoration: none;
  margin-left: 10px;
}

.link-btn:hover {
  opacity: 0.8;
}

.link-btn::after {
  position: absolute;
  bottom: -2px;
  left: -3px;
  content: '';
  width: 100%;
  height: 2px;
  background: #2E7D32;
  transform: scale(0, 1);
  transform-origin: left top;
  transition: transform 0.3s;
}

.link-btn:hover::after {
  transform: scale(1, 1);
  opacity: 0.8;
}
</style>