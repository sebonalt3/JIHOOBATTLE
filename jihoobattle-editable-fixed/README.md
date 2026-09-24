# 지후배틀: 밸런스 조정 안내

이 폴더는 이전에 업로드한 게임 사본입니다. 최신 게임은 저장소 루트의 `index.html`을 여세요. 이 사본을 열 때는 상위 폴더의 `portraits/`를 함께 유지해야 합니다 (`../portraits/`). 이 폴더만 따로 내려받으면 초상화가 보이지 않습니다.

## 먼저 확인: 어떤 HTML을 열어야 하나요?

**이 폴더의 이전 버전을 수정하려면** `play-editable.html`을 여세요. 현재 배포 중인 게임은 루트의 `index.html`이며, 이 폴더의 자동 버전 생성 기능은 현재 게임에 적용되지 않습니다.

Windows 탐색기에서 확장자를 숨기면 수정용 HTML은 **`play-editable`**로 보입니다. `character-balance`를 메모장으로 열어 숫자를 바꾸고 **Ctrl+S로 저장**한 다음, 같은 폴더의 `play-editable`을 열거나 새로고침하면 됩니다. 파일 이름을 직접 바꿀 필요는 없습니다.

`play-editable.html`, `character-balance.js`, `balance-baseline.js`, `balance-version.js`를 같은 폴더에 두고 상위 폴더의 `portraits/`도 유지한 채 HTML을 브라우저로 엽니다. 서버나 빌드 과정은 필요하지 않습니다. 밸런스를 바꾸려면 **`character-balance.js`만** 열어보세요. 캐릭터 ID(`fire`, `medic` 등)를 찾아 숫자를 고친 뒤 저장하고 브라우저를 새로고침하면 적용됩니다. HTML만 따로 복사하면 설정과 초상화를 읽지 못합니다.

## 자동 버전과 패치노트

`character-balance.js`의 수치나 캐릭터를 바꾸고 브라우저를 새로고침하면, 로비의 버전과 패치노트가 **자동으로** 갱신됩니다. 패치노트 화면에는 캐릭터별 변경 전 → 변경 후 수치가 나타납니다. 변경이 없으면 원래 버전 `2.3.4`와 기존 패치노트가 그대로 보입니다.

자동 버전은 `2.3.5-bxxxxxxxx` 형식입니다. 뒤의 8자리는 현재 설정으로 계산하므로 **같은 설정은 누구에게나 같은 버전**으로 보이고, 수치를 되돌리면 기존 버전도 돌아옵니다. 편집 순서에 따라 `2.3.6`, `2.3.7`처럼 순차 증가하는 방식은 아닙니다. 패치노트는 `balance-baseline.js`에 저장된 **2.3.4 기준 수치**와 현재 설정을 비교한 누적 변경 내역이며, 이전 편집 단계별 기록을 저장하지는 않습니다. 기준 파일과 `balance-version.js`는 수정하지 마세요. 공식 새 버전을 내면서 기준 수치를 새로 정하려면 별도 릴리스 작업이 필요합니다.

별도로 배포하는 **단일 HTML 파일은 설정을 안에 넣어 만든 사본**입니다. 원본 `character-balance.js`를 바꾼 뒤에는 단일 HTML도 새 설정으로 다시 묶어 배포해야 합니다. 네 파일을 함께 열어 사용하는 원본 게임은 그런 과정 없이 새로고침만 하면 됩니다.

화면에 보이는 기존 캐릭터의 `skillDesc`는 HTML의 `CHAR_DB`에 있는 별도 문구입니다. 밸런스 수치를 바꿔도 설명 문구가 자동으로 다시 작성되지는 않으므로, 문구도 바꾸고 싶다면 해당 설명을 직접 고쳐 주세요.

## 자주 바꾸는 값

