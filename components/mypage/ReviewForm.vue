<template>
  <v-container>
    <!-- 口コミ作成と削除 -->
    <v-card-title>
      <v-icon left>mdi-tooltip-text-outline</v-icon>口コミ
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
      <v-tab @click="tab = 1">口コミ投稿</v-tab>
      <v-tab @click="tab = 2">投稿履歴</v-tab>
    </v-tabs>
    <v-divider></v-divider>

<!-- 口コミ投稿 -->
    <div v-if="tab === 1">
      <v-card>
        <v-card-text>
          <v-row justify="center">
            <v-col cols="12" sm="8" md="8" lg="8">
              <div align="center">
                <v-alert
                  class="mt-3"
                  width="250"
                  color="primary"
                  dense
                  text>
                  <div class="mt-1">
                    口コミ投稿フォーム
                  </div>
                </v-alert>
              </div>

              <v-form
                ref="reviewserver"
                enctype="multipart/form-data">
                <v-card-text>
                  店名
                  <span class="red--text">（必須）</span>
                </v-card-text>
                <v-select
                  v-model="shopName"
                  class="mt-n2"
                  :items="filteredShopNames"
                  dense
                  outlined
                  hint="店名を選択して下さい。"
                  persistent-hint
                  :rules="shopNameRules"
                  required
                ></v-select>
                <v-divider></v-divider>

                <v-card-text
                  class="mt-5">
                  評価
                  <span class="red--text">（必須）</span>
                </v-card-text>
                <v-rating
                  v-model="rating"
                  class="mt-n4"
                  ref="rating"
                  :items="5"
                  :size="35"
                  color="info"
                  background-color="grey lighten-2"
                ></v-rating>
                <v-messages
                  v-if="rating > 0"
                  class="mb-2
                  ml-3"
                  :value="ratingMessage"
                  color="gray"
                ></v-messages>
                <v-messages
                  v-else
                  class="mb-2
                  ml-3"
                  :value="ratingMessage"
                  color="error"
                ></v-messages>
                <v-divider></v-divider>

                <v-card-text
                  class="mt-5">
                  タイトル
                  <span class="red--text">（必須）</span>
                </v-card-text>
                <v-text-field
                  v-model="title"
                  class="mt-n2"
                  outlined
                  dense
                  counter
                  hint="2～25文字の範囲で入力して下さい。"
                  persistent-hint
                  :rules="titleRules"
                  required>
                </v-text-field>
                <v-divider></v-divider>

                <v-card-text
                  class="mt-5">
                  本文
                  <span class="red--text">（必須）</span>
                </v-card-text>
                <v-textarea
                  v-model="comment"
                  class="mt-n2"
                  outlined
                  auto-grow
                  counter
                  hint="25～400文字の範囲で入力して下さい。"
                  persistent-hint
                  :rules="commentRules"
                  required>
                </v-textarea>
                <v-divider></v-divider>
              
                <!-- 画像アップロード -->
                <v-card-text class="mt-5">画像を追加</v-card-text>
                <div>
                  <!-- ファイル選択 -->
                  <v-file-input
                    type="file"
                    accept="image/png, image/jpeg"
                    label="画像を選択"
                    placeholder="画像を選択して下さい"
                    prepend-icon="mdi-camera"
                    @change="handleImageUpload"
                    @dragover.prevent>
                  </v-file-input>
                  
                  <!-- アップロードされた画像のプレビュー -->
                  <img
                    v-if="imageUrl"
                    :src="imageUrl"
                    alt="Uploaded Image"
                    width="200"
                    class="mt-3"
                    @dragover.prevent>

                  <!-- 非対応拡張子のエラーメッセージ -->
                  <p
                    v-if="fileError"
                    :style="{ color: fileErrorColor }">
                    {{ fileError }}
                  </p>
                </div>
                
                <!--　口コミ投稿ボタン -->
                <div
                  class="text-center
                  mt-12
                  pb-8">
                  <v-btn
                    color="primary"
                    min-width="150"
                    height="50"
                    rounded
                    class="text-body-1"
                    @click="addReview">
                    口コミを投稿
                  </v-btn>
                </div>
              </v-form>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </div>

