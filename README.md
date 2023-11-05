# collect

**감자도스 텍스트 수집기**

## 개요

텍스트 CR~~U~~D를 지원하는 간단한 웹 서비스입니다.

## 특징

- 대충 빨리 만들었습니다.
- 앞으로 점점 나아질 예정입니다.
- 아직 인증과 인가의 개념이 없습니다. (~~당신도 사용할 수 있습니다~~)
- DB를 사용하지 않습니다. 텍스트 파일 기반입니다.
- AWS Lambda로 배포합니다. 이유는 간단해보였기 때문입니다. 에효
- [사실 처음에는 작았으나](https://gist.github.com/potados99/7006f5bd7a60822791cdb601ce520f6a) 점점 비대해졌습니다.

## 개발 노트

### 알아두어야 할 것들

- 이 프로젝트는 `ap-northeast-2` 리전에 존재하는 `collect` 라는 이름의 Lambda 함수로 배포됩니다.

- 렌더링에는 `pug`를 사용하였는데, 이 녀석을 포함하는 `node_modules`를 매번 올릴 수가 없어서 별도의 layer로 분리하였습니다. 이때 이 layer 배포에 사용된 압축 파일은 [최상위 엔트리로 `nodejs` 폴더가 있고, 그 아래에 `node_modules` 폴더가 있는 형태](https://stackoverflow.com/a/61329407/11929317)입니다.

- 처음에는 API Gateway와 통합할 때에 payload format version 2를 사용하였는데, Typescript로 옮기고 보니 [`APIGatewayProxyEvent` 타입은 payload format version 1에 기반](https://stackoverflow.com/questions/54386744/aws-api-gateway-unsupported-method-undefined-as-response)하는 겁니다. 그래서 API Gateway 통합을 1로 바꾸었습니다.

### 배포하는 방법

> 이것은 향후 업데이트를 위한 메모입니다. 완전 처음부터(예를 들어 새 AWS 계정에) 배포하려면 더 섬세하고 귀찮은 작업이 필요한데, 자세한 설명은 귀찮아서 생략합니다.

1. 로컬에 `aws cli`와 계정 credential이 준비되어 있는지 확인합니다.
2. `npm run deploy`를 실행합니다. 
