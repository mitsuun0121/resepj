<template>
  <v-container>
    <!-- レビュー作成と削除 -->
    <v-card-title>
      <v-icon left>mdi-tooltip-text-outline</v-icon>レビュー
    </v-card-title>

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

    <v-tabs
      color="primary"
      align-tabs="center"
      >
      <v-tab @click="tab = 1">レビュー投稿</v-tab>
      <v-tab @click="tab = 2">投稿履歴</v-tab>
    </v-tabs>
    <v-divider></v-divider>

<!-- レビュー投稿 -->
    <div v-if="tab === 1">
      <v-card class="mt-3">
        <v-row justify="center">
          <v-col cols="12" sm="8" md="8" lg="8">
            <div align="center">
              <v-alert
                class="mt-3"
                width="250"
                color="primary"
                dense
                text>
                <div class="mt-1">※項目は全て必須</div>
              </v-alert>
            </div>

            <v-form ref="reviewserver">
              <v-card-text>店名</v-card-text>
              <v-select
                v-model="shopName"
                class="mt-n2"
                :items="shopNames"
                dense
                outlined
                hint="店名を選択して下さい。"
                persistent-hint
                :rules="shopNameRules"
                required
              ></v-select>
              <v-divider></v-divider>

              <v-card-text class="mt-5">評価</v-card-text>
              <v-rating
                v-model="rating"
                class="mt-n4"
                ref="rating"
                :items="5"
                :size="35"
                color="info"
                background-color="grey lighten-2"
              ></v-rating>
              <v-messages v-if="rating > 0"
                class="mb-2
                ml-3"
                :value="ratingMessage"
              ></v-messages>
              <v-messages v-else
                class="mb-2
                ml-3"
                :value="ratingMessage"
                color="error"
              ></v-messages>
              <v-divider></v-divider>

              <v-card-text class="mt-5">タイトル</v-card-text>
              <v-text-field
                v-model="title"
                class="mt-n2"
                outlined
                dense
                counter
                hint="2文字以上25文字以内で入力して下さい。"
                persistent-hint
                :rules="titleRules"
                required
              ></v-text-field>
              <v-divider></v-divider>

              <v-card-text class="mt-5">本文</v-card-text>
              <v-textarea
                v-model="comment"
                class="mt-n2"
                outlined
                auto-grow
                counter
                hint="25文字以上500文字以内で入力して下さい。"
                persistent-hint
                :rules="commentRules"
                required
              ></v-textarea>
              <v-divider></v-divider>

              <v-card-text class="mt-5">性別</v-card-text>
              <v-select
                v-model="gender"
                class="mt-n2"
                :items="genders"
                dense
                outlined
                hint="性別を選択して下さい。"
                persistent-hint
                :rules="genderRules"
                required
              ></v-select>
              <v-divider></v-divider>

              <v-card-text class="mt-5">年代</v-card-text>
              <v-select
                v-model="age"
                class="mt-n2"
                :items="ages"
                dense
                outlined
                hint="年代を選択して下さい。"
                persistent-hint
                :rules="ageRules"
                required
              ></v-select>
              <v-divider></v-divider>
            </v-form>

            <!--　投稿内容確認ボタン -->
            <div
              class="text-center
              mt-12
              pb-8">
              <v-btn
                color="primary"
                min-width="200"
                height="55"
                rounded
                class="text-body-1
                font-weight-bold"
                @click="openAddReviewDialog">
                投稿内容を確認する
              </v-btn>
            </div>
          </v-col>
        </v-row>
      </v-card>

      <!-- レビュー内容確認ボトムシート -->
      <v-bottom-sheet
        v-model="addReviewDialog" width="500">
        <v-card>
          <!-- レビュー内容を確認するリスト -->
          <v-list>
            <p class="text-center
              pt-4">
              レビュー内容
            </p>
            <v-list-item class="mb-1">
              <v-list-item-title
              class="text-subtitle-2 mr-n16">
                店名
              </v-list-item-title>
              <v-list-item-title class="ml-n16">
                {{ shopName }}
              </v-list-item-title>
            </v-list-item>

            <v-list-item class="mb-1">
              <v-list-item-title
              class="text-subtitle-2 mr-n16">
                評価
              </v-list-item-title>
              <v-list-item-title class="ml-n16">
                {{ rating }}
              </v-list-item-title>
            </v-list-item>

            <v-list-item class="mb-1">
              <v-list-item-title class="text-subtitle-2 mr-n16">
                タイトル
              </v-list-item-title>
              <v-list-item-title class="ml-n16">
                {{ title }}
              </v-list-item-title>
            </v-list-item>

            <v-list-item class="mb-1">
              <v-list-item-title class="text-subtitle-2 mr-n16">
                本文
              </v-list-item-title>
              <v-list-item-title class="ml-n16">
                {{ comment }}
              </v-list-item-title>
            </v-list-item>

            <v-list-item class="mb-1">
              <v-list-item-title class="text-subtitle-2 mr-n16">
                性別
              </v-list-item-title>
              <v-list-item-title class="ml-n16">
                {{ gender }}
              </v-list-item-title>
            </v-list-item>

            <v-list-item class="mb-1">
              <v-list-item-title class="text-subtitle-2 mr-n16">
                年代
              </v-list-item-title>
              <v-list-item-title class="ml-n16">
                {{ age }}
              </v-list-item-title>
            </v-list-item>
          </v-list>

          <!-- レビュー投稿ボタン -->
          <div
            class="d-flex justify-center">
            <v-btn
              class="text-body-1
              mt-2
              mb-7
              mr-1"
              color="primary"
              outlined
              width="182"
              height="50"
              @click="closeDialog">
              投稿画面に戻る
            </v-btn>

            <v-btn
              class="text-body-1
              mt-2
              mb-7
              ml-1"
              color="primary"
              width="182"
              height="50"
              @click="addReview">
              投稿する
            </v-btn>
          </div>
        </v-card>
      </v-bottom-sheet>
    </div>

