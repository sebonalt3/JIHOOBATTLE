(function () {
  'use strict';

  const config = window.JIHOO_FIREBASE_CONFIG;
  let auth;
  let database;
  let sdk;
  let callbacks;
  let saveTimer;
  let lastSave = Promise.resolve();

  const codeEmail = code => `${code}@jihoo-battle.invalid`;
  const randomCode = () => String(1000 + crypto.getRandomValues(new Uint32Array(1))[0] % 9000);
  const randomKey = () => btoa(String.fromCharCode(...crypto.getRandomValues(new Uint8Array(24))))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  const status = message => { if (callbacks) callbacks.onStatus(message); };

  function code() {
    const match = auth && auth.currentUser && auth.currentUser.email &&
      auth.currentUser.email.match(/^([1-9][0-9]{3})@jihoo-battle\.invalid$/);
    return match ? match[1] : null;
  }

  async function init(handlers) {
    callbacks = handlers;
    if (!config || !config.apiKey || !config.projectId || !config.appId || !config.authDomain) {
      status('온라인 설정 전 · 이 브라우저에만 기록됩니다');
      return;
    }
    try {
      const version = '12.19.0';
      const [appModule, authModule, firestoreModule] = await Promise.all([
        import(`https://www.gstatic.com/firebasejs/${version}/firebase-app.js`),
        import(`https://www.gstatic.com/firebasejs/${version}/firebase-auth.js`),
        import(`https://www.gstatic.com/firebasejs/${version}/firebase-firestore.js`)
      ]);
      sdk = { ...authModule, ...firestoreModule };
      const app = appModule.initializeApp(config);
      auth = authModule.getAuth(app);
      database = firestoreModule.getFirestore(app);
      if (['localhost', '127.0.0.1'].includes(location.hostname) && window.JIHOO_FIREBASE_EMULATORS) {
        authModule.connectAuthEmulator(auth, window.JIHOO_FIREBASE_EMULATORS.auth, { disableWarnings: true });
        firestoreModule.connectFirestoreEmulator(database, window.JIHOO_FIREBASE_EMULATORS.host, window.JIHOO_FIREBASE_EMULATORS.port);
      }
      await auth.authStateReady();
      if (auth.currentUser) {
        if (!handlers.getProfile().nickname) await restoreCurrent();
        status(`온라인 연결됨 · 비공개 UID ${code()}`);
      } else {
        status('온라인 미연결 · 계정을 만들거나 UID와 복구 키로 로그인하세요');
      }
    } catch (error) {
      status('온라인 연결 실패 · Firebase 설정과 네트워크를 확인하세요');
    }
  }

  async function createAccount() {
    if (!auth) throw new Error('Firebase 연결을 먼저 확인하세요.');
    if (auth.currentUser) throw new Error('이미 온라인 계정에 연결되어 있습니다.');
    if (!callbacks.getProfile().nickname) throw new Error('닉네임을 먼저 정하세요.');
    for (let attempt = 0; attempt < 30; attempt++) {
      const privateCode = randomCode();
      const recoveryKey = randomKey();
      try {
        await sdk.createUserWithEmailAndPassword(auth, codeEmail(privateCode), recoveryKey);
        status(`온라인 연결됨 · 비공개 UID ${privateCode}`);
        await saveNow();
        await publish();
        return { code: privateCode, recoveryKey };
      } catch (error) {
        if (error.code === 'auth/email-already-in-use') continue;
        if (auth.currentUser) {
          return { code: privateCode, recoveryKey, warning: '계정은 생성됐지만 초기 백업에 실패했습니다. 복구 키를 보관하고 다시 백업해 주세요.' };
        }
        throw new Error('온라인 계정을 만들 수 없습니다. 인증 설정을 확인하세요.');
      }
    }
    throw new Error('사용 가능한 번호를 배정하지 못했습니다. 잠시 후 다시 시도하세요.');
  }

  async function recoverAccount(privateCode, recoveryKey) {
    if (!auth) throw new Error('Firebase 연결을 먼저 확인하세요.');
    if (!/^[1-9][0-9]{3}$/.test(privateCode) || !recoveryKey) throw new Error('UID와 복구 키를 확인하세요.');
    clearTimeout(saveTimer);
    try {
      await sdk.signInWithEmailAndPassword(auth, codeEmail(privateCode), recoveryKey);
    } catch (error) {
      throw new Error('UID 또는 복구 키가 올바르지 않습니다.');
    }
    let restored;
    try {
      restored = await restoreCurrent();
    } catch (error) {
      await sdk.signOut(auth);
      throw new Error('백업을 읽을 수 없습니다. Firebase 규칙과 연결을 확인하세요.');
    }
    if (!restored) {
      await sdk.signOut(auth);
      throw new Error('해당 UID의 온라인 백업이 없습니다.');
    }
    status(`온라인 연결됨 · 비공개 UID ${privateCode}`);
  }

  async function restoreCurrent() {
    if (!auth || !auth.currentUser) throw new Error('온라인 계정에 먼저 연결하세요.');
    const snapshot = await sdk.getDoc(sdk.doc(database, 'backups', auth.currentUser.uid));
    if (!snapshot.exists()) return false;
    const payload = JSON.parse(snapshot.data().payload);
    if (!payload || typeof payload !== 'object' || Array.isArray(payload)) throw new Error('백업 데이터 형식이 올바르지 않습니다.');
    callbacks.onRestore(payload);
    return true;
  }

  async function saveNow() {
    if (!auth || !auth.currentUser) return;
    clearTimeout(saveTimer);
    const userId = auth.currentUser.uid;
    const payload = JSON.stringify(callbacks.getProfile());
    if (payload.length > 100000) throw new Error('백업 데이터가 너무 큽니다.');
    lastSave = lastSave.catch(() => {}).then(async () => {
      if (auth.currentUser?.uid !== userId) return;
      await sdk.setDoc(sdk.doc(database, 'backups', userId), {
        payload, updatedAt: sdk.serverTimestamp()
      });
      if (auth.currentUser?.uid === userId) status(`온라인 연결됨 · 비공개 UID ${code()} · 백업 완료`);
    });
    return lastSave;
  }

  function queueSave() {
    if (!auth || !auth.currentUser) return;
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => saveNow().catch(() => status('백업 실패 · 연결을 확인하고 다시 저장해 주세요')), 900);
  }

  async function publish() {
    if (!auth || !auth.currentUser) return;
    const profile = callbacks.getProfile();
    if (!profile.nickname) return;
    const counts = profile.useCount || {};
    const favorite = Object.keys(counts).filter(id => /^[a-z_]{1,24}$/.test(id))
      .sort((first, second) => counts[second] - counts[first])[0] || '';
    await sdk.setDoc(sdk.doc(database, 'leaderboard', auth.currentUser.uid), {
      nickname: profile.nickname,
      level: Math.min(100, Math.max(1, Number(callbacks.getLevel()) || 1)),
      deck: (profile.lastDeck || []).filter(id => /^[a-z_]{1,24}$/.test(id)).slice(0, 5),
      wins: Math.min(99999, Math.max(0, Math.floor(Number(profile.wins) || 0))),
      losses: Math.min(99999, Math.max(0, Math.floor(Number(profile.losses) || 0))),
      playMs: Math.min(315360000000, Math.max(0, Math.floor(Number(profile.playMs) || 0))),
      favorite, updatedAt: sdk.serverTimestamp()
    });
  }

  async function leaderboard() {
    if (!database) throw new Error('Firebase 연결 전에는 리더보드를 볼 수 없습니다.');
    const results = await sdk.getDocs(sdk.query(sdk.collection(database, 'leaderboard'), sdk.orderBy('level', 'desc'), sdk.limit(50)));
    return results.docs.map(entry => ({ id: entry.id, ...entry.data() }));
  }

  window.JihooOnline = { init, code, createAccount, recoverAccount, restoreCurrent, saveNow, queueSave, publish, leaderboard,
    connected: () => !!(auth && auth.currentUser), enabled: () => !!auth };
})();
