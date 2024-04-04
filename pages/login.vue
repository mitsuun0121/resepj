<template>
  <v-container>
    <v-card class="mx-auto mt-5 pb-2 rounded-xl"  max-width="400">
      <v-toolbar color="success" dark flat>
        <v-toolbar-title
          style="margin: 0 auto;
          letter-spacing: 0.2em;">
          Login
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
                    label="Email"
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
                    label="Password"
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
                <div class="text-center mt-2 pb-1">
                  <!-- class="text-noneは英語の頭文字以降を小文字にする" -->
                  <v-btn
                    type="submit"
                    class="text-none text-h6"
                    color="success"
                    rounded valiant="flat"
                    width="150"
                    height="50">
                    Login
                  </v-btn>
                </div>
              </v-col>
            </v-row>
          </v-form>
        </ValidationObserver>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import { ValidationObserver, ValidationProvider } from 'vee-validate';

export default {
  name: 'LoginForm',
  layout: 'dashboard',
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
          // 管理者と店舗代表者のリストを取得
          const [responseAdmin, responseOwner] = await Promise.all([
            this.$axios.get(`${process.env.API_URL}/api/admin/`),
            this.$axios.get(`${process.env.API_URL}/api/owner/`)
          ]);
      
          const adminList = responseAdmin.data;
          const ownerList = responseOwner.data;

          // 管理者と店舗代表者のどちらか
          const isAdmin = adminList.some(admin => admin.email === this.email);
          const isOwner = ownerList.some(owner => owner.email === this.email);

          if (isAdmin) {
            // 管理者としてログイン
            await this.$auth.loginWith('laravelAdmin', {
              data: {
                email: this.email,
                password: this.password,
              },
              headers: {
                'Content-Type': 'application/json',
              },
            });
            console.log('Login successful as laravelAdmin');
            console.log('ログインに成功しました', this.$auth.loggedIn);
            console.log('ユーザー情報:', this.$auth.user);
            console.log('ユーザー名:', this.$auth.user.name);

            this.$router.push('/admins/management');

          } else if (isOwner) {
            // 店舗代表者としてログイン
            await this.$auth.loginWith('laravelOwner', {
              data: {
                email: this.email,
                password: this.password,
              },
              headers: {
                'Content-Type': 'application/json',
              },
            });
            console.log('Login successful as laravelOwner');
            console.log('ログインに成功しました', this.$auth.loggedIn);
            console.log('ユーザー情報:', this.$auth.user);
            console.log('ユーザー名:', this.$auth.user.name);

            this.$router.push('/owners/management');
          }
          else {
            console.log('管理者 or 店舗代表者');
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