<!-- レビュー履歴 -->
    <div v-if="tab === 2">
      <v-data-table
        fixed-header
        height="240px"
        :headers="reviewHeaders"
        :items="reviews"
        :show-no-data="false"
        hide-default-footer
        mobile-breakpoint="768"
        >
        <template v-slot:item.actions="{ item }">
          <!-- 削除ボタン -->
          <v-btn
            fab
            small
            depressed
            color="error"
            @click="openDeleteDialog(item.id)">
            <v-icon>
            mdi-delete
            </v-icon>
          </v-btn>
        </template>

        <!-- 投稿履歴がない場合 -->
        <template v-slot:no-data>
          <div
            style="color: #E0E0E0;"
            class="text-center
            text-h6
            font-weight-bold
            mt-16">
            投稿履歴はありません。
          </div>
        </template>
      </v-data-table>

      <!-- レビュー履歴削除ダイアログ -->
      <v-dialog v-model="deleteDialog" width="350">
        <v-card>
          <v-card-title
            class="text-subtitle-1">削除確認
          </v-card-title>
          <v-card-text>
            レビューを削除してもよろしいですか？
          </v-card-text>
          <v-card-actions>
            <v-btn
              @click="closeDialog"
              class="text-body-2
              font-weight-bold">キャンセル
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn
              @click="deleteReviewId"
              color="error"
              class="text-body-2
              font-weight-bold">
              OK
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </v-container>
</template>

