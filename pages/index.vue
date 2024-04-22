<template>
  <v-container>
    <v-row justify="center" align="center">
      <v-col cols="12" sm="8" md="6">
        <h1 
          style="font-size: clamp(1rem, calc(0.7vw + 0.8rem), 2.8rem);
          margin-bottom: 5px;">
          {{ displayTitle }}
        </h1>

        <v-divider></v-divider>
        <div
          v-if="shopsCounted"
          class="mt-4">
          <p>該当一覧 : <span style="color: red;">
            {{ shopCount }}</span> 件
          </p>
        </div>
        <v-divider></v-divider>

        <v-card class="py-4 d-flex" elevation="0">
          <!-- エリアセレクトメニュー -->
          <v-menu open-on-hover offset-y>
            <template v-slot:activator="{ on }">
                <v-btn
                class="mr-4"
                text v-on="on"
                outlined>エリア
                <v-icon>mdi-menu-down</v-icon>
              </v-btn>
            </template>
            <v-list class="py-1 text-caption">
              <v-list-item @click="searchByArea('東京都')">東京都</v-list-item>
              <v-list-item @click="searchByArea('大阪府')">大阪府</v-list-item>
              <v-list-item @click="searchByArea('福岡県')">福岡県</v-list-item>
            </v-list>
          </v-menu>

          <!-- ジャンルセレクトメニュー -->
          <v-menu open-on-hover offset-y>
            <template v-slot:activator="{ on }">
              <v-btn
                class="mr-4 px-2"
                text
                v-on="on"
                outlined>ジャンル
                <v-icon>mdi-menu-down</v-icon>
              </v-btn>
            </template>
            <v-list class="py-1 text-caption">
              <v-list-item @click="searchByGenre('寿司')">寿司</v-list-item>
              <v-list-item @click="searchByGenre('焼肉')">焼肉</v-list-item>
              <v-list-item @click="searchByGenre('居酒屋')">居酒屋</v-list-item>
              <v-list-item @click="searchByGenre('イタリアン')">イタリアン</v-list-item>
              <v-list-item @click="searchByGenre('ラーメン')">ラーメン</v-list-item>
            </v-list>
          </v-menu>
        </v-card>

        <v-card class="py-4" elevation="0">
          <!-- 検索バー -->
          <v-sheet class="d-flex">
            <v-text-field
              class="mr-1"
              v-model="searchWord"
              @keyup.enter="searchByWord"
              label="キーワードで探す"
              hint="ワードとワードの間に全角スペースを入力"
              persistent-hint
              dense
              outlined
              clearable
              prepend-inner-icon="mdi-magnify"
            ></v-text-field>
            <v-btn
              color="primary" 
              height="39" 
              @click="searchByWord">
              <v-icon>mdi-magnify</v-icon>
            </v-btn>
          </v-sheet>
        </v-card>

        <v-card class="py-4 d-flex" elevation="0">
          <!-- お店の並べ替え -->
          <v-menu open-on-hover offset-y>
            <template v-slot:activator="{ on }">
                <v-btn
                class="mr-4"
                text v-on="on"
                outlined>
                {{ selectedSortText }}
                <v-icon>mdi-menu-down</v-icon>
              </v-btn>
            </template>
            <v-list class="py-1 text-caption">
              <v-list-item @click="sortByRandom">ランダム</v-list-item>
              <v-list-item @click="sortByHighRating">評価が高い順</v-list-item>
              <v-list-item @click="sortByLowRating">評価が低い順</v-list-item>
            </v-list>
          </v-menu>
        </v-card>
      </v-col>
    </v-row>
    
    <!-- お店の一覧を表示 -->
    <v-row justify="start" align="center">
      <v-col v-for="shop in shops" :key="shop.id" cols="6" sm="6" md="4" lg="3">
        <v-card
          class="mx-auto"
          min-width="150"
          outlined 
          elevation="4">

          <!-- お店の詳細ページへ -->
          <NuxtLink
            :to="'/shop/' + shop.id">
            <v-img
              class="shop-photo"
              :src="shop.photo_url"
              min-height="80">
            </v-img>
          </NuxtLink>

          <div class="d-flex justify-space-between">
            <!-- 店名 お気に入り -->
            <v-card-title
              style="font-size: clamp(0.7rem, calc(0.7vw + 0.6rem), 1.5rem);"
              class="font-weight-bold"
              >{{ shop.name }}
            </v-card-title>

            <!-- ログインユーザー -->
            <template v-if="$auth.loggedIn">
              <v-tooltip
                bottom
                :color="isFavorite(shop.id) ? 'red accent-2' : 'grey lighten-1'">
                <template v-slot:activator="{ on, attrs }">
                  <v-icon
                    :color="isFavorite(shop.id) ? 'red accent-1' : 'grey lighten-2'"
                    size="28"
                    class="mr-3"
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

            <!-- 未ログインユーザー -->
            <template v-else>
              <NuxtLink to="/users/login">
                <v-tooltip bottom color="success">
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon
                      color="grey lighten-2"
                      size="28"
                      class="mt-4 mr-3"
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
          
          <!-- 評価 -->
          <v-rating
            v-model="shop.averageRating"
            class="mb-1 ml-3"
            length="5"
            :size="20"
            color="info"
            background-color="grey"
            half-increments
            readonly
          ></v-rating>
          
          <!-- #エリア#ジャンル -->
          <v-card-text
            class="mt-n2"
            style="color: rgb(55, 142, 250);
            font-size: clamp(0.5rem, calc(0.6vw + 0.6rem), 1rem);">#{{ getAreaName(shop.area_id) }} #{{ getGenreName(shop.genre_id) }}
          </v-card-text>
        </v-card>
      </v-col>

      <!-- 検索結果メッセージ -->
      <v-row justify="center">
        <v-col cols="12" sm="12" md="12" lg="12">
          <v-card
            align="center"
            class="mt-3
            pt-15
            pb-15"
            elevation="0"
            v-if="shops.length === 0">
            <p 
              style="font-size: clamp(1rem, calc(0.7vw + 0.8rem), 2.8rem);
              font-weight: bold;
              color: rgb(127, 127, 127);">
              ※該当するお店が見つかりませんでした。
            </p>
            <v-btn
              @click="fetchShopData()"
              class="mt-8 px-4"
              color="primary"
              :rounded="true"
              height="45" >
              トップページへ戻る
            </v-btn>
          </v-card>
        </v-col>
      </v-row>
    </v-row>
  </v-container>
