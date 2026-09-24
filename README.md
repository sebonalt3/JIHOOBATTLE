# 지후배틀

GitHub Pages: `https://sebonalt3.github.io/JIHOOBATTLE/`

저장소 루트의 `index.html`이 게임 진입점입니다. 같은 위치에 `character-balance.js`, `firebase-config.js`, `firebase-online.js`와 `portraits/` 폴더를 함께 배포합니다. 별도 빌드 과정은 없으며, 정적 파일을 제공하는 웹 서버나 GitHub Pages에서 열 수 있습니다. 게임 기록은 브라우저에 저장되고 Firebase 계정을 연결한 경우 Firestore에도 백업됩니다.

## 릴리스 관리

현재 버전은 **3.0**입니다. 릴리스마다 담당자가 `index.html`의 문서 제목, 로비 버전 배지·요약, `PATCH_NOTES`의 최신 항목을 함께 업데이트합니다. 자동으로 버전 이름이나 패치노트를 생성하지 않습니다. 캐릭터 수치는 `character-balance.js`, 희귀도와 뽑기 가중치 및 특수 전투 동작은 `index.html`, 초상화는 `portraits/`에서 관리합니다.

v2.3.5에는 신규 지후 9기(사신·연막·충전·탄핵·폭탄·드래곤·메테오·블리자드·빔), 등급·밸런스와 뽑기 가중치 조정, 초상화 별도 파일 배포가 포함됩니다. 전체 내역은 게임 안의 **패치노트**에서 확인할 수 있습니다.

## Firebase 온라인 기능 활성화

`firebase-config.js`에 `jihoobattle` 프로젝트의 웹 앱 설정이 들어 있습니다. 이 파일은 `index.html`의 `<body>` 마지막에서 `firebase-online.js`보다 먼저 읽히고, `firebase-online.js`가 Firebase SDK를 불러와 앱을 초기화합니다. Firebase 콘솔 예시의 `<script type="module">`를 추가로 붙이면 중복 초기화가 일어나므로 붙여넣지 마세요. **실제 온라인 기능을 쓰려면 콘솔에서 인증 방식과 Firestore를 별도로 활성화해야 합니다.** 관리용 서비스 계정이나 복구 키는 파일에 저장하지 마세요.

1. `jihoobattle` 프로젝트의 Firebase Authentication에서 **이메일/비밀번호** 로그인 방식을 활성화하고 Cloud Firestore 데이터베이스를 생성합니다. 웹 API 키는 공개 클라이언트 설정이지 백업용 비밀 키가 아닙니다.
2. Firebase 콘솔의 Firestore Database → 규칙에서 **이 저장소의 `firestore.rules` 전체**를 게시합니다. 예전에 사용한 다른 게임의 규칙을 붙여넣지 마세요. CLI를 쓴다면 해당 프로젝트로 `firebase deploy --only firestore:rules --project <프로젝트-ID>`를 실행할 수 있습니다. 배포 전에는 온라인 기록 쓰기가 거부될 수 있습니다.
3. 페이지를 다시 열어 닉네임을 입력하면 온라인 계정 생성 시 4자리 비공개 UID와 **별도의 32자 복구 키**가 한 번 표시됩니다. 둘을 안전하게 따로 보관하세요. 기존에 닉네임을 만든 사람은 프로필 → 온라인 계정 만들기로 등록합니다. 백업은 게임 기록 변경 후 자동으로 시도되며 프로필의 **지금 백업**으로 재시도할 수 있습니다.
4. 다른 브라우저에서 복구할 때는 첫 화면의 **기존 UID와 복구 키로 이어하기**를 이용합니다. UID만으로는 절대 복원할 수 없습니다. Firebase Authentication의 내부 사용자 ID는 4자리 UID와 다르며, 내부 ID를 리더보드 문서 키로 사용합니다. 백업은 로그인한 본인만 읽고 쓸 수 있습니다.

4자리 숫자는 경우의 수가 작아 그 자체로는 비밀 인증 수단이 아닙니다. 복구 키를 공개하거나 잃어버리지 마세요. 복구 키는 자동으로 재표시되지 않으며, 현재 이메일 재설정 수단도 없습니다. UID는 1000~9999 범위에서 신규 계정마다 하나씩 배정하므로 전체 계정 수에도 한계가 있습니다. 공개 리더보드에는 UID·복구 키·백업 내용이 포함되지 않습니다. **리더보드 수치는 클라이언트가 업로드하므로 조작 방지까지 보장하지는 않습니다.** 이를 보장하려면 서버에서 전투 결과를 검증하는 별도 기능이 필요합니다.

GitHub Pages는 현재 작업 브랜치 `coderabbit/refactor-game-config-balance/ec11495e`의 `/`에서 배포하도록 설정되어 있습니다. 다른 브랜치에서 배포하려면 GitHub 저장소의 **Settings → Pages**에서 소스 브랜치를 변경해야 합니다.

`jihoobattle-editable-fixed/`는 이전의 수정용 게임 사본으로, 현재 Pages 진입점에는 사용하지 않습니다.
