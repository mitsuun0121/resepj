<template>
  <v-container>
    <!-- トップページへ戻る -->
    <v-tooltip
      v-if="showTooltip"
      right
      color="grey lighten-1">
      <template v-slot:activator="{ on, attrs }">
        <NuxtLink to="/">
          <v-icon
            color="primary"
            large
            class="ml-2"
            v-bind="attrs"
            v-on="on"
            >mdi-chevron-left
          </v-icon>
        </NuxtLink>
      </template>
      <span>戻る</span>
    </v-tooltip>
    
    <v-col v-if="shop">
      <v-card
        class="mx-auto"
        max-width="500"
        :height="isMobile ? '648' : ''"
        flat>
        
        <!-- 店舗画像 -->
        <v-img
          :src="shop.photo_url"
          max-height="350">
        </v-img>

        <!-- 店名 -->
        <div
          class="d-flex
          justify-space-between">
          <v-card-title
            style="font-size: clamp(1.2rem, calc(0.8vw + 0.9rem), 2rem);"
            class="font-weight-bold">{{ shop.name }}
          </v-card-title>

          <v-spacer></v-spacer>

          <!-- レビュー -->
          <v-rating
            v-model="rating"
            class="mt-5 mr-1"
            length="5"
            :size="21"
            color="info"
            background-color="grey"
            half-increments
            readonly>
          </v-rating>
        </div>
        <!-- 口コミ件数・評価値 -->
        <v-row justify="end">
          <span
            class="grey--text
            text--darken-1
            text-body-2
            mb-8
            mr-5">
            {{ totalReview }}件
            ({{ rating.toFixed(1) }})
          </span>
        </v-row>

        <!-- #エリア#ジャンル -->
        <div
          class="d-flex">
          <v-card-text
            style="color: rgb(55, 142, 250);
            font-size: clamp(0.5rem, calc(0.8vw + 0.7rem), 1.2rem);">
            #{{ area.name }} #{{ genre.name }}
          </v-card-text>
        
          <!-- お気に入り ログインユーザー -->
          <template v-if="$auth.loggedIn">
            <v-tooltip
              left
              :color="isFavorite(shop.id) ? 'red accent-2' : 'grey lighten-1'">
              <template v-slot:activator="{ on, attrs }">
                <v-icon
                  :color="isFavorite(shop.id) ? 'red accent-1' : 'grey lighten-2'"
                  size="35"
                  class="mt-1
                  mr-3"
                  v-bind="attrs"
                  v-on="on"
                  @click="addFavorite(shop.id)"
                  >mdi-heart
                </v-icon>
              </template>
              <span v-if="isFavorite(shop.id)">
                登録済
              </span>
              <span v-else>
                未登録
              </span>
            </v-tooltip>
          </template>

          <!-- お気に入り 未ログインユーザー -->
          <template v-else>
            <NuxtLink to="/users/login">
              <v-tooltip left color="success">
                <template v-slot:activator="{ on, attrs }">
                  <v-icon
                    color="grey lighten-2"
                    size="35"
                    class="mt-1
                    mr-3"
                    v-bind="attrs"
                    v-on="on"
                    >mdi-heart
                  </v-icon>
                </template>
                <div class="text-center
                  d-flex
                  flex-column
                  mt-1
                  mb-1">
                  <span>お気に入り登録には</span>
                  <span>ログインが必要です</span>
                </div>
              </v-tooltip>
            </NuxtLink>
          </template>
        </div>

        <v-divider class="mx-4 mb-1"></v-divider>

        <!-- 店舗概要 -->
        <v-card-text
          class="font-weight-bold
          mb-n15"
          style="font-size: clamp(0.5rem, calc(0.8vw + 0.7rem), 1.4rem); letter-spacing: 0.1em; line-height: 1.4;"
          >{{ shop.description }}
        </v-card-text>

      </v-card>
    </v-col>
  </v-container>
</template>

