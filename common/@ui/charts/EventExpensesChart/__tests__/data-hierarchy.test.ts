import { hierarchy, treemap } from 'd3-hierarchy';
import { describe, expect, test } from 'vitest';

describe('data-hierarchy', () => {
  test('should convert data to hierarchy data', () => {
    const root: Node = { name: 'root', children: [] };

    let i: number = data.length;
    while (--i >= 0) {
      const { category, amount } = data[i];
      const steps = category.split('/');

      let selection: Node = root;

      let j: number = -1;
      const max: number = steps.length;
      while (++j < max) {
        const step = steps[j];

        if (!selection.children) {
          selection.children = [];
        }

        let child = selection.children.find((c) => c.name === step);
        if (!child) {
          child = { name: step, children: [] };
          selection.children.push(child);
        }
        selection = child;
      }

      selection.value = (selection?.value ?? 0) + amount;
    }

    const hierarchyNode = hierarchy(root).sum((d) => d?.value ?? 0);
    const tree = treemap<Node>().size([600, 300]).round(true)(hierarchyNode);

    const blocks = tree.descendants().filter(({ depth }) => depth > 0);

    expect(blocks).toHaveLength(17);
  });
});

interface Source {
  date: string;
  category: string;
  description?: string;
  amount: number;
  event?: string;
}

type Node = { name: string; children?: Node[]; value?: number };

