# 표현과 데이터 연결의 분리

```tsx
// 공통 컴포넌트로 빼기 (appkit)
function usd<T>(
  fn: (value: T) => USDColumn,
  options?: Omit<Column<T>, 'renderCell'>,
): Column<T> {
  return {
    renderCell: (value: T) => {
      const columnValue = fn(value);
      return <Format n={columnValue} />;
    },
    ...options,
  };
}

// 화면 내에 선언 (perspectives/daysGain.ts)
function daysGain<Row>(): GridPerspective<Row> {
  return {
    columns: [
      symbol<Row>(({ symbol }) => symbol),
      usd<Row>(({ quote }) => quote.price),
    ],
    sort: (a, b) => {
      return (a.quote?.changePercent ?? 0) - (b.quote?.changePercent ?? 0);
    },
  };
}

export const gridPerspectives = {
  daysGain,
};

// 실제 사용 화면 (pages/*.tsx)
const [perspective, setPerspective] = useLocalStorage(
  'perspective',
  'daysGain',
);

<GridPerspectives<Row> onChange={setPerspective}>
  <GridPerspective name="daysGain" perspective={daysGain}>
    <Format n={daysGain} />
  </GridPerspective>
</GridPerspectives>;

<Grid {...gridPerspectives[perspective]} />;
```
