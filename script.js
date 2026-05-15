// script.js

document.addEventListener('DOMContentLoaded', () => {

    // --- パスワード保護関連 ---
    // ★注意：ここに直接パスワードを書くと、ソースを見れば誰でも分かってしまいます。
    // 簡易的なアクセス制限としては使えますが、重要な情報の保護には適しません。
    // より安全な方法（サーバーサイドでの認証など）を検討してください。
    const password = "penguin"; // 設定したいパスワード

    const overlay = document.getElementById('overlay');
    const passwordPopup = document.getElementById('password-popup');
    const passwordInput = document.getElementById('password-input');
    const passwordSubmit = document.getElementById('password-submit');
    const messageElement = document.getElementById('message');
    const body = document.body; // body要素を取得

    // sessionStorageから認証状態を取得
    const isAuthenticated = sessionStorage.getItem('isAuthenticated') === 'true'; // booleanとして取得

    // ページロード時の初期表示制御 (CSSと連携)
    if (isAuthenticated) {
        // 認証済みの場合はbodyにauthenticatedクラスを付ける（CSSでコンテンツが表示される）
        body.classList.add('authenticated');
    } else {
        // 認証されていない場合はbodyからauthenticatedクラスを外す（CSSでパスワードポップアップが表示される）
        body.classList.remove('authenticated');
        // ポップアップが開いているので、入力フィールドにフォーカスする
        // 小さな遅延を入れると確実にフォーカスできることが多い
        setTimeout(() => {
             passwordInput.focus();
        }, 100);
    }

    // パスワード送信ボタンのイベントリスナー
    passwordSubmit.addEventListener('click', validatePassword);

    // パスワード入力フィールドでのEnterキーイベントリスナー
    passwordInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            validatePassword();
        }
    });

    // パスワード検証関数
    function validatePassword() {
        const userInput = passwordInput.value;

        if (userInput === password) {
            // パスワードが一致したら認証状態を保存し、コンテンツを表示
            sessionStorage.setItem('isAuthenticated', 'true');
            body.classList.add('authenticated'); // bodyにauthenticatedクラスを付けてCSSで表示
            messageElement.textContent = ''; // メッセージをクリア
            passwordInput.value = ''; // 入力欄をクリア

            // 認証成功後、コンテンツが表示されてから初期フィルター・検索を適用
            // requestAnimationFrameを使って、DOMの表示更新を待つ
             requestAnimationFrame(() => {
                 // 初期状態として「全て」フィルターを適用（ボタンのクリックをシミュレート）
                 // これにより activeFilterClass が 'all' に設定され、updateDisplayedItems が呼ばれる
                document.querySelector('.filter-button[data-class="all"]').click();
                // 検索入力欄と内部の状態をクリア
                document.getElementById('searchInput').value = '';
                currentSearchQuery = '';
                 // updateDisplayedItems は上記の click() の中で既に実行されている
             });


        } else {
            // パスワードが間違っている場合
            messageElement.textContent = "パスワードが間違っています";
            passwordInput.value = ''; // 入力欄をクリア
             // 間違いメッセージ表示後、入力フィールドに再度フォーカス
             setTimeout(() => {
                 passwordInput.focus();
            }, 100);
        }
    }

    // --- フィルター・検索関連 ---
    const filterButtons = document.querySelectorAll('.filter-button');
    const studentItems = document.querySelectorAll('.student-item'); // 全ての学生アイテム
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');

    // 現在のアクティブなフィルタークラスと検索クエリを保持する変数
    let activeFilterClass = 'all'; // 初期値は「全て」
    let currentSearchQuery = ''; // 初期値は空

    // 表示されるアイテムを更新する共通関数
    // 現在のアクティブなフィルターと検索クエリに基づいてアイテムの表示/非表示を切り替える
    function updateDisplayedItems() {
        // 検索クエリを小文字に変換（大文字小文字を区別しない検索のため）
        const query = currentSearchQuery.toLowerCase();

        studentItems.forEach(item => {
            // 学生の名前を取得し、小文字に変換
            const studentNameElement = item.querySelector('p');
            if (!studentNameElement) {
                 // 名前要素がない場合はスキップ
                 return;
            }
            const studentName = studentNameElement.textContent.toLowerCase();
            // アイテムが持つクラスの配列を取得
            const itemClasses = Array.from(item.classList);

            // --- フィルター条件のチェック ---
            // activeFilterClass が 'all' なら常にtrue
            // そうでなければ、アイテムが activeFilterClass を含むかチェック
            const matchesFilter = (activeFilterClass === 'all' || itemClasses.includes(activeFilterClass));

            // --- 検索条件のチェック ---
            // query が空の場合は常にtrue（検索しない状態）
            // そうでなければ、学生の名前に query が含まれているかチェック
            const matchesSearch = (query === '' || studentName.includes(query));

            // --- 表示/非表示の判定 ---
            // フィルター条件と検索条件の両方を満たす場合のみ表示
            if (matchesFilter && matchesSearch) {
                item.classList.remove('hidden'); // hiddenクラスを削除して表示
            } else {
                item.classList.add('hidden'); // hiddenクラスを付けて非表示
            }
        });
    }

    // フィルターボタンのイベントリスナー
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // アクティブなボタンのスタイルを更新
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // アクティブなフィルタークラスを更新
            activeFilterClass = button.dataset.class;

            // フィルター条件が変わったので、表示されるアイテムを更新
            updateDisplayedItems();
        });
    });

    // 検索入力フィールドのイベントリスナー（入力があるたびに実行 = リアルタイム検索）
    searchInput.addEventListener('input', (event) => {
        currentSearchQuery = event.target.value.trim(); // 入力値を取得し、前後の空白を除去
        updateDisplayedItems(); // 検索クエリが変わったので、表示されるアイテムを更新
    });

    // 検索ボタンのイベントリスナー（クリック時） - inputイベントでも実行されるが念のため
    searchButton.addEventListener('click', () => {
         // inputイベントで currentSearchQuery は更新されているはずだが、明示的に再取得・更新
         currentSearchQuery = searchInput.value.trim();
         updateDisplayedItems(); // 表示されるアイテムを更新
     });


    // --- ページロード時の初期化 ---
    // DOMContentLoaded 時点（スクリプト実行時）で既に認証済みの場合は、
    // コンテンツ表示後、初期フィルター・検索を適用してアイテムを表示状態にする
    // requestAnimationFrame を使って、CSSによるコンテンツ表示が完了してから実行
    if (isAuthenticated) {
        requestAnimationFrame(() => {
             // ページの初期表示として「全て」フィルターと空の検索クエリでアイテムを表示
             // フィルターボタンのクリックをシミュレートするのが手軽で確実
            document.querySelector('.filter-button[data-class="all"]').click();
             // 初期状態なので検索窓はクリアしておく
             document.getElementById('searchInput').value = '';
             currentSearchQuery = ''; // 内部状態もクリア
             // updateDisplayedItems() は上記の click() の中で既に実行されているため不要
        });
    } else {
        // 認証されていない場合は、CSSでコンテンツが非表示になっている状態を維持。
        // パスワードポップアップが表示されている。
    }


}); // End DOMContentLoaded