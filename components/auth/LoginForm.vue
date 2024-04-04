<template>
  <v-container>
    <v-card class="mx-auto
      mt-5
      pb-2
      rounded-xl"
      max-width="400">
      <v-toolbar color="success" dark flat>
        <v-toolbar-title
          style="margin: 0 auto;
          letter-spacing: 0.2em;">
          ログイン
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

        <div class="text-start">
          <p style="color: red;
          ">{{ loginError }}
          </p>
        </div>

        <ValidationObserver ref="loginserver">
          <v-form @submit.prevent="login">
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
                    :type="showPassword ? 'text' : 'password'" v-model="password"
                    name="パスワード"
                    label="パスワード"
                    :error-messages="errors"
                    placeholder="例）1234abcd　1234ABCD"
                    hint="半角英数字の混合　8文字以上16文字以下" persistent-hint
                    @click:append="showPassword = !showPassword"
                    required>
                  </v-text-field>
                </ValidationProvider>
              </v-col>
            </v-row>

            <!-- ログインボタン -->
            <v-row>
              <v-col cols="12">
                <div class="text-center
                  mt-2
                  pb-1">
                  <v-btn
                    type="submit"
                    class="text-body-1"
                    color="success"
                    rounded valiant="flat"
                    width="150"
                    height="50">
                    ログイン
                  </v-btn>
                </div>
              </v-col>
            </v-row>
          </v-form>
        </ValidationObserver>
      </v-card-text>
    </v-card>

    <!-- 新規会員登録ページへ -->
    <div class="text-center mt-8">
      <NuxtLink class="link-btn" to="/users/register">
        会員登録がお済みでない方はこちら
        <v-icon color="primary" class="mb-1">
          mdi-chevron-right
        </v-icon>
      </NuxtLink>
    </div>
  </v-container>
</template>

<script>
import { ValidationObserver, ValidationProvider } from 'vee-validate';

export default {
  name: 'LoginForm',
  components: { ValidationObserver, ValidationProvider },

  data() {
    return {
      showPassword: false,
      email: '',
      password: '',
      loginError: '', // 認証エラーメッセージ
    };
  },

   methods: {
    // フォームのバリデーションを実行するメソッド
    async validateForm() {
      return this.$refs.loginserver.validate();
     },

    // ログイン
    async login() {
      try {
        // フォームのバリデーション
        const isValid = await this.validateForm();
    
        if (isValid) {
          // ユーザーリストを取得
          const responseUser = await this.$axios.get(`${process.env.API_URL}/api/user/`);
      
          const userList = responseUser.data;

          // 登録されているか
          const isUser = userList.some(user => user.email === this.email);

          if (isUser) {
            await this.$auth.loginWith('laravelUser', {
              data: {
                email: this.email,
                password: this.password,
              },
              headers: {
                'Content-Type': 'application/json',
              },
            });

            console.log('ログインに成功しました', this.$auth.loggedIn);
            console.log('ユーザー情報:', this.$auth.user);
            console.log('ユーザー名:', this.$auth.user.name);

            this.$router.push('/');
          } else {
            this.loginError = 'メールアドレスまたはパスワードが間違っています';
          }
        }
      } catch (error) {
        if (error.response.status === 401) {
          this.loginError = 'メールアドレスまたはパスワードが間違っています';
        } else {
          console.error('ログインに失敗しました', error);
        }
      }
    },
  },

};
</script>

<style scoped>
.link-btn {
  position: relative;
  display: inline-block;
  color: #3A4EFE;
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
  background: #3A4EFE;
  transform: scale(0, 1);
  transform-origin: left top;
  transition: transform 0.3s;
}

.link-btn:hover::after {
  transform: scale(1, 1);
  opacity: 0.8;
}

@media (max-width: 768px) {
  p {
    font-size: 11.5px; /* 適切なフォントサイズを指定 */
  }
}
</style>