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

    <v-divider></v-divider>

<!-- 投稿履歴 -->
      <v-data-table
        fixed-header
        
        :headers="reviewHeaders"
        :items="reviews"
        :items-per-page="6"
        :show-no-data="false"
        hide-default-footer
        mobile-breakpoint="768">

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
    
  </v-container>
</template>

<script>

export default {
  name: 'ReviewForm',
  data() {
    return {
      reviews: [], // 口コミ情報
      deleteDialog: false,

      // スナックバー
      snackbar: {
        show: false,
        message: '',
        color: 'primary', // デフォルトの色
        timeout: 3000,
      },

      // 投稿履歴テーブルのヘッダー
      reviewHeaders: [
        { text: '店名', value: 'shopName', sortable: false },
        { text: '投稿日', value: 'created_at', sortable: false },
        { text: '投稿者', value: 'userName', sortable: false },
        { text: '削除', value: 'delete', sortable: false, align: 'center' },
      ],
    }
  },

  mounted() {
    this.fetchReview();
  },

  methods: {
    // snackbar
    showSnackbar({ message, color }) {
      this.snackbar.message = message;
      this.snackbar.color = color || 'primary';
      this.snackbar.show = true;
    },

    // 投稿履歴削除ダイアログを開く
    openDeleteDialog(itemId) {
      this.selectedId = itemId;
      this.deleteDialog = true;
    },

    // 投稿履歴削除ダイアログを閉じる
    closeDialog() {
      this.deleteDialog = false;
    },

    // 投稿履歴を取得
    async fetchReview() {
      try {
        const response = await this.$axios.get(`${process.env.API_URL}/api/review`);

        if (response && response.data && Array.isArray(response.data)) {
          this.reviews = response.data;
          console.log('口コミデータ:', this.reviews);
          
          // 口コミデータから店名と投稿者を抽出
          this.reviews.forEach(review => {
            
            const shopName = review.shop.name;
            const userName = review.user.name;
            
            review.shopName = shopName;
            review.userName = userName;

            // 日付のフォーマット
            review.created_at = new Date(review.created_at).toISOString().split('T')[0];
          });
        }
      } catch (error) {
        console.error('投稿履歴の取得に失敗しました', error)
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
  },
}
</script>