document.addEventListener('DOMContentLoaded', function() {
    // DOM要素の取得
    // ヘッダー要素
    const header = document.querySelector('.header');
    const platformButtons = document.querySelector('.platform__buttons');
    const menuButton = document.querySelector('.header__menu-btn') || document.createElement('button');
    const mobileMenu = document.querySelector('.mobile-menu') || document.createElement('div');
    
    // アニメーション要素
    const animateElements = document.querySelectorAll('.animate');
    
    // FAQ要素
    const faqQuestions = document.querySelectorAll('.faq-item__question');
    
    // スキルタブ関連
    const skillsTabs = document.querySelectorAll('.skills__tab');
    const skillsContents = document.querySelectorAll('.skills__content');
    const prevButton = document.querySelector('.skills__nav-button--prev');
    const nextButton = document.querySelector('.skills__nav-button--next');
    
    // 戻るボタン
    const backToTopBtn = document.getElementById('backToTopBtn');
    
    // フォーム要素
    const contactForm = document.querySelector('.contact-form');
    const submitButton = contactForm ? contactForm.querySelector('.contact-form__submit-button') : null;
    const nameInput = contactForm ? contactForm.querySelector('input[type="text"]') : null;
    const emailInput = contactForm ? contactForm.querySelector('input[type="email"]') : null;
    const messageInput = contactForm ? contactForm.querySelector('textarea') : null;
    const privacyCheckbox = document.getElementById('privacy-policy');

    // スキルタブ管理変数
    let currentTabIndex = 0;
    const tabs = ['web-dev', 'web-design', 'web-marketing'];
    
    // タッチスワイプ関連の変数
    let touchStartX = 0;
    let touchEndX = 0;
    
    // メニュー状態
    let isMenuOpen = false;

    // ==================== ユーティリティ関数 ====================
    
    // throttle関数 - スクロールイベントなどの発火頻度を制限
    function throttle(func, limit = 100) {
        let lastFunc;
        let lastRan;
        return function() {
            const context = this;
            const args = arguments;
            if (!lastRan) {
                func.apply(context, args);
                lastRan = Date.now();
            } else {
                clearTimeout(lastFunc);
                lastFunc = setTimeout(function() {
                    if ((Date.now() - lastRan) >= limit) {
                        func.apply(context, args);
                        lastRan = Date.now();
                    }
                }, limit - (Date.now() - lastRan));
            }
        };
    }
    
    // ブレイクポイント検出関数
    function isMobile() {
        return window.innerWidth < 768;
    }
    
    // ==================== 表示制御関数 ====================
    
    // スクロール位置に応じてヘッダーとバックトップボタンの表示制御
    function handleScroll() {
        const scrollPosition = window.scrollY || window.pageYOffset;
        
        // ヘッダー制御
        if (platformButtons) {
            const platformButtonsRect = platformButtons.getBoundingClientRect();
            const platformButtonsPosition = platformButtonsRect.top + scrollPosition;
            
            if (scrollPosition >= platformButtonsPosition) {
                header.classList.add('visible');
            } else {
                header.classList.remove('visible');
            }
        }
        
        // トップに戻るボタン制御
        if (backToTopBtn) {
            if (scrollPosition > 300) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        }
    }
    
    // モバイルメニューの開閉
    function toggleMobileMenu() {
        if (isMenuOpen) {
            mobileMenu.classList.remove('active');
            menuButton.classList.remove('active');
        } else {
            mobileMenu.classList.add('active');
            menuButton.classList.add('active');
        }
        isMenuOpen = !isMenuOpen;
    }
    
    // モバイルメニュー閉じる
    function closeMobileMenu() {
        if (isMenuOpen) {
            mobileMenu.classList.remove('active');
            menuButton.classList.remove('active');
            isMenuOpen = false;
        }
    }
    
    // ==================== スキルタブ関連関数 ====================
    
    // タブ有効化関数
    function activateTab(tabId) {
        // タブのアクティブ状態切替
        skillsTabs.forEach(tab => {
            const isActive = tab.getAttribute('data-tab') === tabId;
            if (isActive) {
                tab.classList.add('skills__tab--active');
            } else {
                tab.classList.remove('skills__tab--active');
            }
        });
        
        // コンテンツ表示切替（フェードアニメーション追加）
        skillsContents.forEach(content => {
            const isActive = content.id === `${tabId}-content`;
            
            if (isActive) {
                content.style.opacity = '0';
                content.style.display = 'block';
                
                setTimeout(() => {
                    content.style.opacity = '1';
                    content.classList.add('skills__content--active');
                }, 50);
            } else {
                content.style.opacity = '0';
                setTimeout(() => {
                    content.style.display = 'none';
                    content.classList.remove('skills__content--active');
                }, 300);
            }
        });
    }
    
    // タブ初期化
    function initializeTabs() {
        skillsContents.forEach((content, index) => {
            if (index === 0) {
                content.classList.add('skills__content--active');
                content.style.display = 'block';
                content.style.opacity = '1';
            } else {
                content.classList.remove('skills__content--active');
                content.style.display = 'none';
            }
        });
        
        skillsTabs.forEach((tab, index) => {
            if (index === 0) {
                tab.classList.add('skills__tab--active');
            } else {
                tab.classList.remove('skills__tab--active');
            }
        });
    }
    
    // 次のタブに移動
    function nextTab() {
        currentTabIndex = (currentTabIndex + 1) % tabs.length;
        activateTab(tabs[currentTabIndex]);
    }
    
    // 前のタブに移動
    function prevTab() {
        currentTabIndex = (currentTabIndex - 1 + tabs.length) % tabs.length;
        activateTab(tabs[currentTabIndex]);
    }
    
    // ==================== フォーム関連関数 ====================
    
    // フォームエラー表示
    function showError(input, message) {
        const parent = input.parentElement;
        let errorElement = parent.querySelector('.contact-form__error');
        
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'contact-form__error';
            parent.appendChild(errorElement);
        }
        
        errorElement.textContent = message;
        errorElement.style.display = 'block';
        input.classList.add('is-invalid');
        input.classList.remove('is-valid');
    }
    
    // フォームエラークリア
    function clearError(input) {
        const parent = input.parentElement;
        const errorElement = parent.querySelector('.contact-form__error');
        
        if (errorElement) {
            errorElement.style.display = 'none';
        }
        
        input.classList.remove('is-invalid');
        input.classList.add('is-valid');
    }
    
    // メール形式バリデーション
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // ==================== イベントリスナー設定 ====================

    // Intersection Observerによるアニメーション要素検出
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = 1;
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px' // より早くトリガー
    });
    
    // アニメーション要素を監視対象に追加
    animateElements.forEach(element => {
        observer.observe(element);
    });

    // スクロールイベントリスナー
    window.addEventListener('scroll', throttle(handleScroll, 100));
    
    // 初回ロード時のスクロール位置チェック
    handleScroll();
    
    // リサイズイベントリスナー
    window.addEventListener('resize', throttle(function() {
        handleScroll();
        
        // モバイルからデスクトップに切り替わった時、モバイルメニュー閉じる
        if (!isMobile() && isMenuOpen) {
            closeMobileMenu();
        }
    }, 150));

    // トップに戻るボタンクリックイベント
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // モバイルメニューボタンクリックイベント
    if (menuButton && menuButton.tagName) {
        menuButton.addEventListener('click', toggleMobileMenu);
    }
    
    // モバイルメニューリンククリックでメニュー自動クローズ
    document.querySelectorAll('.mobile-menu__nav-item').forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });

    // FAQ切り替えイベント
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const answer = this.nextElementSibling;
            const toggle = this.querySelector('.faq-item__toggle');
            
            if (answer.classList.contains('active')) {
                answer.classList.remove('active');
                toggle.classList.remove('active');
            } else {
                // 他の開いているFAQを閉じる
                document.querySelectorAll('.faq-item__answer.active').forEach(item => {
                    if (item !== answer) {
                        item.classList.remove('active');
                        item.previousElementSibling.querySelector('.faq-item__toggle').classList.remove('active');
                    }
                });
                
                answer.classList.add('active');
                toggle.classList.add('active');
            }
        });
    });

    // タブの初期化とイベント設定
    initializeTabs();
    
    // タブクリックイベント
    skillsTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            currentTabIndex = tabs.indexOf(tabId);
            activateTab(tabId);
        });
    });
    
    // 前へ/次へボタンイベント
    if (prevButton && nextButton) {
        prevButton.addEventListener('click', prevTab);
        nextButton.addEventListener('click', nextTab);
    }
    
    // スキルタブ領域のタッチイベント（スワイプ対応）
    const skillsContentWrapper = document.querySelector('.skills__content-wrapper');
    
    if (skillsContentWrapper) {
        // タッチ開始時座標記録
        skillsContentWrapper.addEventListener('touchstart', function(e) {
            touchStartX = e.touches[0].clientX;
        }, false);
        
        // タッチ終了時にスワイプ検出
        skillsContentWrapper.addEventListener('touchend', function(e) {
            touchEndX = e.changedTouches[0].clientX;
            handleSwipe();
        }, false);
    }
    
    // スワイプ判定と処理
    function handleSwipe() {
        // スワイプ距離（ピクセル）が十分あるか確認
        if (touchStartX - touchEndX > 50) {
            // 右から左へのスワイプ（次へ）
            nextTab();
        } else if (touchEndX - touchStartX > 50) {
            // 左から右へのスワイプ（前へ）
            prevTab();
        }
    }

    // スムーススクロール
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // アドレスバーの高さやヘッダーの高さを考慮したオフセット
                const offset = header.classList.contains('visible') ? 80 : 20;
                
                window.scrollTo({
                    top: targetElement.offsetTop - offset,
                    behavior: 'smooth'
                });
                
                // モバイルメニューが開いていたら閉じる
                closeMobileMenu();
            }
        });
    });

    // フォームバリデーション
    if (contactForm && submitButton) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            let isValid = true;
            
            // 送信ボタンの状態を更新
            const originalText = submitButton.textContent;
            submitButton.textContent = '送信中...';
            submitButton.disabled = true;
            
            // 名前チェック
            if (!nameInput.value.trim()) {
                showError(nameInput, 'お名前を入力してください');
                isValid = false;
            } else {
                clearError(nameInput);
            }
            
            // メールチェック
            if (!emailInput.value.trim()) {
                showError(emailInput, 'メールアドレスを入力してください');
                isValid = false;
            } else if (!isValidEmail(emailInput.value)) {
                showError(emailInput, '正しいメールアドレスを入力してください');
                isValid = false;
            } else {
                clearError(emailInput);
            }
            
            // メッセージチェック
            if (!messageInput.value.trim()) {
                showError(messageInput, 'ご相談内容を入力してください');
                isValid = false;
            } else {
                clearError(messageInput);
            }
            
            // プライバシーポリシーチェック
            if (!privacyCheckbox.checked) {
                alert('プライバシーポリシーに同意してください');
                isValid = false;
            }
            
            if (isValid) {
                // フォーム送信シミュレーション（実際の実装では、ここでAjax送信などを行う）
                setTimeout(() => {
                    alert('お問い合わせありがとうございます。担当者より連絡いたします。');
                    contactForm.reset();
                    submitButton.textContent = originalText;
                    submitButton.disabled = false;
                }, 1000);
            } else {
                // エラーがあればボタンを元に戻す
                submitButton.textContent = originalText;
                submitButton.disabled = false;
            }
        });
    }
    
    // ブラウザの戻る/進むボタン押下時の対応
    window.addEventListener('popstate', function() {
        // モバイルメニューが開いていたら閉じる
        closeMobileMenu();
    });
});