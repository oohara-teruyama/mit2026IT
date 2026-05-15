// script.js

// Particle（点）クラスの定義 - CanvasAnimationクラスの外に置きます
class Particle {
    constructor(canvasWidth, canvasHeight) {
        this.x = Math.random() * canvasWidth;
        this.y = Math.random() * canvasHeight;
        this.size = Math.random() * 3 + 1;
        this.speedX = Math.random() * 0.5 - 0.25;
        this.speedY = Math.random() * 0.5 - 0.25;
    }

    update(canvasWidth, canvasHeight) {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x > canvasWidth - this.size || this.x < this.size) {
            this.speedX = -this.speedX;
        }
        if (this.y > canvasHeight - this.size || this.y < this.size) {
            this.speedY = -this.speedY;
        }
    }

    draw(ctx, color) {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}


// Canvas要素を管理しアニメーションを実行するクラス
class CanvasAnimation {
    // コンストラクタは canvasId のみを受け取る形に戻す
    constructor(canvasId, particleColor = 'rgba(0, 0, 0, 0.08)', numberOfParticles = 60, maxLineDistance = 120, lineColor = 'rgba(0, 0, 0, 0.04)') {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) {
            console.error(`Canvas element with ID "${canvasId}" not found.`);
            return;
        }
        this.ctx = this.canvas.getContext('2d');
        this.particleColor = particleColor;
        this.numberOfParticles = numberOfParticles;
        this.maxLineDistance = maxLineDistance;
        this.lineColor = lineColor;

        this.particles = [];

        this.resizeCanvas();
        // ウィンドウサイズ変更時と、親要素のリサイズ時（稀だが考慮）にCanvasサイズを調整
        window.addEventListener('resize', () => this.resizeCanvas());


        this.createParticles();
        this.animate();
    }

    // Canvasのサイズを親要素に合わせて設定
    resizeCanvas() {
        // 親要素のサイズを取得してCanvasに設定
        const parent = this.canvas.parentElement;
         if (parent) {
            this.canvas.width = parent.clientWidth;
            this.canvas.height = parent.clientHeight; // 親要素(main)の高さに合わせる
            // サイズ変更後にパーティクルを再生成
            this.particles = [];
            this.createParticles();
         }
    }

    // パーティクルを生成
    createParticles() {
        for (let i = 0; i < this.numberOfParticles; i++) {
            this.particles.push(new Particle(this.canvas.width, this.canvas.height));
        }
    }

    // アニメーションループ
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); // クリア

        for (let i = 0; i < this.particles.length; i++) {
            this.particles[i].update(this.canvas.width, this.canvas.height);
            this.particles[i].draw(this.ctx, this.particleColor);

             for (let j = i; j < this.particles.length; j++) {
                 const distance = Math.sqrt(
                     (this.particles[i].x - this.particles[j].x) ** 2 +
                     (this.particles[i].y - this.particles[j].y) ** 2
                 );
                 if (distance < this.maxLineDistance) {
                     this.ctx.strokeStyle = this.lineColor;
                     this.ctx.lineWidth = 0.5;
                     this.ctx.beginPath();
                     this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                     this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                     this.ctx.stroke();
                 }
             }
        }

        requestAnimationFrame(() => this.animate());
    }
}

// --- アニメーションの開始 ---
// メインコンテンツ背景用アニメーションを開始
// CanvasのIDは 'mainBackgroundCanvas'
const mainBackgroundAnimation = new CanvasAnimation('mainBackgroundCanvas', 'rgba(0, 0, 0, 0.25)', 60, 120, 'rgba(0, 0, 0, 0.1)'); // 例: 薄い黒っぽい点と線


// script.js

// ... CanvasAnimation クラスの定義とアニメーション開始コードはそのまま ...


// -------- ポップアップ機能のJavaScript --------

// アーティストと曲のデータを定義
// data-artist-id と一致するようにキーを設定
const artistSongData = {
    "mrsgreenapple": {
        name: "Mrs.GREEN APPLE",
        songs: ["familie", "アンラブレス", "ビターバカンス", "lovin'","WanteD!WanteD!"] // 例: 好きな曲リスト
    },
    "sumika": {
        name: "sumika",
        songs: ["ファンファーレ", "Shake & Shake", "フィクション", "運命","「伝言歌」"] // 例: 好きな曲リスト
    },
    "macaroniempitsu": {
        name: "マカロニえんぴつ",
        songs: ["ワンドリンク別", "リンジュー・ラヴ", "ブルーベリー・ナイツ","洗濯機と君とラヂオ","ハッピーへの期待は"] // 例
    },
     "neguse": {
        name: "ねぐせ。",
        songs: ["グッドな音楽を", "スーパー愛したい", "アタシのドレス","タイムマシンにのって","片手にビール"] // 例
    },
     "shytaipei": {
        name: "シャイトープ",
        songs: ["ランデヴー", "tengoku", "pink","ミックスジュース","桃源郷"] // 例
    },
     "marcy": {
        name: "マルシィ",
        songs: ["ラブソング", "雫", "ワスレナグサ","未来図","Romance"] // 例
    },
    "mrchildren": {
        name: "超特急",
        songs: ["a kind of love", "バッタマン", "キャラメルハート","NINE LIVES","Call My Name",] // 例
    },
    "radwimps": {
        name: "RADWIMPS",
        songs: ["'I'Novel", "告白", "いえない","透明人間18号","サイハテアイニ","One man live"] // 例
    },
    // 他のアーティストのデータをここに追加
};


// 必要な要素を取得
const songPopup = document.getElementById('song-popup');
const popupArtistName = document.getElementById('popup-artist-name');
const popupSongList = document.getElementById('popup-song-list');
const closeButton = document.querySelector('.close-button');
const artistButtons = document.querySelectorAll('.artist-button'); // 全てのアーティストボタンを取得


// アーティストボタンがクリックされたときの処理
artistButtons.forEach(button => {
    button.addEventListener('click', () => {
        const artistId = button.dataset.artistId; // data-artist-id を取得
        const artistData = artistSongData[artistId]; // IDを使ってデータからアーティスト情報を取得

        if (artistData) {
            // ポップアップにアーティスト名を設定
            popupArtistName.textContent = artistData.name;

            // ポップアップに曲リストを設定
            popupSongList.innerHTML = ''; // 一旦リストをクリア
            artistData.songs.forEach(song => {
                const li = document.createElement('li');
                li.textContent = song;
                popupSongList.appendChild(li);
            });

            // ポップアップを表示
            songPopup.style.display = 'block';
            // body にクラスを追加してスクロールを無効化
            document.body.classList.add('modal-open');
        }
    });
});


// 閉じるボタンがクリックされたときの処理
closeButton.addEventListener('click', () => {
    songPopup.style.display = 'none';
    // body からクラスを削除してスクロールを有効化
    document.body.classList.remove('modal-open');
});

// ポップアップの外側がクリックされたときに閉じる処理
window.addEventListener('click', (event) => {
    if (event.target === songPopup) {
        songPopup.style.display = 'none';
         document.body.classList.remove('modal-open');
    }
});

// -------- ポップアップ機能のJavaScriptここまで --------