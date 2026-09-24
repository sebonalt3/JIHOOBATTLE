# 지후배틀

GitHub Pages: `https://sebonalt3.github.io/JIHOOBATTLE/`

저장소 루트의 `index.html`이 게임 진입점입니다. 같은 위치에 `character-balance.js`와 `portraits/` 폴더를 함께 배포해야 초상화와 캐릭터 수치가 정상적으로 표시됩니다. 별도 빌드 과정은 없으며, 정적 파일을 제공하는 웹 서버나 GitHub Pages에서 바로 열 수 있습니다. 게임 기록은 브라우저에 저장됩니다.

## 릴리스 관리

현재 버전은 **2.3.5**입니다. 릴리스마다 담당자가 `index.html`의 문서 제목, 로비 버전 배지·요약, `PATCH_NOTES`의 최신 항목을 함께 업데이트합니다. 자동으로 버전 이름이나 패치노트를 생성하지 않습니다. 캐릭터 수치는 `character-balance.js`, 희귀도와 뽑기 가중치 및 특수 전투 동작은 `index.html`, 초상화는 `portraits/`에서 관리합니다.

v2.3.5에는 신규 지후 9기(사신·연막·충전·탄핵·폭탄·드래곤·메테오·블리자드·빔), 등급·밸런스와 뽑기 가중치 조정, 초상화 별도 파일 배포가 포함됩니다. 전체 내역은 게임 안의 **패치노트**에서 확인할 수 있습니다.

GitHub Pages는 현재 작업 브랜치 `coderabbit/refactor-game-config-balance/ec11495e`의 `/`에서 배포하도록 설정되어 있습니다. 다른 브랜치에서 배포하려면 GitHub 저장소의 **Settings → Pages**에서 소스 브랜치를 변경해야 합니다.

`jihoobattle-editable-fixed/`는 이전의 수정용 게임 사본으로, 현재 Pages 진입점에는 사용하지 않습니다.