<script>
export default {
  name: 'ReviewForm',
  data() {
    return {
      reviews: [], // レビュー情報
      pastReservations: [], // 来店済のお店
      shopNames: [], // お店の名前のリスト
      shopName: null, // 選択されたお店の名前
      rating: 0,
      title: '',
      comment: '',
      gender: null,
      age: null,
      tab: 1, // デフォルトはレビュー投稿
      addReviewDialog: false,
      deleteDialog: false,
      ratingMessage: ['評価を選択してください。'],

      genders: [
        '女性',
        '男性',
        '無回答',
      ],
      ages: [
        '10代',
        '20代',
        '30代',
        '40代',
        '50代',
        '60代',
        '70代',
        '80代',
      ],

      // スナックバー
      snackbar: {
        show: false,
        message: '',
        color: 'primary', // デフォルトの色
        timeout: 3000,
      },

      // バリデーション実装
      shopNameRules: [
        v => !!v || '店名を選択して下さい。',
      ],
      titleRules: [
        v => !!v || 'タイトルを入力して下さい。',
        v => (v && v.length >= 2) || '2文字以上で入力してください。',
        v => (v && v.length <= 25) || '25文字以下で入力してください。',
      ],
      commentRules: [
        v => !!v || '本文を入力して下さい。',
        v => (v && v.length >= 25) || '25文字以上で入力してください。',
        v => (v && v.length <= 500) || '500文字以下で入力してください。',
      ],
      genderRules: [
        v => !!v || '性別を選択して下さい。',
      ],
      ageRules: [
        v => !!v || '年代を選択して下さい。',
      ],

      // 投稿履歴テーブルのヘッダー
      reviewHeaders: [
        { text: '店名', value: 'shopName', sortable: false },
        { text: '投稿日', value: 'created_at', sortable: false },
        { text: '削除', value: 'actions', sortable: false, align: 'center' },
      ],
    }
  },

  mounted() {
    this.fetchReservation();
    this.fetchReview();
  },

  methods: {
    // snackbar
    showSnackbar({ message, color }) {
      this.snackbar.message = message;
      this.snackbar.color = color || 'primary'; // デフォルトの色
      this.snackbar.show = true;
    },

    // フォームのバリデーション
    async validateForm() {
      return this.$refs.reviewserver.validate();
    },

    // 投稿内容確認ダイアログを開く
    openAddReviewDialog() {
      this.validateForm().then(valid => {
        if (valid) {
          
          if (!this.rating) {
            // 強制的にバリデーションをトリガー
            this.$refs.rating.$emit('change', true);
            return;
          }
          this.addReviewDialog = true;
        } 
      });
    },

    // 投稿履歴削除ダイアログを開く
    openDeleteDialog(itemId) {
      this.selectedId = itemId;
      this.deleteDialog = true;
    },

    // 投稿内容確認・投稿履歴削除ダイアログを閉じる
    closeDialog() {
      this.addReviewDialog = false;
      this.deleteDialog = false;
    },

    // 性別を数値に変換
    genderToNumber(gender) {
      console.log('genderToNumber:', gender);
      if (gender === '男性') {
        return 1;
      } else if (gender === '女性') {
        return 2;
      } else if (gender === '無回答') {
        return 3;
      } 
    },

    // 年代を数値に変換
    ageToNumber(age) {
      console.log('ageToNumber:', age);
      if (age === ' 10代') {
        return 1;
      } else if (age === '20代') {
        return 2;
      } else if (age === '30代') {
        return 3;
      } else if (age === '40代') {
        return 4;
      } else if (age === '50代') {
        return 5;
      } else if (age === '60代') {
        return 7;
      } else if (age === '70代') {
        return 7;
      } else if (age === '80代') {
        return 8;
      } 
    },

    // フォームリセット
    resetForm() {
      this.shopName = null;
      this.rating = 0;
      this.title = '';
      this.comment = '';
      this.gender = null;
      this.age = null;
      this.$refs.reviewserver.reset();
    },

    // レビュー投稿
    async addReview() {
      try {
        // 選択されたお店のIDを取得
        const selectedShop = this.shopNames.indexOf(this.shopName);
        const shopId = this.shopIds[selectedShop];
        // 性別を整数に変換
        const convertGender = this.genderToNumber(this.gender);
        // 年代を整数に変換
        const convertage = this.ageToNumber(this.age);

        const response = await this.$axios.post(`${process.env.API_URL}/api/review`, {
          shop_id: shopId,
          review: this.rating,
          title: this.title,
          comment: this.comment,
          gender: convertGender,
          age: convertage,
        });

        this.fetchReview();
        this.closeDialog();
        this.resetForm();

        console.log('レビューを投稿しました', response.data);

      } catch (error) {
        console.error('レビューの投稿に失敗しました', error);
      }
    },

    // レビュー履歴を取得
    async fetchReview() {
      try {
        const response = await this.$axios.get(`${process.env.API_URL}/api/review`);

        if (response && response.data && Array.isArray(response.data)) {
          // ログイン中のユーザーのID
          const loginUser = this.$auth.user.id;
          
          this.reviews = response.data;
          console.log('レビューデータ:', this.reviews);
          // ログインユーザーのレビューデータのみを抽出
          const userReviews = this.reviews.filter(review => review.user_id === loginUser);
          console.log('ユーザーID:', loginUser);
          console.log('抽出されたレビューデータ:', userReviews);
          
          // 店名・投稿日をフォーマット
          userReviews.forEach(userReview => {
            userReview.created_at = this.formatDate(userReview.created_at);
            userReview.shopName = userReview.shop.name;
          });
          // ログインユーザーのレビューデータのみを表示
          this.reviews = userReviews;
        }
      } catch (error) {
        console.error('レビュー履歴の取得に失敗しました', error)
      }
    },

    // 投稿履歴削除処理を実行
    deleteReviewId() {
      this.deleteReview(this.selectedId);
      this.deleteDialog = false;
    },

    // レビューを削除する
    async deleteReview(id) {
      try {
        const response = await this.$axios.delete(`${process.env.API_URL}/api/review/${id}`);

        console.log('レビュー履歴が削除されました', response.data);

        this.showSnackbar({ message: 'レビュー履歴が削除されました', color: 'error' });

        this.fetchReview();

      } catch (error) {
        console.error('レビュー履歴の削除に失敗しました', error);        
      }
    },

    // 日付を "YYYY-MM-DD" 形式に変換
    formatDate(dateString) {
      const date = new Date(dateString);
      const formatDate = date.toISOString().split('T')[0];
      return formatDate;
    },

    // 予約履歴を取得
    async fetchReservation() {
      try {
        const response = await this.$axios.get(`${process.env.API_URL}/api/reservation`);

        if (response && response.data && Array.isArray(response.data)) {

          console.log('予約データ:', response.data);
          // 日時順に予約データをソート
          this.reservations = response.data.sort((a, b) => {
            const dateA = new Date(a.date + 'T' + a.time);
            const dateB = new Date(b.date + 'T' + b.time);
            return dateA - dateB;
          });
          
          // 現在の日時を取得
          const today = new Date();
          today.setHours(0, 0, 0, 0); // 時間は考慮しない
          console.log(today);
          
          // 予約履歴を取得
          this.pastReservations = this.reservations.filter(reservation => new Date(reservation.date) < today);

          // 来店済の店名を取得
          this.shopNames = this.pastReservations.map(reservation => reservation.shop.name);
          
          // 来店済のshopIdを取得
          this.shopIds = this.pastReservations.map(reservation => reservation.shop.id);
        }
      } catch (error) {
        console.error('予約データの取得に失敗しました', error)
      } 
    },
  },
}
</script>