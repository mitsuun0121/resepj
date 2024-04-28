<template>
  <div class="mt-n8" fluid>
    <v-card
      class="d-flex
      flex-column
      mx-auto
      py-8"
      elevation="0"
      :height="cardHeight"
      :width="cardWidth">

      <v-row justify="center">
      <!-- Rating overview -->
        <v-col cols="12" sm="12" md="6">
          <div class="d-flex
            justify-center
            mt-10
            text-h5">
            Rating overview
          </div>

          <div class="d-flex
            align-center
            flex-column
            my-auto">
            <div class="text-h2 mt-5">
              {{ this.rating.toFixed(1) }}
              <span class="text-h6 ml-n3">/5</span>
            </div>

            <v-rating
              v-model="this.rating"
              color="info"
              background-color="grey"
              readonly
              half-increments
            ></v-rating>
            <div class="text-h6
              pt-3">
              {{ totalReview }} 件
            </div>
          </div>
        </v-col>

        <!-- Review cards -->
        <v-col cols="12" sm="12" md="6">
          <v-list
            bg-color="transparent"
            class="d-flex
            flex-column-reverse"
            density="compact">

            <v-list-item v-for="(rating, i) in 5" :key="i">
              <span>
                {{ rating }}
              </span>
              <v-icon
                :color="reviewCounts[rating] ? 'info' : 'grey'" class="mx-3">
                mdi-star
              </v-icon>

              <v-progress-linear
                :value="reviewCounts[rating] ? reviewCounts[rating] : 0"
                class="mr-5"
                color="info"
                height="20"
                rounded>
              </v-progress-linear>
              
              <div class="rating-values">
                <span class="d-flex
                  justify-end
                  ml-5">
                  {{ reviewCounts[rating] ? reviewCounts[rating] : 0 }}
                </span>
              </div>
              
            </v-list-item>
          </v-list>
        </v-col>
      </v-row>
      <v-divider></v-divider>

      <!-- 評価の並べ替え -->
      <v-row justify="start" align="end">
        <v-menu open-on-hover offset-y>
          <template v-slot:activator="{ on }">
              <v-btn
              class="mt-3
              ml-3"
              text v-on="on">
              {{ selectedSortText }}
              <v-icon>mdi-menu-down</v-icon>
            </v-btn>
          </template>
          <v-list class="py-1 text-caption">
            <v-list-item @click="sortByNewReview">投稿日が新しい順</v-list-item>
            <v-list-item @click="sortByHighRating">評価が高い順</v-list-item>
            <v-list-item @click="sortByLowRating">評価が低い順</v-list-item>
          </v-list>
        </v-menu>
      </v-row>
    </v-card>
    
    <!-- 口コミを表示 -->
    <v-card
      v-for="review in reviews" :key="review.id"
      max-width="600"
      elevation="0"
      class="mx-auto
      pr-2
      pl-2
      mb-3">

      <!-- 投稿日 -->
      <v-card-text class="mb-n10">
        {{ formatDate(review.updated_at) }}
      </v-card-text>

      <!-- 評価 -->
      <v-row align="center">
        <v-col cols="6">
          <v-rating
            v-model="review.review"
            class="mt-16
            ml-2"
            length="5"
            :size="ratingSize"
            color="info"
            background-color="grey"
            half-increments
            readonly>
          </v-rating>
        </v-col>

        <!-- 画像 -->
        <v-col cols="6">
          <v-img
            v-if="review.image"
            :src="getImageUrl(review.image)"
            max-width="200"
            class="mt-5 ml-6">
          </v-img>
        </v-col>
      </v-row>

      <!-- タイトル -->
      <v-card-title
        class="text-body-1">
        {{ review.title }}
      </v-card-title>

      <!-- コメント -->
      <v-card-text>
        {{ review.comment }}
      </v-card-text>

    <v-divider></v-divider>
    </v-card>
  </div>
</template>

