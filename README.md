# 지후배틀: 밸런스 조정 안내

## 먼저 확인: 어떤 HTML을 열어야 하나요?

**밸런스를 수정하려면 수정용 ZIP에서 압축을 푼 `play-editable.html`을 여세요.** 저장소 안의 같은 게임 원본은 `지후배틀_2_3_4.html`입니다. ZIP 안에서는 Windows에서 한글 이름이 보이지 않는 문제를 피하기 위해 영문 이름을 사용합니다. 설정을 안에 넣어 배포한 `jihoobattle.html`은 옆에 둔 `character-balance.js`를 읽지 않으므로 밸런스 수정에는 사용하지 마세요.

Windows 탐색기에서 확장자를 숨기면 수정용 HTML은 **`play-editable`**로 보입니다. `character-balance`를 메모장으로 열어 숫자를 바꾸고 **Ctrl+S로 저장**한 다음, 같은 폴더의 `play-editable`을 열거나 새로고침하면 됩니다. 파일 이름을 직접 바꿀 필요는 없습니다.

`play-editable.html`(저장소에서는 `지후배틀_2_3_4.html`), `character-balance.js`, `balance-baseline.js`, `balance-version.js`를 **같은 폴더에** 두고, 그 안에 **`portraits/` 폴더도 통째로** 둔 채 HTML을 브라우저로 엽니다. 서버나 빌드 과정은 필요하지 않습니다. 밸런스를 바꾸려면 **`character-balance.js`만** 열어보세요. 캐릭터 ID(`fire`, `medic` 등)를 찾아 숫자를 고친 뒤 저장하고 브라우저를 새로고침하면 적용됩니다. HTML만 따로 복사하면 설정과 초상화를 읽지 못합니다.

## 자동 버전과 패치노트

이번에 추가한 아홉 캐릭터는 `character-balance.js` 맨 아래의 `reaper`, `smoke`, `battery`, `impeachment`, `bomb`, `dragon`, `meteor`, `blizzard`, `beam` 항목에서 수치를 바꿀 수 있습니다. 초상화 70개는 `portraits/<이름>.png`에 각각 저장되어 있으며 게임 HTML의 `PORTRAITS`에는 상대 경로만 있습니다. 변경된 설정은 새로고침하면 버전과 패치노트에 자동 반영됩니다.

연막은 공격마다 10% 확률로 생성되고 2초간 유지됩니다. 연막 안의 적은 같은 연막 안의 아군을 볼 수 있지만, 밖의 적은 볼 수 없습니다. 드래곤은 비행 경로에 착지 후 5초까지 남는 불길을 만들며, 불길에 있는 적은 0.5초마다 250 피해를 받습니다. 빔은 8.5칸 거리에서 0.2초마다 기본 100 피해를 줍니다. 해당 수치는 `smokeChance`, `smokeDuration`, `fireTrailDuration`, `fireTrailInterval`, `fireTrailDamage`, `range`, `atk`에서 바꿀 수 있습니다.

사신·드래곤·블리자드는 전설, 메테오는 희귀, 빔은 영웅입니다. 메테오는 2초 뒤 1600 피해로 낙하하고, 블리자드는 12초마다 3.5초간 빙결시키며, 드래곤은 10칸 비행합니다. 폭탄의 사망 시 폭발 피해는 2000이며 합체 레벨마다 1.5배(2레벨 3000, 3레벨 4500)로 증가합니다. 이 수치들은 `character-balance.js`에서 바꿀 수 있지만, **희귀도와 뽑기 가중치는 게임 HTML**의 `CHAR_DB` 및 `rollGachaCharacter`에서 관리합니다. 소환 가중치는 전설 3·영웅 15·희귀 39·일반 44(총합 101)이며 실제 1회 확률은 각 가중치를 101로 나눈 값입니다. 11회 뽑기에는 영웅 이상 보장 규칙이 있어 결과가 달라질 수 있습니다.

