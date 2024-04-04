<template>
  <v-app light>

<!-- ブラウザ幅768px以上のヘッダーの表示 -->
    <template v-if="isMobile">
      <v-app-bar fixed app>
        
          <!-- ヘッダーロゴ -->
          <v-toolbar-title style="margin-top: 15px;">
            <img src="~assets/img/logo.jpg" alt="ロゴ" style="width: 125px;">
          </v-toolbar-title>

          <v-spacer />

          <!-- マイページメニュー -->
          <v-menu
            v-if="$route.path !== '/login'"
            open-on-hover offset-y>
            <template v-slot:activator="{ on }">
              <v-btn v-if="$auth.loggedIn"
                class="ml-1 px-3" 
                text v-on="on"
                outlined>
                <span class="text-caption">{{ $auth.user.name }}　さん</span>
                <v-icon v-if="$auth.loggedIn">mdi-menu-down</v-icon>
              </v-btn>
            </template>

            <!-- ログイン時は表示する -->
            <v-list
              v-if="$auth.loggedIn"
              class="py-1
              text-caption">

              <!-- トップページへ -->
              <v-list-item @click="logout">
              <v-icon size="20" left>mdi-logout</v-icon>ログアウト
              </v-list-item>
            </v-list>
          </v-menu>

      </v-app-bar>
    </template>

<!-- ブラウザ幅768px以下のヘッダーの表示 -->  
    <template v-else>
      <v-app-bar fixed app>

        <!-- ヘッダーロゴ -->
        <v-toolbar-title style="margin-top: 15px;">
          <img src="~assets/img/logo.jpg" alt="ロゴ" style="width: 125px;">
        </v-toolbar-title>

        <v-spacer />

        <!-- マイページメニュー -->
        <v-menu v-if="$route.path !== '/login'"
          open-on-hover offset-y>
          <template v-slot:activator="{ on }">
            <v-btn v-if="$auth.loggedIn"
              class="ml-1
              px-2"
              text v-on="on"
              outlined>
              <span class="text-caption">{{ $auth.user.name }}　さん</span>
              <v-icon v-if="$auth.loggedIn">mdi-menu-down</v-icon>
            </v-btn>
          </template>

          <!-- ログイン時は表示する -->
          <v-list
            v-if="$auth.loggedIn"
              class="py-1
              text-caption">

              <!-- トップページへ -->
              <v-list-item @click="logout">
              <v-icon size="20" left>mdi-logout</v-icon>ログアウト
              </v-list-item>
            </v-list>
          </v-menu>
      </v-app-bar>
    </template>

    <v-main>
      <v-container>
        <Nuxt />
      </v-container>
    </v-main>

    <v-footer>
      <span>&copy; {{ new Date().getFullYear() }} Rese inc.</span>
    </v-footer>

  </v-app>
</template>

<script>
export default {
  name: 'Dashboard',
  data () {
    return {
      isMobile: false,
    };

  },

  computed: {
    // 無料会員登録ボタンをログイン状態に応じて表示・非表示
    userRegisterBtn() {
      return !this.$auth.loggedIn &&
        !['/users/register', '/users/confirm', '/users/login', '/users/thanks', '/users/done'].includes(this.$route.path);
    },
  },

  created() {
    // ブラウザ幅の変更をチェック
    this.checkMobile();
    window.addEventListener('resize', this.checkMobile);
  },

  // ブラウザ幅の変更内容をクリーンアップ
  destroyed() {
    window.removeEventListener('resize', this.checkMobile);
  },

  methods: {
    // 768pxでブレイクポイント
    checkMobile() {
      this.isMobile = window.innerWidth >= 768;
    },

    // ログアウト
    async logout() {
      try {
        // ローカルストレージからトークンを削除
        localStorage.removeItem('access_token');

        // フロント側でのログアウト処理
        await this.$auth.logout();

        this.$router.push("/login");
      } catch (error) {
        console.log('Logout failed:', error);
      }
    },
  }

}
</script>

<style scoped>
a {
  text-decoration: none;
  transition: 0.7s;
}

a:hover {
  opacity: 0.8;
  cursor: pointer;
}

.create-btn {
  font-size: clamp(0.8rem, calc(0.4vw + 0.5rem), 1.8rem);
  color: #ffffff;
  text-decoration: none;
  background-color: #1976D2;
  letter-spacing: 0.1em;
  padding: 7px 14px;
  border-radius: 24px;
  margin-left: 12px;
  box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.2);
}
</style>