<script>
export default {
  name: 'ReviewForm',
  data() {
    return {
      shop: null,
      reviews: [],
      rating: 1,
      review: 0,
      totalReview: 0,
      reviewCounts: {},
      shopId: [],
      ratingSize: 20, // 初期値を設定
      cardHeight: 350,
      cardWidth: 800,
      selectedSort: '投稿日が新しい順',
    }
  },

  computed: {
    // 選択されたテキストを表示
    selectedSortText() {
      switch (this.selectedSort) {
        case '投稿日が新しい順':
            return '投稿日が新しい順';
        case '評価が高い順':
            return '評価が高い順';
        case '評価が低い順':
            return '評価が低い順';
        default:
            return '投稿日が新しい順';
      }
    },
  },
  mounted() {
    this.fetchReviewData();
  },
  
  created() {
    // ratingの初期サイズを設定
    this.setRatingSize();
    window.addEventListener('resize', this.setRatingSize);

    // cardHeightの初期サイズを設定
    this.setCardHeightSize();
    window.addEventListener('resize', this.setCardHeightSize);

    // cardWidthの初期サイズを設定
    this.setCardWidthSize();
    window.addEventListener('resize', this.setCardWidthSize);
  },

  destroyed() {
    // ブラウザの幅に応じてratingのサイズを変更
    window.removeEventListener('resize', this.setRatingSize);

    // ブラウザの幅に応じてcardHeightのサイズを変更
    window.removeEventListener('resize', this.setCardHeightSize);

    // ブラウザの幅に応じてcardWidthのサイズを変更
    window.removeEventListener('resize', this.setCardWidthSize);
  },

  methods: {
    // 評価データを取得
    async fetchReviewData() {
      const shopId = this.$route.params.id;
      try {
        const response = await this.$axios.get(`${process.env.API_URL}/api/review/${shopId}`);

        // 評価データがない場合は何もしない
        if (!Array.isArray(response.data) || response.data.length === 0) {
          console.log('評価がありません');
          return;
        }
        
        // 評価データを取得
        this.reviews = response.data;

        // 評価を投稿日が新しい順に並べ替える
        this.reviews.sort((a, b) => {
          const dateA = new Date(a.updated_at);
          const dateB = new Date(b.updated_at);
          return dateB - dateA;
        });

        // 口コミの数をカウント
        this.reviewCounts = {};
        response.data.forEach(review => {
          const rating = review.review;
          if (!this.reviewCounts[rating]) {
            this.reviewCounts[rating] = 1;
          } else {
            this.reviewCounts[rating]++;
          }
        });

        // 評価の平均値を計算
        this.totalReview = response.data.length;
        const totalRating = response.data.reduce((acc, curr) => acc + curr.review, 0);
        this.rating = totalRating / this.totalReview;

        console.log('評価', this.reviews);
        console.log('評価の数', this.totalReview);
        console.log('評価の合計', totalRating);
        console.log('平均評価', this.rating);

      } catch (error) {
        console.error('評価データの取得に失敗しました', error);
      }
    },

    // 口コミ投稿日の日付のフォーマット
    formatDate(dateString) {
      const options = { year: 'numeric', month: 'short', day: 'numeric' };
      const date = new Date(dateString);
      return date.toLocaleDateString('ja-JP', options);
    },

    // 画像のURLを生成
    getImageUrl(imagePath) {
      return `http://localhost/${imagePath}`;
    },

    // ブラウザの幅に応じてratingのサイズを変更
    setRatingSize() {
      const screenWidth = window.innerWidth;
      if (screenWidth < 600) {
        this.ratingSize = 20;
      } else {
        this.ratingSize = 30;
      }
    },

    // ブラウザの幅に応じてcardHeightのサイズを変更
    setCardHeightSize() {
      const screenWidth = window.innerWidth;
      if (screenWidth < 960) {
        this.cardHeight = 600;
      } else {
        this.cardHeight = 350;
      }
    },

    // ブラウザの幅に応じてcardWidthのサイズを変更
    setCardWidthSize() {
      const screenWidth = window.innerWidth;
      if (screenWidth < 960) {
        this.cardWidth = 400;
      } else {
        this.cardWidth = 800;
      }
    },

    // 投稿日が新しい順に並べ替え
    sortByNewReview() {
      this.selectedSort = '投稿日が新しい順';
      this.reviews.sort((a, b) => {
        const dateA = new Date(a.updated_at);
        const dateB = new Date(b.updated_at);
        return dateB - dateA;
      });
      console.log("sortByNeeReview:", this.reviews);
    },

    // 評価が高い順に並べ替え
    sortByHighRating() {
      this.selectedSort = '評価が高い順';
      this.reviews.sort((a, b) => {
        return b.review - a.review;
      });
      console.log("sortByHighRating:", this.reviews);
    },

    // 評価が低い順に並べ替え
    sortByLowRating() {
      this.selectedSort = '評価が低い順';
      this.reviews.sort((a, b) => {
        return a.review - b.review;
      });
      console.log("sortByLowRating:", this.reviews);
    },
  },
}
</script>

<style scoped>
.rating-values {
   width: 25px;
}
</style>