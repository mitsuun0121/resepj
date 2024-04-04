<template>
  <v-container>
    <!-- お気に入りの一覧 -->
    <div class="d-flex justify-space-between">
      <v-card-title>
        <v-icon left>mdi-heart-outline</v-icon>お気に入り
      </v-card-title>

      <!-- 編集ボタン -->
      <v-btn
        class="mt-4
        font-weight-bold"
        outlined
        color="primary"
        :disabled="favorites.length === 0"
        @click="editFavorites = !editFavorites">
        {{ editFavorites ? '閉じる' : '編集' }}
      </v-btn>
    </div>

    <v-divider></v-divider>

    <!-- お気に入りが登録されているか -->
    <div v-if="favorites.length > 0" class="mt-3">
      <v-row justify="start" align="center">
        <v-col v-for="favorite in favorites" :key="favorite.id" cols="6" sm="6" md="4" lg="3">
          <v-card
            class="mx-auto"
            min-width="140"
            outlined
            elevation="4">  
            <!-- 画像：お店の詳細ページへ -->
            <NuxtLink
              :to="'/shop/' + favorite.shop.id">
              <v-img
                class="shop-photo"
                :src="favorite.shop.photo_url"
                min-height="80">
              </v-img>
            </NuxtLink>
              
            <div class="d-flex
              justify-space-between">
              <!-- 店名 -->
              <v-card-title
                style="font-size: clamp(0.5rem, calc(0.5vw + 0.5rem), 0.8rem);"
                class="font-weight-bold"
                >{{ favorite.shop.name }}
              </v-card-title>

              <!-- 選択アイコン -->
              <v-btn
                class="mt-4
                mr-3"
                v-show="editFavorites"
                fab
                x-small
                depressed
                :color="isFavorites(favorite.id)"
                @click="selectFavirites(favorite.id)">
                <v-icon color="white">
                mdi-check
                </v-icon>
              </v-btn>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </div>

    <div v-else
      class="text-center
      mt-16">
      <v-icon
        x-large
        color="grey lighten-2">
        mdi-heart-plus-outline
      </v-icon>
      <p
        style="color: #E0E0E0;"
        class="text-h6
        font-weight-bold
        mt-3">
        お気に入り登録はありません。
      </p>
    </div>

    <!--　削除ボタン・リセットボタン -->
    <div
      v-if="editFavorites && favorites.length > 0"
      class="text-center
      mt-12">
      <v-btn
        color="primary"
        min-width="140"
        height="50"
        outlined
        rounded
        class="mr-1
        text-body-1
        font-weight-bold"
        @click="resetFavorites">
        リセット
      </v-btn>
      <v-btn
        color="primary"
        min-width="140"
        height="50"
        rounded
        class="mr-2
        text-body-1
        font-weight-bold"
        @click="openFavoriteDialog(favorite.id)">
        削除する
      </v-btn>
    </div>
     
    <!-- お気に入り削除ダイアログ -->
    <v-dialog v-model="deleteDialog" width="350">
      <v-card>
        <v-card-title
          class="text-subtitle-1">削除確認
        </v-card-title>
        <v-card-text>
          お気に入りから削除してもよろしいですか？
        </v-card-text>
        <v-card-actions>
          <v-btn
            @click="closeDialog"
            class="text-body-2
            font-weight-bold">キャンセル
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn
            @click="deleteFavoriteId"
            color="primary"
            class="text-body-2
            font-weight-bold">
            OK
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
 
export default {
  name: 'FavoriteForm',
  data() {
    return {
      favorites: [], // お気に入りの店舗
      favorite: '',
      editFavorites: false,
      selectedId: [],
      deleteDialog: false,
    }
  },
  
  mounted() {
    this.fetchFavoriteData();
  },

  methods: {
    // お気に入り登録データを取得
    async fetchFavoriteData() {
      try {
        const response = await this.$axios.get(`${process.env.API_URL}/api/favorite`);
        console.log('お気に入り店舗:', response.data);
        this.favorites = response.data;
         
      } catch (error) {
        console.error('お気に入りの取得に失敗しました', error);
      }
    },

    // クリックされた選択アイコンの色を反転させる
    isFavorites(id) {
      return this.selectedId && this.selectedId.includes(id) ? 'primary' : 'grey lighten-2';
    },

    // 選択されている配列を初期化
    resetFavorites() {
      this.selectedId = [];
    },

    // IDを配列に追加、削除する
    selectFavirites(id) {
      const index = this.selectedId.indexOf(id);
      if (index !== -1) {
        // 選択されている場合は、IDを配列から削除
        this.selectedId.splice(index, 1);
      } else {
        // 選択されていない場合は、IDを配列に追加
        this.selectedId.push(id);
      }
      console.log('Clicked ID:', this.selectedId.slice());
    },

    // ダイアログを開く
    openFavoriteDialog() {
      const selectedId = this.selectedId;
      if (selectedId.length === 0) {
        // 選択されていない場合に警告を表示
        alert('お気に入りが選択されていません。');
      } else {
        console.log('ID', selectedId.slice());
        this.deleteDialog = true;
      }
    },

    // お気に入り削除処理を実行
    deleteFavoriteId() {
      const selectedId = this.selectedId;
      console.log('Selected ID:', selectedId.slice());
      this.deleteFavorites(selectedId);
      this.deleteDialog = false;
    },

    // ダイアログを閉じる
    closeDialog() {
      this.deleteDialog = false;
    },

    // お気に入りの店舗を削除する
    async deleteFavorites(ids) {
      try {
        for (const id of ids) {
          const response = await this.$axios.delete(`${process.env.API_URL}/api/favorite/${id}`);

          console.log(`ID: ${id} のお気に入りが削除されました`, response.data);

          this.resetFavorites(); // 配列の中をリセット

          this.fetchFavoriteData(); // お気に入り取得
        }
      } catch (error) {
        console.error('お気に入りの削除に失敗しました', error);
      }
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

[v-cloak] {
  display: none;
}
</style>