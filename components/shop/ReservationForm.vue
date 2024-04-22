<template>
  <v-container>
    <v-card
      class="mx-auto"
      width="500"
      flat> 
      <v-sheet
        height="50"
        color="primary"
        class="d-flex">
        <!-- タイトル -->
        <v-icon
          right
          color="white"
          class="pl-1"
        >
        mdi-calendar-month-outline
        </v-icon>
        <div
          style="font-size: clamp(1.35rem, calc(0.8vw + 0.9rem), 2rem);
          color: #FFFFFF;"
          class="font-weight-bold
          mt-2
          ml-3"
          >予約
        </div>
      </v-sheet>
        
      <!-- カレンダーを表示 -->
        <v-date-picker
          v-model="selectedDate"
          :show-adjacent-months="true"
          color="primary"
          :day-format="date => new Date(date).getDate()"
          :min="minDate"
          no-title
          full-width
          @click:date="openDialog">          
        </v-date-picker>

      <p
        v-if="$auth.loggedIn"
        class="red--text
        font-weight-bold
        mt-3
        mb-10
        ml-5"
        style="font-size: clamp(0.6rem, calc(0.6vw + 0.7rem), 1.2rem);">※カレンダーから予約日を選んで下さい。
      </p>

      <!-- 未ログインユーザーはログインページへ -->
      <div
        v-if="!$auth.loggedIn"
        class="text-center
        mt-3
        mb-12">
        <NuxtLink
          style="font-size: clamp(1rem, calc(0.8vw + 0.9rem), 1.4rem);"
          class="login-btn"
          to="/users/login">
          ご予約の際はログインが必要です
        </NuxtLink>
      </div>

      <!-- 口コミを表示 -->
      <template>
        <v-card
          v-for="review in reviews" :key="review.id"
          class="pr-5
          pl-2
          mb-3"
          outlined>
          <v-row align="center" >
            <v-col cols="6">
              <v-rating
                v-model="review.review"
                class="mt-16
                ml-3"
                length="5"
                :size="ratingSize"
                color="info"
                background-color="grey"
                half-increments
                readonly>
              </v-rating>
            </v-col>

            <v-col cols="6">
              <v-img
                v-if="review.image"
                :src="getImageUrl(review.image)"
                max-width="200"
                class="mt-5">
              </v-img>
            </v-col>
          </v-row>

          <v-card-title
            class="text-body-1">
            {{ review.title }}
          </v-card-title>

          <v-card-text>
            {{ review.comment }}
          </v-card-text>
        
        </v-card>
      </template>

      <!-- 予約ダイアログ -->
      <v-dialog
        v-if="$auth.loggedIn"
        v-model="reservationDialog"
        width="500">
        <v-card>
          <div class="d-flex justify-end">
          <v-icon class="mr-1" @click="closeDialog">mdi-close</v-icon>
          </div>
          <v-card-title
            class="justify-center
            text-h6
            pt-2
            pb-3">
            予約を申し込む
          </v-card-title>
          
          <v-form
            @submit.prevent="addReservation"
            ref="reservationserver"
            class="d-flex
            align-center
            flex-column">

            <!-- 予約日を選択 -->
            <v-sheet width="200" class="mt-1">
              <v-menu
                v-model="menu"
                :close-on-content-click="false"
                :nudge-right="40"
                transition="scale-transition"
                offset-y>
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-model="formattedDate"
                    label="日にち"
                    outlined
                    dense
                    readonly
                    clearable
                    required
                    :rules="dateRules"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="selectedDate"
                  color="primary"
                  :day-format="date => new Date(date).getDate()"
                  :min="minDate"
                  no-title
                  @input="menu = false">
                </v-date-picker>
              </v-menu>
            </v-sheet>

            <!-- 予約時間を選択 -->
            <v-sheet width="200" class="mt-1">
              <v-select
                v-model="time"
                label="時間"
                :items="times"
                outlined
                dense
                clearable
                required
                :rules="timeRules">
              </v-select>
            </v-sheet>

            <!-- 予約人数を選択 -->
            <v-sheet width="200" class="mt-1">
              <v-select
                v-model="count"
                label="人数"
                :items="counts"
                outlined
                dense
                clearable
                required
                :rules="countRules">
              </v-select>
            </v-sheet>

            <!-- 予約内容を確認するリスト -->
            <v-list
              width="260"
              color="primary"
              class="mt-1"
              rounded>
              <p class="text-center
                white--text
                pt-3">
                ご予約内容を確認して下さい
              </p>

              <v-list-item
                v-if="shop"
                class="text-caption
                white--text
                mb-n2">
                <v-list-item-title class="text-subtitle-2">
                  店名
                </v-list-item-title>
                <v-list-item-title>
                  {{ shop.name }}
                </v-list-item-title>
              </v-list-item>

              <v-list-item
                class="white--text
                mb-n2">
                <v-list-item-title class="text-subtitle-2">
                  予約日
                </v-list-item-title>
                <v-list-item-title>
                  {{ formattedDate }}
                </v-list-item-title>
              </v-list-item>

              <v-list-item
                class="white--text
                mb-n2">
                <v-list-item-title class="text-subtitle-2">
                  予約時間
                </v-list-item-title>
                <v-list-item-title>
                  {{ time }}
                </v-list-item-title>
              </v-list-item>

              <v-list-item
                class="white--text">
                <v-list-item-title class="text-subtitle-2">
                  予約人数
                </v-list-item-title>
                <v-list-item-title>
                  {{ count }}
                </v-list-item-title>
              </v-list-item>
            </v-list>

            <!-- 予約申し込みボタン -->
            <div
              v-if="$auth.loggedIn"
              class="tect-center">
              <v-btn
                class="text-body-1
                mt-1
                mb-7"
                type="submit"
                color="primary"
                width="260"
                height="50">
                予約する
              </v-btn>
            </div>
          </v-form>
        </v-card>
      </v-dialog>
              
    </v-card>
  </v-container>
