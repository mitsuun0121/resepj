<template>
  <v-container>
    <!-- 予約の状況と履歴 -->
    <v-card-title>
      <v-icon left>mdi-calendar-month-outline</v-icon>予約
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
      <v-tab @click="tab = 1">予約状況</v-tab>
      <v-tab @click="tab = 2">予約履歴</v-tab>
    </v-tabs>
    <v-divider></v-divider>

<!-- 予約状況 -->
    <div v-if="tab === 1">
      <div v-if="!loading">
        <v-data-table
          fixed-header
          height="240px"
          :headers="currentReservationHeaders"
          :items="currentReservations"
          :show-no-data="false"
          hide-default-footer
          mobile-breakpoint="768"
          >
          <template v-slot:item.actions="{ item }">
            <!-- 変更ボタン -->
            <v-btn
              fab
              small
              depressed
              color="primary"
              class="mr-4"
              @click="openReservationDialog(item)">
              <v-icon>
              mdi-pencil
              </v-icon>
            </v-btn>

            <!-- 予約変更ダイアログ -->
            <v-dialog
              v-model="reservationDialog"
              persistent
              width="500">
              <v-card class="py-5">
                <v-form
                  @submit.prevent="editReservation"
                  ref="reservationserver"
                  class="d-flex
                  align-center
                  flex-column">

                  <!-- 予約日を選択 -->
                  <v-sheet width="200" class="mt-1" light>
                    <v-menu
                      v-model="menu"
                      :close-on-content-click="false"
                      :nudge-right="40"
                      transition="scale-transition"
                      offset-y>
                      <template v-slot:activator="{ on }">
                        <v-text-field
                          v-model="editedItem.date"
                          label="日にち"
                          outlined
                          dense
                          readonly
                          clearable
                          required
                          :rules="dateRules"
                          v-on="on">
                        </v-text-field>
                      </template>
                      <v-date-picker
                        no-title
                        :min="minDate"
                        color="primary"
                        :day-format="date => new Date(date).getDate()"
                        @input="changeDate">
                      </v-date-picker>
                    </v-menu>
                  </v-sheet>

                  <!-- 予約時間を選択 -->
                  <v-sheet width="200" class="mt-1">
                    <v-select
                      v-model="editedItem.time"
                      label="時間"
                      :items="times"
                      outlined
                      dense
                      clearable
                      required
                      :rules="timeRules"
                      @input="handleFormChange">
                    </v-select>
                  </v-sheet>

                  <!-- 予約人数を選択 -->
                  <v-sheet width="200" class="mt-1">
                    <v-select
                      v-model="editedItem.count"
                      label="人数"
                      :items="counts"
                      outlined
                      dense
                      clearable
                      required
                      :rules="countRules"
                      @input="handleFormChange">
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
                      class="text-caption
                      white--text
                      mb-n2">
                      <v-list-item-title class="text-subtitle-2">
                        店名
                      </v-list-item-title>
                      <v-list-item-title>
                        {{ editedItem.shop }}
                      </v-list-item-title>
                    </v-list-item>

                    <v-list-item
                      class="white--text
                      mb-n2">
                      <v-list-item-title class="text-subtitle-2">
                        予約日
                      </v-list-item-title>
                      <v-list-item-title>
                        {{ editedItem.date }}
                      </v-list-item-title>
                    </v-list-item>

                    <v-list-item
                      class="white--text
                      mb-n2">
                      <v-list-item-title class="text-subtitle-2">
                        予約時間
                      </v-list-item-title>
                      <v-list-item-title>
                        {{ editedItem.time }}
                      </v-list-item-title>
                    </v-list-item>

                    <v-list-item
                      class="white--text">
                      <v-list-item-title class="text-subtitle-2">
                        予約人数
                      </v-list-item-title>
                      <v-list-item-title>
                        {{ editedItem.count }}
                      </v-list-item-title>
                    </v-list-item>
                  </v-list>

                  <!-- 予約変更ボタン -->
                  <div class="tect-center">
                    <v-btn
                      class="text-body-1
                      mt-1"
                      type="submit"
                      :disabled="!formChanged"
                      color="primary"
                      width="260"
                      height="50">
                      変更する
                    </v-btn>
                  </div>
                  <!-- キャンセルボタン -->
                  <div class="tect-center">
                    <v-btn
                      class="text-body-1
                      white--text
                      mt-1"
                      @click="closeReservationDialog"
                      color="grey darken-3"
                      width="260"
                      height="50">
                      閉じる
                    </v-btn>
                  </div>
                </v-form>
              </v-card>
            </v-dialog>

            <!-- 予約キャンセルボタン -->
            <v-btn
              fab
              small
              depressed
              color="error"
              @click="openCancelDialog(item.id)">
              <v-icon>
              mdi-delete
              </v-icon>
            </v-btn>
          </template>

          <!-- 予約データがない場合 -->
          <template v-slot:no-data>
            <div
              style="color: #E0E0E0;"
              class="text-center
              text-h6
              font-weight-bold
              mt-16">
              現在の予約はありません。
            </div>
          </template>
        </v-data-table>

        <!-- 予約キャンセルダイアログ -->
        <v-dialog v-model="cancelDialog" width="350">
          <v-card>
            <v-card-title
              class="text-subtitle-1">キャンセル確認
            </v-card-title>
            <v-card-text>
              予約をキャンセルしてもよろしいですか？
            </v-card-text>
            <v-card-actions>
              <v-btn
                @click="closeDialog"
                class="text-body-2
                font-weight-bold">キャンセル
              </v-btn>
              <v-spacer></v-spacer>
              <v-btn
                @click="cancelReservationId"
                color="error"
                class="text-body-2
                font-weight-bold">
                OK
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </div>
    </div>
    