const data: Source[] = [
  {
    date: '2022-08-31',
    category: '패션/의류',
    description: '배럴 수영복',
    amount: 38_300,
    event: '22년 제주 여행',
  },
  {
    date: '2022-09-10',
    category: '여행',
    description: '목포-제주 선박',
    amount: 295_920,
    event: '22년 제주 여행',
  },
  {
    date: '2022-09-17',
    category: '패션/의류',
    description: '무신사 배럴 래시가드',
    amount: 121_052,
    event: '22년 제주 여행',
  },
  {
    date: '2022-09-26',
    category: '식비/외식',
    description: '퀸제누비아 파리바게뜨',
    amount: 6350,
    event: '22년 제주 여행',
  },
  {
    date: '2022-09-26',
    category: '교통/주유',
    description: '주유',
    amount: 47_996,
    event: '22년 제주 여행',
  },
  {
    date: '2022-09-26',
    category: '식비/카페',
    description: '휴게소 커피',
    amount: 2100,
    event: '22년 제주 여행',
  },
  {
    date: '2022-09-27',
    category: '식비/카페',
    description: '차생활 냉차',
    amount: 7000,
    event: '22년 제주 여행',
  },
  {
    date: '2022-09-27',
    category: '여행',
    description: '제주 환상숲 곶자왈공원',
    amount: 5000,
    event: '22년 제주 여행',
  },
  {
    date: '2022-09-27',
    category: '식비/외식',
    description: '한림칼국수',
    amount: 10_000,
    event: '22년 제주 여행',
  },
  {
    date: '2022-09-27',
    category: '술',
    description: '편의점 맥주',
    amount: 8400,
    event: '22년 제주 여행',
  },
  {
    date: '2022-09-27',
    category: '식비/외식',
    description: '올레시장 오메기떡',
    amount: 6000,
    event: '22년 제주 여행',
  },
  {
    date: '2022-09-27',
    category: '술',
    description: '올레시장 롤카츠',
    amount: 10_000,
    event: '22년 제주 여행',
  },
  {
    date: '2022-09-27',
    category: '식비/별식',
    description: '이시돌목장 우유부단 아이스크림',
    amount: 4500,
    event: '22년 제주 여행',
  },
  {
    date: '2022-09-27',
    category: '식비/외식',
    description: '똣똣라면',
    amount: 8000,
    event: '22년 제주 여행',
  },
  {
    date: '2022-09-27',
    category: '여가/예술',
    description: '미술관',
    amount: 2000,
    event: '22년 제주 여행',
  },
  {
    date: '2022-09-27',
    category: '교통/주차',
    description: '올레시장 주차',
    amount: 1500,
    event: '22년 제주 여행',
  },
  {
    date: '2022-09-28',
    category: '식비/카페',
    description: '카페 무로이',
    amount: 7000,
    event: '22년 제주 여행',
  },
  {
    date: '2022-09-28',
    category: '식비/외식',
    description: '제주 순메밀막국수',
    amount: 10_000,
    event: '22년 제주 여행',
  },
  {
    date: '2022-09-29',
    category: '식비/외식',
    description: '편의점 초코바',
    amount: 6000,
    event: '22년 제주 여행',
  },
  {
    date: '2022-09-29',
    category: '의료',
    description: '약국 몸살',
    amount: 4500,
    event: '22년 제주 여행',
  },
  {
    date: '2022-09-29',
    category: '식비/카페',
    description: '귤한편',
    amount: 9300,
    event: '22년 제주 여행',
  },
  {
    date: '2022-09-29',
    category: '교통/주차',
    description: '외돌개 주차장',
    amount: 2000,
    event: '22년 제주 여행',
  },
  {
    date: '2022-09-29',
    category: '여행/호텔',
    description: '머큐어 앰배서더 제주',
    amount: 440_000,
    event: '22년 제주 여행',
  },
  {
    date: '2022-09-30',
    category: '식비/외식',
    description: '외식',
    amount: 28_000,
    event: '22년 제주 여행',
  },
  {
    date: '2022-10-01',
    category: '여가/레저',
    description: '두나다이버스',
    amount: 400_000,
    event: '22년 제주 여행',
  },
  {
    date: '2022-10-01',
    category: '교통/주유',
    description: '제주 LPG 충전',
    amount: 43_956,
    event: '22년 제주 여행',
  },
  {
    date: '2022-10-01',
    category: '식비/외식',
    description: '네거리식당 갈치구이',
    amount: 56_000,
    event: '22년 제주 여행',
  },
  {
    date: '2022-10-01',
    category: '여행/호텔',
    description: '네이버 제주 펜션',
    amount: 755_000,
    event: '22년 제주 여행',
  },
  {
    date: '2022-10-01',
    category: '술',
    description: '제주 하나로마트 술',
    amount: 35_460,
    event: '22년 제주 여행',
  },
  {
    date: '2022-10-02',
    category: '식비/카페',
    description: '카페 무로이',
    amount: 7000,
    event: '22년 제주 여행',
  },
  {
    date: '2022-10-02',
    category: '식비/외식',
    description: '누이밥집',
    amount: 28_000,
    event: '22년 제주 여행',
  },
  {
    date: '2022-10-02',
    category: '술',
    description: '편의점 맥주, 과자, 라면',
    amount: 26_500,
    event: '22년 제주 여행',
  },
  {
    date: '2022-10-03',
    category: '여행',
    description: '제주 목포 배편 취소',
    amount: 3000,
    event: '22년 제주 여행',
  },
  {
    date: '2022-10-03',
    category: '술',
    description: '낭구지 횟집',
    amount: 30_000,
    event: '22년 제주 여행',
  },
  {
    date: '2022-10-03',
    category: '식비/카페',
    description: '카페물썹',
    amount: 4500,
    event: '22년 제주 여행',
  },
  {
    date: '2022-10-03',
    category: '식비/외식',
    description: '서문식당',
    amount: 9000,
    event: '22년 제주 여행',
  },
  {
    date: '2022-10-04',
    category: '여행',
    description: '제주 목포 배편',
    amount: 176_270,
    event: '22년 제주 여행',
  },
  {
    date: '2022-10-04',
    category: '여행/호텔',
    description: '아고다 제주 호텔',
    amount: 228_982,
    event: '22년 제주 여행',
  },
  {
    date: '2022-10-04',
    category: '여가/레저',
    description: '서프앤조이 예약',
    amount: 45_000,
    event: '22년 제주 여행',
  },
  {
    date: '2022-10-04',
    category: '식비/별식',
    description: '편의점 과자, 아이스크림',
    amount: 10_500,
    event: '22년 제주 여행',
  },
  {
    date: '2022-10-04',
    category: '식비/외식',
    description: '나목도식당',
    amount: 17_000,
    event: '22년 제주 여행',
  },
  {
    date: '2022-10-05',
    category: '술',
    description: '낭구지 횟집',
    amount: 40_000,
    event: '22년 제주 여행',
  },
  {
    date: '2022-10-05',
    category: '식비/카페',
    description: '인터포레스트 커피',
    amount: 5500,
    event: '22년 제주 여행',
  },
  {
    date: '2022-10-05',
    category: '여행',
    description: '비자림',
    amount: 3000,
    event: '22년 제주 여행',
  },
  {
    date: '2022-10-05',
    category: '교통/주차',
    description: '섭지코지 주차',
    amount: 2000,
    event: '22년 제주 여행',
  },
  {
    date: '2022-10-05',
    category: '식비/외식',
    description: '서문식당',
    amount: 9000,
    event: '22년 제주 여행',
  },
  {
    date: '2022-10-06',
    category: '식비/카페',
    description: '오늘은 녹차',
    amount: 5000,
    event: '22년 제주 여행',
  },
  {
    date: '2022-10-06',
    category: '식비/외식',
    description: '편의점 라면, 샌드위치',
    amount: 4900,
    event: '22년 제주 여행',
  },
  {
    date: '2022-10-06',
    category: '교통/주유',
    description: 'LPG 충전',
    amount: 39_891,
    event: '22년 제주 여행',
  },
  {
    date: '2022-10-06',
    category: '식비/외식',
    description: '한마음조림식당',
    amount: 42_000,
    event: '22년 제주 여행',
  },
  {
    date: '2022-10-07',
    category: '술',
    description: '편의점 맥주, 과자',
    amount: 27_500,
    event: '22년 제주 여행',
  },
  {
    date: '2022-10-07',
    category: '생활비',
    description: '편의점 차키 배터리',
    amount: 8300,
    event: '22년 제주 여행',
  },
  {
    date: '2022-10-08',
    category: '여행/호텔',
    description: '라마다 함덕 호텔',
    amount: 280_000,
    event: '22년 제주 여행',
  },
  {
    date: '2022-10-08',
    category: '여가/레저',
    description: '서프앤조이',
    amount: 45_000,
    event: '22년 제주 여행',
  },
  {
    date: '2022-10-09',
    category: '식비/외식',
    description: '함덕오메기떡',
    amount: 10_000,
    event: '22년 제주 여행',
  },
  {
    date: '2022-10-09',
    category: '식비/외식',
    description: '함덕 다니쉬 베이커리',
    amount: 10_100,
    event: '22년 제주 여행',
  },
  {
    date: '2022-10-09',
    category: '식비/외식',
    description: '은희네해장국',
    amount: 10_000,
    event: '22년 제주 여행',
  },
  {
    date: '2022-10-09',
    category: '식비/외식',
    description: '은희네해장국',
    amount: 10_000,
    event: '22년 제주 여행',
  },
  {
    date: '2022-10-09',
    category: '여가/레저',
    description: '서프앤조이',
    amount: 45_000,
    event: '22년 제주 여행',
  },
  {
    date: '2022-10-10',
    category: '식비/외식',
    description: '오드랑 베이커리',
    amount: 12_400,
    event: '22년 제주 여행',
  },
  {
    date: '2022-10-10',
    category: '식비/외식',
    description: '해녀김밥',
    amount: 17_000,
    event: '22년 제주 여행',
  },
  {
    date: '2022-10-10',
    category: '식비/외식',
    description: '함덕골목',
    amount: 11_000,
    event: '22년 제주 여행',
  },
  {
    date: '2022-10-10',
    category: '식비/카페',
    description: '함덕 빽다방',
    amount: 2000,
    event: '22년 제주 여행',
  },
  {
    date: '2022-10-11',
    category: '식비/외식',
    description: '해피누들',
    amount: 14_000,
    event: '22년 제주 여행',
  },
  {
    date: '2022-10-11',
    category: '술',
    description: '편의점 맥주',
    amount: 11_650,
    event: '22년 제주 여행',
  },
  {
    date: '2022-10-11',
    category: '술',
    description: '상상함덕',
    amount: 72_000,
    event: '22년 제주 여행',
  },
  {
    date: '2022-10-12',
    category: '식비/외식',
    description: '함덕골목',
    amount: 11_000,
    event: '22년 제주 여행',
  },
  {
    date: '2022-10-12',
    category: '술',
    description: '제주면세점 발렌타인 30년',
    amount: 450_260,
    event: '22년 제주 여행',
  },
  {
    date: '2022-10-12',
    category: '교통/주유',
    description: '주유',
    amount: 55_263,
    event: '22년 제주 여행',
  },
  {
    date: '2022-10-12',
    category: '식비/외식',
    description: '편의점 몬스터',
    amount: 2100,
    event: '22년 제주 여행',
  },
  {
    date: '2022-10-12',
    category: '식비/외식',
    description: '휴게소 라면',
    amount: 8000,
    event: '22년 제주 여행',
  },
];
