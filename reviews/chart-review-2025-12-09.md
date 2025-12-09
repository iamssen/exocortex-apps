# Chart Architecture Review (2025-12-09)

## 1. 개요 (Overview)

`exocortex-app`의 차트 관련 구조는 `src/@ui/cartesian-chart`와 `src/@ui/charts` 두 가지 핵심 디렉터리로 나뉘어 있습니다.
사용자께서 모호하다고 느끼신 부분은 이 두 레이어의 역할 경계와, 새로운 차트를 만들 때마다 발생하는 Boilerplate 코드 때문일 것입니다.

## 2. 구조 분석 (Structural Analysis)

### A. `@ui/cartesian-chart`: The Primitives (부품)

- **역할**: 차트를 구성하는 **가장 작은 단위의 시각적 요소**들을 정의합니다.
- **특징**:
  - D3.js 스케일(`scaleLinear`, `scaleTime`)과 SVG 요소(`path`, `circle`, `text`)를 직접 다룹니다.
  - 비즈니스 로직을 전혀 모르며, 오직 `number[]`나 `date` 같은 원시 데이터만 받아서 그립니다.
  - `CartesianChartContext`를 통해 부모 차트의 `width`, `height` 정보를 공유받습니다.
- **예시**: `HistoryLine`, `PriceLine`, `EventIndicator`, `RecessionIndicator`

### B. `@ui/charts`: The Compositions (완제품)

- **역할**: Primitives를 조합하여 **특정 도메인 목적**을 가진 차트를 완성합니다.
- **특징**:
  - 비즈니스 데이터(Server API 응답 타입 등)를 입력받아 Primitives가 이해할 수 있는 형태(`create...Data`)로 변환합니다.
  - 어떤 선을 어떤 색으로 그릴지, 축의 범위는 어떻게 설정할지 등의 **정책(Policy)**을 결정합니다.
  - React Query 로직이 일부 포함되거나, `api` 호출 결과를 주입받기도 합니다.
- **예시**: `BenchmarkChart` (경제 지표 시각화), `QuoteChart` (주식 차트 시각화)

### C. `src/pages`: The Consumers (사용자)

- **역할**: 완성된 차트 컴포넌트를 페이지 레이아웃에 배치합니다.
- **특징**:
  - 차트의 세부 구현(SVG, D3)을 전혀 몰라도 됩니다.
  - `chartStartDate`와 같은 상위 상태를 관리하고 주입합니다.

## 3. 평가 및 개선 제안 (Evaluation & Suggestions)

### 장점 (Pros)

- **관심사의 분리**: `pages`는 데이터 흐름에만 집중하고, `cartesian-chart`는 픽셀 단위 렌더링에만 집중합니다. `charts`가 그 사이에서 '어떤 데이터를 어떻게 그릴지'를 조율합니다.
- **안전성**: `cartesian-chart` 수정 시 모든 차트에 영향을 주지만, `charts` 내의 특정 차트 수정은 해당 차트에만 영향을 줍니다.

### 단점 (Cons)

- **장황함 (Verbosity)**: 단순한 차트 하나를 추가하려 해도 새로운 폴더를 만들고 컴포넌트를 선언해야 합니다.
- **Boilerplate**: `QuoteChart`와 `BenchmarkChart` 처럼 구조가 거의 비슷한데도 별도 컴포넌트로 존재하여 중복 코드가 발생합니다.

### 개선 제안 (Suggestions)

#### 1. Generic Composition Component 도입

매번 새로운 컴포넌트를 만드는 대신, 페이지에서 Primitives를 직접 조합할 수 있는 유연한 컨테이너를 고려해볼 수 있습니다. 하지만 이는 페이지에 너무 많은 렌더링 상세 정보가 노출될 위험이 있습니다.

대신, **Layout 기반의 접근**을 제안합니다.

```tsx
// @ui/charts/GenericChart.tsx (가칭)
export function GenericChart({
  primaryLines,
  backgroundEvents,
  annotations,
  ...props
}) {
  // 공통적인 데이터 변환 및 Context 설정 로직
  return (
    <CartesianChart {...props}>
      {backgroundEvents}
      {primaryLines}
      {annotations}
    </CartesianChart>
  );
}
```

이렇게 하면 단순한 차트는 별도 파일 생성 없이 `GenericChart`를 사용해 해결할 수 있습니다.

#### 2. 명칭 변경 (Naming)

역할을 더 명확히 하기 위해 디렉터리 이름을 변경하는 것도 방법입니다.

- `cartesian-chart` -> **`chart-primitives`** (또는 `chart-core`)
- `charts` -> **`chart-blocks`** (또는 `domain-charts`)

#### 3. Data Transformer 분리 유지

현재 `createBenchmarkChartData` 처럼 데이터 변환 로직이 분리된 것은 매우 좋은 패턴입니다. 이 부분이 `Component` 내부에 있었다면 훨씬 더 복잡했을 것입니다. 이 패턴은 계속 유지하는 것이 좋습니다.

## 4. 결론 (Conclusion)

현재 구조는 **유지보수성과 확장성 면에서 안정적인 구조**입니다. 다소 장황해 보일 수 있으나, 앱의 규모가 커지고 차트 종류가 50개, 100개가 넘어갈수록 이 분리 구조가 빛을 발할 것입니다.
다만, 너무 간단한 일회성 차트들을 위해 매번 파일을 만드는 피로도를 줄이기 위해 **범용 차트 컴포넌트(`GenericChart`)** 하나 정도를 `charts` 폴더에 추가하여 가볍게 사용하는 것을 추천합니다.