<!-- 投稿履歴 -->
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
        <template v-slot:item.edit="{ item }">
          <!-- 編集ボタン -->
          <v-btn
            fab
            small
            depressed
            color="primary"
            @click="openEditDialog(item)">
            <v-icon>
              mdi-pencil
            </v-icon>
          </v-btn>
        </template>

        <template v-slot:item.delete="{ item }">
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

      <!-- 編集ダイアログ -->
      <v-dialog v-model="editDialog" width="600">
        <v-card class="pb-4">
          <v-card-title class="text-h6">口コミを編集</v-card-title>
          <v-card-text>

            <v-card-text
              class="mb-n5">
              評価
              <span class="red--text">（必須）</span>
            </v-card-text>
            <v-rating
              v-model="editedReview.review"
              color="info"
              background-color="grey lighten-2">
            </v-rating>
            <v-messages
              class="mb-2
              ml-3"
              :value="ratingMessage"
              color="gray"
            ></v-messages>

            <v-card-text
              class="mb-n2">
              タイトル
              <span class="red--text">（必須）</span>
            </v-card-text>
            <v-text-field 
              v-model="editedReview.title"
              outlined
              dense
              counter
              :rules="titleRules"
              required
              hint="2～25文字の範囲で入力して下さい。"
              persistent-hint>
            </v-text-field>

            <v-card-text
              class="mb-n2">
              本文
              <span class="red--text">（必須）</span>
            </v-card-text>    
            <v-textarea
              v-model="editedReview.comment"
              outlined
              dense
              counter
              :rules="commentRules"
              required
              hint="25～400文字の範囲で入力して下さい。"
              persistent-hint>
            </v-textarea>

          </v-card-text>
          <v-card-actions>
            <v-btn @click="closeDialog">キャンセル</v-btn>
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="updateReview">投稿する</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- 投稿履歴削除ダイアログ -->
      <v-dialog v-model="deleteDialog" width="350">
        <v-card>
          <v-card-title
            class="text-subtitle-1">削除確認
          </v-card-title>
          <v-card-text>
            口コミを削除してもよろしいですか？
          </v-card-text>
          <v-card-actions>
            <v-btn
              @click="closeDialog">
              キャンセル
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn
              @click="deleteReviewId"
              color="error"
              class="text-body-1">
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
      reviews: [], // 口コミ情報
      pastReservations: [], // 来店済のお店
      shopNames: [], // お店の名前のリスト
      shopName: null, // 選択されたお店の名前
      rating: 0,
      title: '',
      comment: '',
      image: '',
      tab: 1, // デフォルトは口コミ投稿
      editDialog: false,
      editedReview: {
        id: null,
        review: '',
        title: '',
        comment: '',
      },
      imageUrl: '',
      fileError: '', // 非対応の拡張子のエラーメッセージの変数

      deleteDialog: false,

      ratingMessage: ['評価を選択してください。'],

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
        v => (v && v.length <= 400) || '400文字以下で入力してください。',
      ],

      // 投稿履歴テーブルのヘッダー
      reviewHeaders: [
        { text: '店名', value: 'shopName', sortable: false },
        { text: '投稿日', value: 'updated_at', sortable: false },
        { text: '編集', value: 'edit', sortable: false, align: 'center' },
        { text: '削除', value: 'delete', sortable: false, align: 'center' },
      ],
    }
  },

  mounted() {
    this.fetchReservation();
    this.fetchReview();
  },

  computed: {
    // 口コミが投稿されていない店名のリストのみ取得
    filteredShopNames() {
      return this.shopNames.filter(shopName => !this.reviews.some(review => review.shopName === shopName));
    },
  },

  methods: {
    // snackbar
    showSnackbar({ message, color }) {
      this.snackbar.message = message;
      this.snackbar.color = color || 'primary';
      this.snackbar.show = true;
    },

    openEditDialog(review) {
      // 編集対象の口コミ情報をセット
      this.editedReview.id = review.id;
      this.editedReview.review = review.review;
      this.editedReview.title = review.title;
      this.editedReview.comment = review.comment;
      this.editedReview.image = review.image;
      this.editDialog = true;
    },

    // 投稿履歴削除ダイアログを開く
    openDeleteDialog(itemId) {
      this.selectedId = itemId;
      this.deleteDialog = true;
    },

    // 投稿内容編集・投稿履歴削除ダイアログを閉じる
    closeDialog() {
      this.editDialog = false;
      this.deleteDialog = false;
    },

    // フォームリセット
    resetForm() {
      this.shopName = null;
      this.rating = 0;
      this.title = '';
      this.comment = '';
      this.imageUrl = '';
      this.$refs.reviewserver.reset();
    },

    // ファイルから選択して画像をアップロード
    handleImageUpload(file) {
      if (!file) {
        return;
      }
      // 画像URLから拡張子を取得
      const extension = file.name.split('.').pop().toLowerCase();

      // jpeg, png以外の拡張子の場合はエラーメッセージ
      if (extension !== 'jpg' && extension !== 'jpeg' && extension !== 'png') {
        this.fileError = '写真はJPEGまたはPNG形式を選択して下さい。';
        this.fileErrorColor = 'red';
        return;
      }
      this.fileError = '';
      this.file = file;
      this.imageUrl = URL.createObjectURL(file);
    },

    // フォームのバリデーション
    async validateForm() {
      return this.$refs.reviewserver.validate();
    },

    addReview() {
      this.validateForm().then(valid => {
        if (valid) {
          if (!this.rating) {
            // 強制的にバリデーションをトリガー
            this.$refs.rating.$emit('change', true);
            return;
          }
        } 
      });
    },

    // 口コミを投稿
    async addReview() {
      try {
        const valid = await this.validateForm();

        if (valid) {
          // 選択されたお店のIDを取得
          const selectedShop = this.shopNames.indexOf(this.shopName);
          const shopId = this.shopIds[selectedShop];
          const userId = this.$auth.user.id;

          // FormDataオブジェクトを作成
          const formData = new FormData();
          formData.append('user_id', userId);
          formData.append('shop_id', shopId);
          formData.append('review', this.rating);
          formData.append('title', this.title);
          formData.append('comment', this.comment);

          // ファイルを追加
          
          formData.append('image', this.file);

          // フォームデータを送信
          const response = await this.$axios.post(`${process.env.API_URL}/api/review`, formData);

          this.fetchReview();
          this.resetForm();

          console.log('口コミを投稿しました', response.data);

          this.showSnackbar({ message: '口コミを投稿しました', color: 'primary' });
        }
      } catch (error) {
        console.error('口コミの投稿に失敗しました', error);
      }
    },

    // 投稿履歴を取得
    async fetchReview() {
      try {
        const response = await this.$axios.get(`${process.env.API_URL}/api/review`);

        if (response && response.data && Array.isArray(response.data)) {
          // ログイン中のユーザーのID
          const loginUser = this.$auth.user.id;
          
          this.reviews = response.data;
          console.log('口コミデータ:', this.reviews);
          
          // ログインユーザーの口コミデータのみを抽出
          const userReviews = this.reviews.filter(review => review.user_id === loginUser);
          console.log('ユーザーID:', loginUser);
          console.log('抽出された口コミデータ:', userReviews);
          
          // 店名・投稿日をフォーマット
          userReviews.forEach(userReview => {
            userReview.updated_at = this.formatDate(userReview.updated_at);
            userReview.shopName = userReview.shop.name;
          });

          // ログインユーザーの口コミデータのみを表示
          this.reviews = userReviews;
        }
      } catch (error) {
        console.error('投稿履歴の取得に失敗しました', error)
      }
    },

    // 口コミを編集
    async updateReview() {
      try {
        const response = await this.$axios.put(`${process.env.API_URL}/api/review/${this.editedReview.id}`, {
          review: this.editedReview.review,
          title: this.editedReview.title,
          comment: this.editedReview.comment,
        });
        
        this.closeDialog();
        this.fetchReview();

        console.log('口コミを更新しました', response.data);

        this.showSnackbar({ message: '口コミを更新しました', color: 'primary' });
      } catch (error) {
        console.error('口コミの更新に失敗しました', error);
      }
    },

    // 投稿履歴削除処理を実行
    deleteReviewId() {
      this.deleteReview(this.selectedId);
      this.deleteDialog = false;
    },

    // 口コミを削除
    async deleteReview(id) {
      try {
        const response = await this.$axios.delete(`${process.env.API_URL}/api/review/${id}`);

        console.log('口コミが削除されました', response.data);

        this.showSnackbar({ message: '口コミが削除されました', color: 'error' });

        // 画面を更新
        this.reviews = this.reviews.filter(review => review.id !== id);

      } catch (error) {
        console.error('口コミの削除に失敗しました', error);        
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
