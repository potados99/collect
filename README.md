# collect

**감자도스 텍스트 수집기**

## 개요

텍스트 CRUD를 지원하는 간단한 웹 서비스입니다.
원래는 AWS Lambda + EFS 위에서 살았지만, 인프라를 정리하면서 평범한 Node 서버로 옮겨왔습니다. 비즈니스 로직은 그대로 살아있고 어댑터만 갈아끼웠습니다.

## 특징

- 대충 빨리 만들었습니다.
- 앞으로 점점 나아질 예정입니다.
- 아직 인증과 인가의 개념이 없습니다.
- DB를 사용하지 않습니다. 텍스트 파일 기반입니다 (`STORAGE_DIR` 아래에 채널별 JSON).
- Express + PM2로 OCI 인스턴스에서 굴립니다.
- [사실 처음에는 작았으나](https://gist.github.com/potados99/7006f5bd7a60822791cdb601ce520f6a) 점점 비대해졌습니다.

## 사용

### 메시지 작성

```bash
curl -X POST -d '오늘도 좋은 하루' https://collect.potados.com/mychannel
# → { "message": "굿", "url": "https://collect.potados.com/mychannel/<uuid>" }
```

### 메시지 조회

```bash
curl https://collect.potados.com/mychannel             # 채널 전체 (curl이면 JSON)
curl https://collect.potados.com/mychannel/<id>        # 단일 메시지
curl 'https://collect.potados.com/mychannel?response=api'  # 브라우저에서도 JSON 강제
```

브라우저로 들어가면 pug로 렌더된 HTML이 나옵니다.

### 메시지 수정 / 삭제

```bash
curl -X PATCH  -d '바뀐 내용' https://collect.potados.com/mychannel/<id>
curl -X DELETE             https://collect.potados.com/mychannel/<id>
curl -X DELETE             https://collect.potados.com/mychannel        # 채널 전체
```

## 개발

### 환경 변수

| 이름              | 기본값                          | 설명                                 |
| ----------------- | ------------------------------- | ------------------------------------ |
| `STORAGE_DIR`     | `/home/potados/collected`       | 채널 JSON이 저장되는 디렉토리        |
| `PORT`            | `8086`                          | Express가 listen할 포트              |
| `TRUST_PROXY`     | `loopback`                      | Express trust proxy 설정 (Caddy 뒤) |
| `PUBLIC_BASE_URL` | `https://collect.potados.com`   | POST 응답 url에 박히는 베이스 URL    |

### 스크립트

```bash
pnpm install
pnpm dev      # tsx watch로 핫리로드 (포트 8086)
pnpm test     # supertest 기반 e2e (실제 Express 인스턴스를 띄움)
pnpm build    # tsc + pug 복사 → dist/
pnpm start    # node dist/index.js
```

### 배포 (OCI 인스턴스)

```bash
git pull
pnpm install --prod=false
pnpm build
pm2 startOrReload ecosystem.config.cjs
pm2 save
```

## 데이터 형식

채널마다 하나의 JSON 파일 (`<STORAGE_DIR>/channels/<channel>.json`)이 있고,
각 메시지는 commit 배열로 변경 이력을 그대로 기록합니다 (post / patch / delete).
이 형식은 Lambda 시절과 동일해서 기존 데이터를 그대로 옮겨오면 됩니다.
