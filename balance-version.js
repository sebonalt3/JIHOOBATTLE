function createBalancePatch(baseline, current, baseVersion, characters) {
  function ordered(value) {
    if (Array.isArray(value)) return value.map(ordered);
    if (value && typeof value === 'object') {
      return Object.fromEntries(Object.keys(value).sort().map(key => [key, ordered(value[key])]));
    }
    return value;
  }

  const previous = JSON.stringify(ordered(baseline));
  const latest = JSON.stringify(ordered(current));
  if (previous === latest) return null;

  let hash = 2166136261;
  for (let index = 0; index < latest.length; index++) {
    hash = Math.imul(hash ^ latest.charCodeAt(index), 16777619);
  }
  const nextVersion = baseVersion.replace(/^(\d+\.\d+\.)(\d+)$/, (_, prefix, patch) => prefix + (Number(patch) + 1));
  const version = `${nextVersion}-b${(hash >>> 0).toString(16).padStart(8, '0')}`;
  const labels = {
    hp: '체력', atk: '공격력', atkSpeed: '공격 간격', range: '사거리', speed: '이동속도',
    shield: '쉴드', piercing: '관통', fanRadius: '부채꼴 반지름', fanAngleDeg: '부채꼴 중심각',
    healFraction: '회복 비율', skillDesc: '스킬 설명'
  };
  const escape = value => String(value).replace(/[&<>"']/g, character => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[character]);
  const display = (value, key) => {
    if (value === undefined) return '없음';
    if (typeof value === 'boolean') return value ? '켜짐' : '꺼짐';
    if (typeof value === 'number' && /(Chance|Fraction|Bonus|Penalty|Dr)$/.test(key)) return `${Math.round(value * 10000) / 100}%`;
    if (typeof value === 'number' && key === 'fanAngleDeg') return `${value}°`;
    if (typeof value === 'number' && (key === 'atkSpeed' || /(Duration|Delay|Cooldown|Time|Interval|Stun)$/.test(key))) return `${value}초`;
    return typeof value === 'object' && value !== null ? JSON.stringify(value) : String(value);
  };
  function differences(before, after, path, changes) {
    if (before && after && typeof before === 'object' && typeof after === 'object' && !Array.isArray(before) && !Array.isArray(after)) {
      for (const key of new Set([...Object.keys(before), ...Object.keys(after)])) {
        differences(before[key], after[key], [...path, key], changes);
      }
    } else if (JSON.stringify(before) !== JSON.stringify(after)) {
      const key = path[path.length - 1];
      const label = path.length === 1 ? labels[key] || key : `${path.slice(0, -1).join(' · ')} · ${labels[key] || key}`;
      changes.push(`${escape(label)}: ${escape(display(before, key))} → ${escape(display(after, key))}`);
    }
  }

  const items = [];
  const ids = new Set([...Object.keys(baseline), ...Object.keys(current)]);
  for (const id of ids) {
    const character = characters[id] || current[id] || {};
    const name = escape(character.name || id);
    const emoji = escape(character.emoji || '⚔️');
    const color = /^#[0-9a-fA-F]{3,8}$/.test(character.color || '') ? character.color : '#5c5c58';
    if (!Object.hasOwn(current, id)) {
      items.push({ emoji, name, color, tag: 'fix', desc: '설정 삭제: 해당 캐릭터의 밸런스 항목을 확인하세요.' });
      continue;
    }
    if (!Object.hasOwn(baseline, id)) {
      items.push({ emoji, name, color, tag: 'new', desc: `신규 캐릭터 · 체력 ${escape(display(current[id].hp, 'hp'))} · 공격력 ${escape(display(current[id].atk, 'atk'))}` });
      continue;
    }
    const changes = [];
    differences(baseline[id], current[id], [], changes);
    if (changes.length) items.push({ emoji, name, color, tag: 'system', desc: changes.join(' · ') });
  }

  return {
    version,
    count: items.length,
    note: { label: `v${version} 밸런스 변경`, date: '설정 변경 자동 생성', sections: [{ title: '밸런스', items }] }
  };
}
