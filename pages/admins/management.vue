<template>
  <v-container>

    <!-- Snackbar コンポーネントを表示 -->
    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      :timeout="snackbar.timeout"
      bottom>
      <div
        class="text-center
        text-body-1
        font-weight-bold">
        {{ snackbar.message }}
      </div>
    </v-snackbar>

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
          Register
        </v-toolbar-title>
      </v-toolbar>
      <v-card-text>
        <ValidationObserver ref="registerserver">
          <v-form @submit.prevent="ownerRegister">
            <!-- 店舗ID入力 -->
            <v-row>
              <v-col cols="12">
                <ValidationProvider
                  rules="required"
                  v-slot="{ errors }"
                  name="店舗ID">
                  <v-text-field
                    class="pt-2"
                    prepend-icon="mdi-home-account"
                    v-model="shop_id"
                    name="店舗ID"
                    label="Shop"
                    :error-messages="errors"
                    hint="責任者に割り当てる店舗IDを入力"
                    persistent-hint
                    required>
                  </v-text-field>
                </ValidationProvider>
              </v-col>
            </v-row>
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
                    label="Name"
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
                    :type="showPassword ? 'text' : 'password'"
                    v-model="password"
                    name="パスワード"
                    label="Password"
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

            <!-- 店舗責任者登録ボタン -->
            <v-row>
              <v-col cols="12">
                <div class="text-center mt-2 pb-1">
                  <!-- class="text-noneは英語の頭文字以降を小文字にする" -->
                  <v-btn
                    @click="ownerRegister()"
                    class="text-none text-h6"
                    color="secondary"
                    rounded
                    valiant="flat"
                    width="150"
                    height="50">
                    Register
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
import { ValidationObserver } from 'vee-validate';

export default {
  name: 'RegisterForm',
  layout: 'dashboard',
  components: { ValidationObserver },
    
  data() {
    return {
      showPassword: false,
      shop_id: '',
      name: '',
      email: '',
      password: '',

      // スナックバー
      snackbar: {
        show: false,
        message: '',
        color: 'primary', // デフォルトの色
        timeout: 3000,
      },
    }
  },

  methods: {
    // snackbar
    showSnackbar({ message, color }) {
      this.snackbar.message = message;
      this.snackbar.color = color || 'primary'; // デフォルトの色
      this.snackbar.show = true;
    },

    // フォームリセット
    resetForm() {
      this.shop_id = '';
      this.name = '';
      this.email = '';
      this.password = '';
      this.$refs.registerserver.reset();
    },

    // フォームのバリデーションを実行するメソッド
    async validateForm() {
        return this.$refs.registerserver.validate();
    },

    // 店舗代表者を登録
    async ownerRegister() {
      try {
        if (await this.validateForm()) {
          const response = await this.$axios.post(`${process.env.API_URL}/api/auth/owner/register`, {
            shop_id: this.shop_id,
            name: this.name,
            email: this.email,
            password: this.password
          });

          this.resetForm();

          console.log('店舗代表者が登録されました。', response.data);

          this.showSnackbar({ message: '店舗代表者が登録されました', color: 'primary' });
        }
      } catch (error) {
        console.error('登録に失敗しました', error);
      }
    },
  },
};
</script>
