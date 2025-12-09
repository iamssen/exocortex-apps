# Code Review (2025-12-09)

## 1. 코드 이해 용이성 (Understandability)

이 프로젝트는 Vite와 React 기반의 웹 애플리케이션으로, 디렉터리 구조가 매우 직관적입니다.

- **`src/@ui`**: 재사용 가능한 UI 컴포넌트들이 모여 있어, 디자인 시스템과 로직이 분리되어 있음을 쉽게 파악할 수 있습니다.
- **`src/pages`**: 라우팅 단위의 페이지들이 위치하며, 각 페이지 디렉터리에 관련된 하위 컴포넌트나 스타일이 응집되어 있어 유지보수가 용이해 보입니다.
- **`src/sections`**: 페이지를 구성하는 중간 단위의 컴포넌트들이 위치하여, 페이지가 너무 비대해지는 것을 방지하고 재사용성을 조금 더 높인 구조로 보입니다.

전반적으로 React 생태계에 익숙한 개발자라면 쉽게 구조를 파악하고 기여할 수 있는 형태입니다.

## 2. 구조체 간 상호 의존성 (Structural Dependencies)

- **강한 타입 결합**: `src/@ui/query/api.ts`에서 `@iamssen/exocortex/server`의 `APIConfig`를 가져와 사용하고 있습니다. 이는 Frontend와 Backend(Server) 간의 타입 안전성을 보장하는 훌륭한 패턴입니다. 서버 API 변경 시 클라이언트 컴파일 단계에서 에러를 잡을 수 있습니다.
- **의존성 방향**: `pages` -> `sections` -> `@ui`로 이어지는 의존성 방향은 단방향으로 잘 지켜지고 있는 것으로 보입니다. `pages`가 `sections`를 조합하고, `sections`가 `@ui`를 사용하는 구조입니다.
- **`@ui`의 독립성**: 다만, `@ui` 폴더가 '공통 UI 라이브러리'의 성격을 가진다면, `api.ts` 내에서 특정 서버 패키지(`@iamssen/exocortex/server`)에 직접 의존하는 것은 `@ui` 폴더의 독립성을 다소 저해할 수 있습니다. 만약 `@ui`를 다른 프로젝트로 분리하거나 범용적으로 사용하려 한다면 이 부분은 추상화가 필요할 수 있습니다. 하지만 현재 단일 앱 구조에서는 실용적인 선택입니다.

## 3. 개선할 점 및 제안 (Improvements & Suggestions)

- **환경 변수 관리**: `src/@ui/query/api.ts`에서 `API_ENDPOINT`의 기본값이 `https://192.168.1.98:9999`와 같이 특정 IP로 하드코딩 되어 있습니다. 로컬 개발 환경용이라 하더라도 `.env` 파일 등을 통해 관리하거나 `localhost`를 기본값으로 사용하는 것이 다른 개발자가 환경을 셋업할 때 혼란을 줄일 수 있습니다.
- **심볼 관리**: `MarketPage.tsx` 등에 `symbols` 배열이나 워치 리스트 설정값들이 코드 내에 하드코딩 되어 있습니다. 이러한 설정값들을 별도의 상수 파일(`constants` 등)로 분리하거나, 런타임에 서버에서 받아오도록 하면 유연성이 높아질 것입니다.

## 4. 구조적 분리 및 결합 설명 (Structural Separation & Combination)

이 프로젝트는 다음과 같은 계층 구조로 이루어져 있습니다:

1.  **Application Layer (`src/App.tsx`, `src/pages`)**:
    - `App.tsx`는 라우팅의 진입점 역할을 하며, URL 경로와 `Page` 컴포넌트를 매핑합니다.
    - `pages` 폴더 내의 각 컴포넌트(예: `MarketPage`)는 해당 라우트의 비즈니스 로직과 레이아웃을 담당합니다. 데이터 페칭(`useQuery`)을 여기서 수행하거나 하위 섹션으로 위임합니다.

2.  **Composition Layer (`src/sections`)**:
    - 페이지를 구성하는 의미있는 단위들입니다. 예를 들어 `MarketPage`는 `QuoteSection`, `BenchmarkSection`, `KospiPeSection` 등 여러 섹션의 조합으로 이루어집니다.
    - 이 계층은 복잡한 페이지의 UI를 논리적 단위로 쪼개어 가독성을 높입니다.

3.  **UI Library Layer (`src/@ui`)**:
    - **`@ui/charts`, `@ui/grids`**: 데이터를 시각화하는 차트나 그리드 컴포넌트들입니다. D3.js 등을 활용한 저수준 구현이 포함되어 있습니다.
    - **`@ui/components`**: 버튼, 날짜 선택기 등 범용적인 UI 요소들입니다.
    - **`@ui/query`**: React Query를 래핑하거나 API 호출을 위한 유틸리티를 제공합니다.

4.  **Utilities & Config (`package.json`, `vite.config.ts`)**:
    - Vite를 빌드 도구로 사용하며, `exocortex` 관련 패키지들과의 연동을 통해 전체 시스템의 일부로 동작합니다.