</template>

<script>
import _ from 'underscore';
export default {
  name: 'IndexPage',
  data() {
    return {
      searchWord: '', // 検索ワード
      searchResult: '', // 検索結果のトップメッセージ
      shops: [],
      areas: [],
      genres: [],
      favorites: [],
      shopId: [],
      shops: false, // shops関連の初期表示
      shopsCounted: false, // ショップ件数の初期表示
      selectedSort: '並び替え',
    };
  },

  computed: {
    // トップメッセージの表示切り替え
    displayTitle() {
      return  this.searchResult || 'Reseグループお店一覧';
    },
    // 取得したショップデータの件数
    shopCount() {
      return this.shops.length;
    },
    // 選択されたテキストを表示
    selectedSortText() {
      switch (this.selectedSort) {
        case 'ランダム':
            return 'ランダム';
        case '評価が高い順':
            return '評価が高い順';
        case '評価が低い順':
            return '評価が低い順';
        default:
            return '並び替え';
      }
    },
  },
  
  async mounted() {
    await this.fetchShopData();
    this.fetchAreaData();
    this.fetchGenreData();
    this.fetchFavoriteData();
    this.fetchReviewData();
  },
  
  methods: {
    // 店名、エリア、ジャンルでワード検索
    async searchByWord() {

      // 検索ワードが空の場合'Reseグループお店一覧のまま'
      if (!this.searchWord) {
        return;
      }
      try {
        const response = await this.$axios.get(`${process.env.API_URL}/api/shop`, {
          params: {
            search: this.searchWord
          }
        });
        // 検索結果一覧を表示
        this.searchResult = '「' + this.searchWord + '」' + ' の検索結果一覧';
        this.shops = response.data;

        // レビューデータを取得
        await this.fetchReviewData();

        // 検索フィールドをクリア
        this.searchWord = '';

      } catch (error) {
        console.error('検索に失敗しました', error);
      }
    },

    // エリアで検索
    async searchByArea(area) {
      try {
        const response = await this.$axios.get(`${process.env.API_URL}/api/shop`, {
          params: {
            search: area
          }
        });
        // 検索結果一覧を表示
        this.searchResult = '「' + area + '」' + ' の検索結果一覧';
        this.shops = response.data;

        // レビューデータを取得
        await this.fetchReviewData();

      } catch (error) {
        console.error('検索に失敗しました', error);
      }
    },

    // ジャンルで検索
    async searchByGenre(genre) {
      try {
        const response = await this.$axios.get(`${process.env.API_URL}/api/shop`, {
          params: {
            search: genre
          }
        });
        // 検索結果一覧を表示
        this.searchResult = '「' + genre + '」' + ' の検索結果一覧';
        this.shops = response.data;

        // 評価データを取得
        await this.fetchReviewData();
        
      } catch (error) {
        console.error('検索に失敗しました', error);
      }
    },

    // お店のデータを取得
    async fetchShopData() {
      try {
        const response = await this.$axios.get(`${process.env.API_URL}/api/shop`);
        this.shops = response.data;

        // トップメッセージを表示
        this.searchResult = '';
        // ショップ件数を表示
        this.shopsCounted = true;

      } catch (error) {
        console.error('ショップデータの取得に失敗しました', error);
      }
    },

    // エリアのデータを取得
    async fetchAreaData() {
      try {
        const response = await this.$axios.get(`${process.env.API_URL}/api/area`);
        this.areas = response.data;

      } catch (error) {
        console.error('エリアデータの取得に失敗しました', error);
      }
    },

    // area_idをエリア名に変換
    getAreaName(areaId) {
      const area = this.areas.find(a => a.id === areaId);
      return area ? area.name : '';
    },

    // ジャンルのデータを取得
    async fetchGenreData() {
      try {
        const response = await this.$axios.get(`${process.env.API_URL}/api/genre`);
        this.genres = response.data;

      } catch (error) {
        console.error('ジャンルデータの取得に失敗しました', error);
      }
    },

    // genre_idをジャンル名に変換
    getGenreName(genreId) {
      const genre = this.genres.find(g => g.id === genreId);
      return genre ? genre.name : '';
    },

    // お気に入り登録されているお店を取得
    isFavorite(shopId) {
      return this.favorites.some(favorite => favorite.shop_id === shopId);
    },

    // お気に入り登録
    async addFavorite(shopId) {
      try {
        await this.fetchFavoriteData();
        // お気に入り登録されている店舗IDの確認
        const doneFavorite = this.favorites.some(favorite => favorite.shop_id === shopId);
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
        this.favorites.push(newFavorite);

        console.log('お気に入り登録に成功しました', response.data);
      } catch (error) {
        console.error('お気に入り登録に失敗しました', error);
      }
    },

    // お気に入り登録データを取得
    async fetchFavoriteData() {
      try {
        const response = await this.$axios.get(`${process.env.API_URL}/api/favorite`);
        console.log('お気に入り登録済', response.data);
        this.favorites = response.data;
         
      } catch (error) {
        console.error('お気に入りの取得に失敗しました', error);
      }
    },

    // 評価データを取得
    async fetchReviewData() {
      try {
        const response = await this.$axios.get(`${process.env.API_URL}/api/review`);

        console.log('評価データ', response.data);
        // 評価データがない場合は何もしない
        if (response.data.length === 0) {
          console.log('評価がありません');
          return;
        }
        // 店舗ごとのレビューデータを格納するためのオブジェクト
        const shopReview = {};
        
        // 評価データを店舗ごとに分ける
        for (const key in response.data) {
          if (response.data.hasOwnProperty(key)) {
            const review = response.data[key];
            const shopId = review.shop_id;
            if (!shopReview[shopId]) {
              shopReview[shopId] = [];
            }
            shopReview[shopId].push(review);
          }
        }
        // 各店舗ごとの評価データの処理
        for (const shopId in shopReview) {
          if (shopReview.hasOwnProperty(shopId)) {
            const totalReview = shopReview[shopId];
            console.log(`店舗ID ${shopId} の評価データ:`, totalReview);
            
            // 各店舗の平均評価
            const totalRating = totalReview.reduce((acc, curr) => acc + curr.review, 0);
            const averageRating = totalRating / totalReview.length;
            console.log(`店舗ID ${shopId} の平均評価:`, averageRating);
            
            // shops配列に平均評価を追加
            const shopIndex = this.shops.findIndex(shop => shop.id === parseInt(shopId));

            console.log('shopsの値:', this.shops);
            if (shopIndex !== -1) {
              this.$set(this.shops[shopIndex], 'averageRating', averageRating);
            }
          }
        }
      } catch (error) {
        console.error('評価データの取得に失敗しました', error);
      }
    },

    // Underscore.jsを使用して並び替えを実装

    // ランダムな並べ替え
    sortByRandom() {
      this.selectedSort = 'ランダム';
      this.shops = _.shuffle(this.shops);
      console.log("sortByRandom:", this.shops);
    },

    // 評価が高い順に並べ替え
    sortByHighRating() {
      this.selectedSort = '評価が高い順';
      this.shops = _.sortBy(this.shops, (shop) => {
        
        return shop.averageRating ? -shop.averageRating : Number.POSITIVE_INFINITY;

      });
      console.log("sortByHighRating:", this.shops);
    },

    // 評価が低い順に並べ替え
    sortByLowRating() {
      this.selectedSort = '評価が低い順';
      this.shops = _.sortBy(this.shops, (shop) => {
        
        return shop.averageRating || Number.POSITIVE_INFINITY;

      });
      console.log("sortByLowRating:", this.shops);
    },
  },
}
</script>

<style scoped>
.shop-photo {
  transition: 0.6s;
}

.shop-photo:hover {
  opacity: 0.7;
}
</style>