<!-- 予約履歴 -->
    <div v-if="tab === 2">
      <div v-if="!loading">
        <v-data-table
          fixed-header
          height="240px"
          :headers="pastReservationHeaders"
          :items="pastReservations"
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

          <!-- 予約データがない場合 -->
          <template v-slot:no-data>
            <div
              style="color: #E0E0E0;"
              class="text-center
              text-h6
              font-weight-bold
              mt-16">
              予約履歴はありません。
            </div>
          </template>
        </v-data-table>

        <!-- 予約履歴削除ダイアログ -->
        <v-dialog v-model="deleteDialog" width="350">
          <v-card>
            <v-card-title
              class="text-subtitle-1">削除確認
            </v-card-title>
            <v-card-text>
              予約履歴を削除してもよろしいですか？
            </v-card-text>
            <v-card-actions>
              <v-btn
                @click="closeDialog"
                class="text-body-2
                font-weight-bold">キャンセル
              </v-btn>
              <v-spacer></v-spacer>
              <v-btn
                @click="deleteReservationId"
                color="error"
                class="text-body-2
                font-weight-bold">
                OK
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </div>
    </div>
  </v-container>
</template>

<script>
export default {
  name: 'ResevationForm',
  data() {
    return {
      currentReservations: [],
      pastReservations: [],
      tab: 1, // デフォルトは予約状況
      loading: true,
      menu: false,
      selectedDate: null,
      reservationDialog: false,
      cancelDialog: false,
      deleteDialog: false,

      qrCodeData: '',

      editedItem: {
        shop: '',
        date: '',
        time: '',
        count: '',
      },

      formChanged: false,

      // スナックバー
      snackbar: {
        show: false,
        message: '',
        color: 'primary', // デフォルトの色
        timeout: 3000,
      },
      
      times: ['18:00', '19:00', '20:00'],
      counts: ['1人', '2人', '3人', '4人', '5人'],

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

      // 予約状況テーブルのヘッダー
      currentReservationHeaders: [
        { text: '店名', value: 'shop', sortable: false },
        { text: '日にち', value: 'date', sortable: false },
        { text: '時間', value: 'time', sortable: false },
        { text: '人数', value: 'count', sortable: false, align: 'center' },
        { text: '変更／キャンセル', value: 'actions', sortable: false, align: 'center' },
      ],
      // 予約履歴テーブルのヘッダー
      pastReservationHeaders: [
        { text: '店名', value: 'shop', sortable: false },
        { text: '日にち', value: 'date', sortable: false },
        { text: '時間', value: 'time', sortable: false },
        { text: '人数', value: 'count', sortable: false, align: 'center' },
        { text: '削除', value: 'actions', sortable: false, align: 'center' },
      ],
    }
  },

  computed: {
    // v-date-picker今日以降が予約日として選択可能
    minDate() {
      const today = new Date();
      today.setDate(today.getDate() + 1);
      return today.toISOString(); // YYYY-MM-DD形式に変換
    },
  },

  mounted() {
    this.fetchReservation();
  },

  methods: {
    // snackbar
    showSnackbar({ message, color }) {
      this.snackbar.message = message;
      this.snackbar.color = color || 'primary'; // デフォルトの色
      this.snackbar.show = true;
    },

    // 日付を "YYYY-MM-DD" 形式に変換
    formatDate(dateString) {
      const date = new Date(dateString);
      const formatDate = date.toISOString().split('T')[0];
      return formatDate;
    },

    // 予約時間の秒を表示しないように設定
    formatTime(timeSlot) {
      return timeSlot.slice(0, 5); // "HH:mm" 形式に整形
    },

    // 数値を人数に変換
    formatCount(count) {
      console.log('formatcount - input number:', count);
      if (count === 1) {
        return '1人';
      } else if (count === 2) {
        return '2人';
      } else if (count === 3) {
        return '3人';
      } else if (count === 4) {
        return '4人';
      } else if (count === 5) {
        return '5人';
      }
    },

    // 予約フォームの変更があった場合に変更するボタンをアクティブ
    handleFormChange() {
      this.formChanged = true;
    },

    // 予約の日にちを変更する
    changeDate(date) {
      this.editedItem.date = date;
      this.menu = false;
      this.handleFormChange();
    },

    // 予約データを取得
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

          // 店名を取得
          for (const reservation of this.reservations) {
            const shopName = reservation.shop.name;
            console.log('店名:', shopName);
            // currentReservationsのshopに店名をセット
            reservation.shop = shopName;
            // 日にちのフォーマットを整形
            reservation.date = this.formatDate(reservation.date);
            // 時間のフォーマットを整形
            reservation.time = this.formatTime(reservation.time);
            // 人数のフォーマットを整形
            reservation.count = this.formatCount(reservation.count);
          }
          // 現在の日時を取得
          const today = new Date();
          today.setHours(0, 0, 0, 0); // 時間は考慮しない
          console.log(today);
          
          // 予約状況を取得
          this.currentReservations = this.reservations.filter(reservation => new Date(reservation.date) >= today);
          
          // 予約履歴を取得
          this.pastReservations = this.reservations.filter(reservation => new Date(reservation.date) < today);
        }
      } catch (error) {
        console.error('予約データの取得に失敗しました', error)
      } finally {
        // ローディング状態を解除
        this.loading = false;
      }
    },

    // 予約変更ダイアログを開く
    openReservationDialog(item) {
      this.editedItem = {
        id: item.id,
        shop: item.shop,
        date: item.date,
        time: item.time,
        count: item.count,
      };
      this.reservationDialog = true;
    },

    // 予約変更ダイアログを閉じる
    closeReservationDialog() {
      this.reservationDialog = false;
      this.reloadPage();
    },

    // ページをリロード
    reloadPage() {
      this.$router.go();
    },

    // 予約内容を変更
    async editReservation() {
      try {
        const reservationData = {
          id: this.editedItem.id,
          shop: this.editedItem.shop,
          date: this.editedItem.date,
          time: this.editedItem.time,
          count: parseInt(this.editedItem.count),
        };
        const response = await this.$axios.put(`${process.env.API_URL}/api/reservation/${reservationData.id}`, reservationData);

        this.closeReservationDialog();
        this.fetchReservation();
        this.showSnackbar({ message: '予約内容が変更されました', color: 'primary' });

        console.log('予約内容が変更されました:', response.data);
      } catch (error) {
        console.error('予約内容の変更に失敗しました', error);
      }
    },

    // 予約キャンセルダイアログを開く
    openCancelDialog(itemId) {
      this.selectedId = itemId;
      this.cancelDialog = true;
    },

    // 予約キャンセル処理を実行
    cancelReservationId() {
      this.cancelReservation(this.selectedId);
      this.cancelDialog = false;
    },

    // 予約履歴削除ダイアログを開く
    openDeleteDialog(itemId) {
      this.selectedId = itemId;
      this.deleteDialog = true;
    },

    // 予約履歴削除処理を実行
    deleteReservationId() {
      this.deleteReservation(this.selectedId);
      this.deleteDialog = false;
    },

    // 予約キャンセル・予約履歴削除ダイアログを閉じる
    closeDialog() {
      this.deleteDialog = false;
      this.cancelDialog = false;
    },

    // 予約をキャンセルする
    async cancelReservation(id) {
      try {
        const response = await this.$axios.delete(`${process.env.API_URL}/api/reservation/${id}`);

        console.log('予約がキャンセルされました', response.data);

        this.showSnackbar({ message: '予約がキャンセルされました', color: 'error' });

        this.fetchReservation();

      } catch (error) {
        console.error('予約のキャンセルに失敗しました', error);        
      }
    },

    // 予約履歴を削除する
    async deleteReservation(id) {
      try {
        const response = await this.$axios.delete(`${process.env.API_URL}/api/reservation/${id}`);

        console.log('予約が削除されました', response.data);

        this.showSnackbar({ message: '予約履歴が削除されました', color: 'error' });

        this.fetchReservation();

      } catch (error) {
        console.error('予約の削除に失敗しました', error);        
      }
    },
  }    
}
</script>