<script>
export default {
  name: 'ShopDetailForm',
  data() {
    return {
      shop: null,
      area: "",
      genre: "",
      rating: 0,
      totalReview: 0,
      isMobile: false, // ブラウザ幅が768px以上かどうか
      favorite: [],
      shopId: [],
    };
  },

  mounted() {
    this.fetchShopDetail();
    this.fetchAreaDetail();
    this.fetchGenreDetail();
    this.fetchFavoriteData();
    this.fetchReviewData();
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
      this.showTooltip = window.innerWidth >= 768;
    },

    // お店の詳細データを取得
    async fetchShopDetail() {
      const shopId = this.$route.params.id;
      try {
        const response = await this.$axios.get(`${process.env.API_URL}/api/shop/${shopId}`);
        this.shop = response.data;

        console.log('お店の詳細データ:', this.shop);
      } catch (error) {
        console.error('ショップの詳細データの取得に失敗しました', error);
      }
    },

    // エリアのデータを取得
    async fetchAreaDetail() {
      try {
        const shopId = this.$route.params.id;
        const shopData = (await this.$axios.get(`${process.env.API_URL}/api/shop/${shopId}`)).data;
        const areaResponse = await this.$axios.get(`${process.env.API_URL}/api/area/${shopData.area_id}`);
        this.area = areaResponse.data;

      } catch (error) {
        console.error('エリアデータの取得に失敗しました', error);
      }
    },

    // ジャンルのデータを取得
    async fetchGenreDetail() {
      try {
        const shopId = this.$route.params.id;
        const shopData = (await this.$axios.get(`${process.env.API_URL}/api/shop/${shopId}`)).data;
        const genreResponse = await this.$axios.get(`${process.env.API_URL}/api/genre/${shopData.genre_id}`);
        this.genre = genreResponse.data;

      } catch (error) {
        console.error('ジャンルデータの取得に失敗しました', error);
      }
    },

    // お気に入り登録されているお店を取得
    isFavorite(shopId) {
      return this.favorite && this.favorite.shop_id === shopId;
    },

    // お気に入り登録
    async addFavorite(shopId) {
      try {
        await this.fetchFavoriteData();
        // お気に入り登録されている店舗IDの確認
        const doneFavorite = this.favorite && this.favorite.shop_id === shopId;
        // お気に入り登録されている場合は登録しない
        if (doneFavorite) {
          return;
        }
        const response = await this.$axios.post(`${process.env.API_URL}/api/favorite`, {
          // shop_idを送信
          shop_id: shopId
        });
        // 登録するお店のアイコンの色を変更
        const newFavorite = { shop_id: shopId, isFavorite: true };
        this.favorite = newFavorite;

        console.log('お気に入り登録に成功しました', response.data);
      } catch (error) {
        console.error('お気に入り登録に失敗しました', error);
      }
    },

    // お気に入り登録データを取得
    async fetchFavoriteData() {
      const shopId = this.$route.params.id;
      try {
        const response = await this.$axios.get(`${process.env.API_URL}/api/favorite/${shopId}`);
        console.log('お気に入り', response.data);
        this.favorite = response.data;
         
      } catch (error) {
        console.error('お気に入りの取得に失敗しました', error);
      }
    },

    // 評価データを取得
    async fetchReviewData() {
      const shopId = this.$route.params.id;
      try {
        const response = await this.$axios.get(`${process.env.API_URL}/api/review/${shopId}`);

        console.log(response.data);

        // 評価データがない場合は何もしない
        if (!Array.isArray(response.data) || response.data.length === 0) {
          console.log('評価がありません');
          return;
        }
        // 評価の平均値を計算
        this.totalReview = response.data.length;
        console.log('評価の数', this.totalReview);
        const totalRating = response.data.reduce((acc, curr) => acc + curr.review, 0);
        console.log('評価の合計', totalRating);
        this.rating = totalRating / this.totalReview;
        console.log('平均評価', this.rating);

      } catch (error) {
        console.error('評価データの取得に失敗しました', error);
      }
    },
  },
}
</script>

<style scoped>

.fixed {
  position: fixed;
  
}
</style>