| 설정 | 뜻 | 예시 |
| --- | --- | --- |
| `hp`, `atk`, `shield` | 체력, 공격력, 쉴드 | `hp: 2500` |
| `atkSpeed` | 공격 한 번 사이의 시간(초). **작을수록** 빠름 | `atkSpeed: 1.5` |
| `range`, `speed` | 적 인식/공격 사거리, 이동 속도. 기존 45px 격자를 기준으로 입력(45 = 1칸) | `range: 180` (4칸) |
| `isMelee` | 근접 부채꼴 기본 공격 여부 | `isMelee: true` |
| `fanAngleDeg` | 부채꼴 중심각(도). 기본 근접 공격은 120° | `fanAngleDeg: 90` |
| `fanRadius` | 부채꼴 피해/회복 반지름. 생략하면 `range` 사용; 45 = 1칸 | `fanRadius: 135` (3칸) |
| `piercing` | 일반 원거리 공격이 직선상의 여러 적을 관통할지 여부. 생략하면 `false` | `piercing: true` |
| `pierceHalfWidth` | 관통 공격의 직선 양옆 폭(인게임 픽셀); 생략하면 26 | `pierceHalfWidth: 26` |
| `isHealer`, `healFraction` | 아군 회복 여부와 **최대 체력**의 회복 비율. `atkSpeed`가 회복 간격 | `isHealer: true`, `healFraction: 0.25` |

회복 캐릭터는 `fanAngleDeg`, `fanRadius`로 회복 범위를 바꿉니다. `range`는 **이동/타겟 선택**에도 쓰이고, `fanRadius`는 선택한 타겟을 기준으로 한 **실제 부채꼴 효과 범위**만 바꿉니다. `fanAngleDeg`와 `fanRadius`를 생략하면 기존 기본 근접 공격은 120°·`range`를 사용합니다. `piercing`은 **일반 원거리 공격**에만 적용되며, `isMelee`, `isHealer`, `isStreamAttacker`나 별도의 `customAttack`을 사용하는 캐릭터에는 적용되지 않습니다. 갓지후의 일반형은 이 관통 설정을 사용하지만 각성형 레이저는 별도 스킬입니다.

확률·퍼센트는 `0`~`1`로 적습니다(예: `0.35` = 35%). `burnDps`, `freezeChance`, `reviveChance`, `boltDamage`, `cloneCooldown` 등도 캐릭터별 항목에 모아 놓았습니다. `pulseRadiusPx`, `portalRadiusPx`, `pierceHalfWidth`처럼 `Px`가 붙거나 별도 폭인 항목은 **인게임 픽셀**이므로 위의 45px 격자 환산과 구별하세요. `mutant.mutantForms.fail/success`는 소환 후 변이한 모습의 수치입니다. `skillDesc`는 화면에 표시되는 **설명 문구**라서 수치를 바꾸면 설명도 직접 맞춰 주세요. 기존 캐릭터의 이름·이미지·설명은 HTML의 `CHAR_DB` 안에 있습니다.

## 캐릭터 추가하기

기본 공격만 사용하는 새 캐릭터는 `character-balance.js`의 `CHARACTER_BALANCE` **마지막 `};` 앞에** 다음 항목을 추가할 수 있습니다. 그림이 없으면 `emoji`가 표시되고, 일반 공격 이외의 특별한 스킬은 없는 캐릭터입니다.

```js
  new_hero: {
    name: '새 지후', emoji: '🌟', role: 'dealer', roleLabel: '딜러',
    rarity: 'common', color: '#ff9900',
    hp: 2000, atk: 150, atkSpeed: 1, range: 180, speed: 100,
    piercing: true,
    skillDesc: '일직선상의 적을 관통합니다.'
  },
```

바로 앞 캐릭터의 닫는 `}` 뒤에 쉼표가 있어야 합니다. ID(`new_hero`)는 다른 캐릭터와 겹치지 않게 하고, `rarity`는 `common`, `rare`, `epic`, `legend` 중 하나를 사용합니다. 신규 캐릭터는 기존 캐릭터처럼 뽑기·컬렉션 대상이 됩니다. 처음부터 계정에 지급하고 싶으면 HTML의 `STARTER_IDS`에도 ID를 추가하세요. 새로운 캐릭터는 이모지만으로 시작할 수 있지만, 초상화나 고유 기술을 추가하려면 HTML의 `PORTRAITS`와 `CHAR_DB`/전투 함수를 편집해야 합니다.

기존 캐릭터 고유 기술의 *새로운 동작*을 만들거나 변경하는 작업은 수치 조정만으로는 불가능합니다. 독 단검의 3방향 각도와 길이는 `poison.fanAngleDeg`와 `fanRadius`로 조정할 수 있지만 단검 개수와 명중 폭은 별도 로직입니다. 각성형 레이저나 돌진도 HTML에 전용 로직이 있어 일반 공격용 `piercing` 또는 `fanAngleDeg`로 모양이 바뀌지 않습니다. 수정 전 파일을 복사해 두고 한 항목씩 바꿔 보세요.
