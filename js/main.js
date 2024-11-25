const container = document.querySelector('.container');
let items = Array.from(container.children);
let isScrolling = false;

function moveItems(direction) {
    if (isScrolling) return;
    isScrolling = true;

    // 現在の 'center' クラスをすべてのアイテムから削除
    items.forEach(item => item.classList.remove('center'));
    disableTilt();
    if (direction === 'right') {
        items[0].classList.add('behind');
        items.forEach((item, index) => {
            if (index === 0) {
                // 一番左の要素をスクロール方向と逆に動かす
                item.style.transform = 'translateX(540px)';
            } else if (index === 1) {
                // 真ん中の要素を左に移動させつつ拡大
                item.style.transform = 'translateX(-220px)';
                item.style.width = '200px';
                item.style.height = '200px';
            } else if (index === 2) {
                // 一番右の要素は左に動く（通常通り）
                item.style.transform = 'translateX(-220px) scale(1)';
                item.style.width = '300px';
                item.style.height = '300px';
                item.classList.add('center');
            }
        });

        setTimeout(() => {
            // 瞬時にアイテムの順番を更新して、反対側に移動させる
            const firstItem = items.shift();
            items.push(firstItem);
            resetItems();
            isScrolling = false;
        }, 500);

    } else if (direction === 'left') {
        items[2].classList.add('behind');
        items.forEach((item, index) => {
            if (index === 0) {
                // 一番左の要素を右に動かす（通常通り）
                item.style.transform = 'translateX(220px) scale(1)';
                item.style.width = '300px';
                item.style.height = '300px';
                item.classList.add('center');
            } else if (index === 1) {
                // 真ん中の要素を右に移動させつつ拡大
                item.style.transform = 'translateX(220px)';
                item.style.width = '200px';
                item.style.height = '200px';
            } else if (index === 2) {
                // 一番右の要素を逆に動かす
                item.style.transform = 'translateX(-540px)';
            }
        });

        setTimeout(() => {
            const lastItem = items.pop();
            items.unshift(lastItem);
            resetItems();
            isScrolling = false;
        }, 500);
    }
}

function resetItems() {
    items.forEach(item => {
        item.style.transition = 'none'; // 一旦 transition を無効にして位置をリセット
        item.style.transform = 'translateX(0)';
        item.classList.remove('behind');
        enableTilt();
    });

    // 順序を更新してから描画をリセット
    items.forEach(item => container.appendChild(item));

    setTimeout(() => {
        items.forEach(item => {
            item.style.transition = 'transform 0.5s ease, opacity 0.5s ease, width 0.5s ease, height 0.5s ease';
        });
    }, 500); // タイミングを遅らせて再描画を待つ
}

// スクロールイベントの処理
let scrollTimeout; // スクロールを制御するタイマー

window.addEventListener('wheel', event => {
    if (scrollTimeout) return; // スクロール中なら新しいスクロールは無視

    // スクロールの方向を判定してアイテムを移動
    if (event.deltaY > 0 ) {
        moveItems('right');
    } else if (event.deltaY < 0 ) {
        moveItems('left');
    }

    // 一度のスクロールで1回の動作だけにするため、タマーを設定
    scrollTimeout = setTimeout(() => {
        scrollTimeout = null;
    }, 1000); // スクロール感度を調整するために1秒間待機
});

// アイテムクリック・タップで中央に移動させる
items.forEach(item => {
    let isTouchEvent = false;
    //タップイベント
    item.addEventListener('touchstart', () => {
        isTouchEvent = true; //タッチイベントが発火したことを確認
        const currentIndex = items.indexOf(item);
        if (currentIndex === 0) {
            moveItems('left'); // 左端のアイテムがタップされたら左に移動
        } else if (currentIndex === 2) {
            moveItems('right'); // 右端のアイテムがタップされたら右に移動
        }
    });
    //クリックイベント
    item.addEventListener('click', (event) => {
        if (isTouchEvent) {
            event.preventDefault();
            isTouchEvent = false;
        } else {
            const currentIndex = items.indexOf(item);
            if (currentIndex === 0) {
                moveItems('left'); // 左端のアイテムがクリックされたら左に移動
            } else if (currentIndex === 2) {
                moveItems('right'); // 右端のアイテムがクリックされたら右に移動
            }
        }
    });
});

// ページ読み込み後、最初に中央のアイテムを拡大
setTimeout(() => {
    items[1].classList.add('center');
}, 500);

function disableTilt() {
    const elements = document.querySelectorAll(".content");
    elements.forEach(el => {
        el.vanillaTilt.destroy();  // Tiltを一時的に破棄
    });
}

function enableTilt() {
    VanillaTilt.init(document.querySelectorAll(".content"), {
        max: 25,
        speed: 400,
        glare: true,
    });
}