명시되지 않은 희귀도는 **일반**으로, 이동속도는 **초당 2칸**으로 설정했습니다. 메테오의 공격 간격은 **6초**, 화상 피해는 **초당 100**, 비행 시간은 **1.5초**입니다. 사신은 첫 공격을 위해 4초 멈춰 서며 휘두른 뒤 5초를 기다립니다. 원한은 사신을 죽인 **같은 배치의 상대**가 다음 라운드에 다시 나왔을 때 적용됩니다. 아군 쿨타임 감소는 현재 남은 재사용 시간의 20%를 줄입니다. 이 값들도 설정 파일에서 바꿀 수 있습니다.

`character-balance.js`의 수치나 캐릭터를 바꾸고 브라우저를 새로고침하면, 로비의 버전과 패치노트가 **자동으로** 갱신됩니다. 패치노트 화면에는 캐릭터별 변경 전 → 변경 후 수치가 나타납니다. 변경이 없으면 원래 버전 `2.3.4`와 기존 패치노트가 그대로 보입니다.

자동 버전은 `2.3.5-bxxxxxxxx` 형식입니다. 뒤의 8자리는 현재 설정으로 계산하므로 **같은 설정은 누구에게나 같은 버전**으로 보이고, 수치를 되돌리면 기존 버전도 돌아옵니다. 편집 순서에 따라 `2.3.6`, `2.3.7`처럼 순차 증가하는 방식은 아닙니다. 패치노트는 `balance-baseline.js`에 저장된 **2.3.4 기준 수치**와 현재 설정을 비교한 누적 변경 내역이며, 이전 편집 단계별 기록을 저장하지는 않습니다. 기준 파일과 `balance-version.js`는 수정하지 마세요. 공식 새 버전을 내면서 기준 수치를 새로 정하려면 별도 릴리스 작업이 필요합니다.

설정을 안에 넣어 배포하는 **HTML 사본에도 이제 `portraits/` 폴더가 필요합니다.** 원본 `character-balance.js`를 바꾼 뒤에는 그 HTML도 새 설정으로 다시 묶어 배포해야 합니다. 저장소의 원본 게임은 설정 파일과 초상화 폴더를 함께 두면 새로고침만 하면 됩니다.

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

확률·퍼센트는 `0`~`1`로 적습니다(예: `0.35` = 35%). `burnDps`, `freezeChance`, `reviveChance`, `boltDamage`, `cloneCooldown` 등도 캐릭터별 항목에 모아 놓았습니다. `pulseRadiusPx`, `portalRadiusPx`, `pierceHalfWidth`처럼 `Px`가 붙거나 별도 폭인 항목은 **인게임 픽셀**이므로 위의 45px 격자 환산과 구별하세요. `mutant.mutantForms.fail/success`는 소환 후 변이한 모습의 수치입니다. `skillDesc`는 화면에 표시되는 **설명 문구**라서 수치를 바꾸면 설명도 직접 맞춰 주세요. 캐릭터의 이름·초상화 경로·설명은 HTML의 `CHAR_DB`/`PORTRAITS` 안에 있고, 실제 이미지 파일은 `portraits/`에 있습니다.

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

바로 앞 캐릭터의 닫는 `}` 뒤에 쉼표가 있어야 합니다. ID(`new_hero`)는 다른 캐릭터와 겹치지 않게 하고, `rarity`는 `common`, `rare`, `epic`, `legend` 중 하나를 사용합니다. 신규 캐릭터는 기존 캐릭터처럼 뽑기·컬렉션 대상이 됩니다. 처음부터 계정에 지급하고 싶으면 HTML의 `STARTER_IDS`에도 ID를 추가하세요. 새로운 캐릭터는 이모지만으로 시작할 수 있지만, 초상화를 추가하려면 `portraits/new_hero.png`를 저장하고 HTML의 `PORTRAITS`/`CHAR_DB`에서 참조하세요. 고유 기술은 별도 전투 함수가 필요합니다.

기존 캐릭터 고유 기술의 *새로운 동작*을 만들거나 변경하는 작업은 수치 조정만으로는 불가능합니다. 독 단검의 3방향 각도와 길이는 `poison.fanAngleDeg`와 `fanRadius`로 조정할 수 있지만 단검 개수와 명중 폭은 별도 로직입니다. 각성형 레이저나 돌진도 HTML에 전용 로직이 있어 일반 공격용 `piercing` 또는 `fanAngleDeg`로 모양이 바뀌지 않습니다. 수정 전 파일을 복사해 두고 한 항목씩 바꿔 보세요.