</template>

<script>

export default {
  name: 'ShopReservationForm',
  data() {
    return {
      menu: false,
      selectedDate: null,
      formattedDate: '',
      reservationDialog: false,
      time: '',
      times: ['18:00', '19:00', '20:00'],
      count: '',
      counts: ['1人', '2人', '3人', '4人', '5人'],
      shop: null,
      reviews: [],
      review: 0,
      image: '',
      title: null,
      comment: null,
      ratingSize: 20, // 初期値を設定

      // バリデーション実装
      dateRules: [
        v => !!v || '日にちを選択して下さい',
      ],
      timeRules: [
        v => !!v || '時間を選択して下さい',
      ],
      countRules: [
        v => !!v || '人数を選択して下さい',
      ],
    };
  },

  // ratingの初期サイズを設定
  created() {
    this.setRatingSize();
    window.addEventListener('resize', this.setRatingSize);
  },

  // ratingのサイズを変更
  destroyed() {
    window.removeEventListener('resize', this.setRatingSize);
  },

  watch: {
    // v-calendarで選択した日付をv-text-fieldに表示
    selectedDate(date) {
      this.formattedDate = date;
    },
  },

  computed: {
    // v-date-picker今日以降の日付のみ選択可能
    minDate() {
      const today = new Date();
      today.setDate(today.getDate() + 1);
      return today.toISOString(); // YYYY-MM-DD形式に変換
    }
  },

  mounted() {
    this.fetchShopDetail();
    this.fetchReview();
  },

  methods: {
    // ページリセット
    resetPage() {
      this.time = '';
      this.count = '';
    },

    // ダイアログを開く
    openDialog() {
      this.reservationDialog = true;
      this.resetPage();
    },

    // ダイアログを閉じる
    closeDialog() {
      this.reservationDialog = false;
    },

    // 人数を数値に変換
    countToNumber(count) {
      console.log('countToNumber - input count:', count);
      if (count === '1人') {
        return 1;
      } else if (count === '2人') {
        return 2;
      } else if (count === '3人') {
        return 3;
      } else if (count === '4人') {
        return 4;
      } else if (count === '5人') {
        return 5;
      }
    },

    // 選択されたお店のIDを取得
    getShopId() {
      return this.$route.params.id;
    },

    // お店の詳細データを取得
    async fetchShopDetail() {

      const shopId = this.$route.params.id;
      try {
        const response = await this.$axios.get(`${process.env.API_URL}/api/shop/${shopId}`);

        this.shop = response.data;
        this.shop_id = shopId;

      } catch (error) {
        console.error('ショップの詳細データの取得に失敗しました', error);
      }
    },

    // フォームのバリデーション
    async validateForm() {
      return this.$refs.reservationserver.validate();
    },

    // 新規予約申し込み
    async addReservation() {
      try {
        // 予約日が選択されていない場合はエラーメッセージを表示
        if (!this.selectedDate) {
          this.showError = true;
        } else {
          this.showError = false;
        }
        // 人数を整数に変換
        const convertCount = this.countToNumber(this.count);
        // 選択された店舗IDを取得
        const shopId = await this.getShopId();

        if (await this.validateForm()) {
          const response = await this.$axios.post(`${process.env.API_URL}/api/reservation`, {
            date: this.selectedDate,
            time: this.time,
            count: convertCount,
            shop_id: this.shop_id,
          });

          this.$router.push("/users/done");
          console.log('予約に成功しました', response.data);
        }
        
      } catch (error) {
        console.error('予約に失敗しました', error);
      }
    },

    // ブラウザの幅に応じてratingのサイズを変更
    setRatingSize() {
      const screenWidth = window.innerWidth;
      if (screenWidth < 600) {
        this.ratingSize = 20;
      } else {
        this.ratingSize = 28;
      }
    },

    // 口コミを取得
    async fetchReview() {
      const shopId = this.$route.params.id;
      try {
        const response = await this.$axios.get(`${process.env.API_URL}/api/review/${shopId}`);

        if (response && response.data && Array.isArray(response.data)) {
          this.reviews = response.data;
          console.log(`口コミデータ:`, this.reviews);
        }
      } catch (error) {
        console.error('投稿履歴の取得に失敗しました', error)
      }
    },

    // 画像のURLを生成
    getImageUrl(imagePath) {
      return `http://localhost/${imagePath}`;
    },
  },
}
</script>

<style scoped>
.login-btn {
  color: #2E7D32;
  font-weight: bold;
  text-decoration: none;
  border: 2px solid #2E7D32;
  border-radius: 4px;
  padding: 10px 18px;
  transition: 0.7s;
}

.login-btn:hover {
  opacity: 0.6;
}
</style>