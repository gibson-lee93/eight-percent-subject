# 8퍼센트-subject

원티드x위코드 백엔드 프리온보딩 4번째 과제입니다.

## 제출 기업 정보

- 기업명 : 8퍼센트
- 주요 서비스 사이트: [8퍼센트](https://8percent.kr/)

## 과제 : 8퍼센트 계좌 거래 API 구현

### [필수 요구 사항]

- 거래내역 조회 API
  - 계좌의 소유주만 요청 할 수 있어야 합니다.
  - 거래일시에 대한 필터링이 가능해야 합니다.
  - 출금, 입금만 선택해서 필터링을 할 수 있어야 합니다.
  - Pagination이 필요 합니다.
  - 다음 사항이 응답에 포함되어야 합니다.
    - 거래일시
    - 거래금액
    - 잔액
    - 거래종류 (출금/입금)
    - 적요
- 입금 API
  - 계좌의 소유주만 요청 할 수 있어야 합니다.
- 출금 API
  - 계좌의 소유주만 요청 할 수 있어야 합니다.
  - 계좌의 잔액내에서만 출금 할 수 있어야 합니다. 잔액을 넘어선 출금 요청에 대해서는 적절한 에러처리가 되어야 합니다.

### [개발 요구사항]

**주요 고려 사항은 다음과 같습니다.**
- 계좌의 잔액을 별도로 관리해야 하며, 계좌의 잔액과 거래내역의 잔액의 무결성의 보장
- DB를 설계 할때 각 칼럼의 타입과 제약

**구현하지 않아도 되는 부분은 다음과 같습니다.**
- 문제와 관련되지 않은 부가적인 정보. 예를 들어 사용자 테이블의 이메일, 주소, 성별 등
- 프론트앤드 관련 부분

**구현하지 않아도 되는 부분은 다음과 같습니다.**
- (**8퍼센트가 직접 로컬에서 실행하여 테스트를 원하는 경우를 위해**) 테스트의 편의성을 위해 mysql, postgresql 대신 sqllite를 사용해 주세요.

**가산점.**
- Unit test의 구현
- Functional Test 의 구현 (입금, 조회, 출금에 대한 시나리오 테스트)
- 거래내역이 1억건을 넘어갈 때에 대한 고려
    - 이를 고려하여 어떤 설계를 추가하셨는지를 README에 남겨 주세요.

### [평가 요소]

- 주어진 요구사항에 대한 설계/구현 능력
- 코드로 동료를 배려할 수 있는 구성 능력 (코드, 주석, README 등)

## 조원

| 이름   | 외부링크                                                                                                                                        | 담당 기능                                                   |
| ------ | ----------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| 이현준(조장) | [깃허브](https://github.com/lhj0621)/[블로그](https://supiz.tistory.com/)                                                                       | 총괄, 회원가입, 로그인, 로그인 인증, 로그아웃, 유닛 테스트, 헤로쿠 배포 |
| 김태련 | [깃허브](https://github.com/nojamcode)/[블로그](https://velog.io/@code-link)                                                                    | 유닛테스트 |
| 신영학 | [깃허브](https://github.com/yhshin0)/[블로그](https://nbkw.tistory.com/)                                                                        | 계좌 CRUD, 유닛 테스트 |
| 임유라 | [깃허브](https://github.com/BangleCoding)/[블로그](https://banglecoding.github.io/)                                                             |  유닛 테스트 |
| 이기범 | [깃허브](https://github.com/gibson-lee93)/[블로그](https://mysterious-laborer-518.notion.site/Gibson-s-Notion-2dd7f598fba64f1c9806cded5b4b83a0) | 계좌 CRUD, 유닛 테스트, README 작성 |
| 정진산 | [깃허브](https://github.com/chinsanchung)/[블로그](https://chinsanchung.github.io/)                                                             |  |

## 개발 환경

- 언어: TypeScript
- 프레임워크: NestJs
- 데이터베이스: SQLite3
- 라이브러리: typeorm, passport, passport-jwt, bcrypt, class-validator, class-transformer, moment

## ERD

![8퍼센트 ERD](https://user-images.githubusercontent.com/57168321/141470315-48e1e5e7-0bc6-4e9e-ac77-54efc3bc2f7f.PNG)

## 구현 기능

### 회원가입

- bcrypt의 단방향 암호화로 입력받은 비밀번호를 암호화하여 저장했습니다.
- class-validator으로 입력 값의 유효성을 검사해 회원가입에서 발생가능한 오류를 줄였습니다.
- 유저 아이디 중복 체크를 통해 동일한 아이디로 가입을 하지 않도록 했습니다.

### 로그인, 로그인 인증 및 로그아웃

- passport 으로 로그인 과정에서 보안을 유지합니다.
- 로그인 성공 시 유저 인증을 위한 JWT(Json Web Token)이 발급됩니다.
- 로그인 시간을 유저의 DB에 기록하는 동시에 JWT 토큰에 저장합니다. 이 정보는 API 호출 시 이전 로그인 시간과 값을 비교하여 토큰의 유효성을 검증하는데 사용합니다.
- 유저 DB 의 로그인 시간을 null 값으로 갱신하여 로그아웃을 수행합니다. 또한 로그인 시 발급받은 토큰을 만료시킵니다.

### 계좌

- 계좌의 CRUD를 구현했습니다. API를 수행하기 전에 로그인했는지 확인합니다.
- 계좌에 대한 CRUD 동작은 계좌의 소유주인지 확인을 한 후에 실행할 수 있도록 처리하였습니다.
- 계좌 전체 조회 시 해당 유저의 계좌 목록을 출력합니다.
- 계좌 상세 조회할 경우 해당 유저의 특정 계좌만 출력합니다.
- 입금 또는 출금이 있으면 계좌 수정을 통해 계좌의 보유 금액을 업데이트합니다.
- typeorm 의 softDelete 메소드를 이용해 데이터를 실제로 삭제하지 않도록 구현했습니다.

### 거래내역

- 

## API 문서

<!-- TODO -->

API 테스트를 위한 방법을 [POSTMAN document](https://documenter.getpostman.com/view/15323948/UVC5F7xT)에서 확인하실 수 있습니다.

## 배포

<!-- TODO -->

Heroku를 이용해 배포를 진행했으며, 사이트의 주소는 [https://pocky-redbrick-subject.herokuapp.com/](https://pocky-redbrick-subject.herokuapp.com/) 입니다.



## 설치 및 실행 방법

### 공통

1. 최상위 폴더에 `.env` 파일에 `JWT_SECRET`에 임의의 문자열을 작성해 저장합니다.
1. `npm install`으로 패키지를 설치합니다.
1. 테스트
	- 개발일 경우: `npm run start`으로 `localhost:3000`에서 테스트하실 수 있습니다.
	- 배포일 경우: `npm run build`으로 애플리케이션을 빌드합니다. 그리고 `npm run start:prod`으로 실행합니다.
1. POST `localhost:3000/users`에서 `user_id`, `password`를 입력해 유저를 생성합니다.
1. POST `localhost:3000/users/signin`에 `user_id`, `password`을 입력하신 후 결과값으로 accessToken을 발급받습니다.
1. 계좌 생성, 입금, 출금 등 권한이 필요한 API의 주소를 입력한 후, Headers 의 Authorization에 accessToken을 붙여넣어 권한을 얻은 후 API를 호출합니다.

## 테스트
![image](https://user-images.githubusercontent.com/42320464/140993810-a6384238-6c6b-473a-8ab2-5b34ae13f96f.png)

## 폴더 구조

```bash
|   .eslintrc.js
|   .gitignore
|   .prettierrc
|   nest-cli.json
|   package-lock.json
|   package.json
|   Procfile
|   README.md
|   tree.txt
|   tsconfig.build.json
|   tsconfig.json
|   
+---.github
|       PULL_REQUEST_TEMPLATE.md
|       
+---src
|   |   app.controller.spec.ts
|   |   app.controller.ts
|   |   app.module.ts
|   |   app.service.ts
|   |   main.ts
|   |   
|   +---auth
|   |   |   auth.controller.ts
|   |   |   auth.module.ts
|   |   |   auth.service.spec.ts
|   |   |   auth.service.ts
|   |   |   get-user.decorator.ts
|   |   |   jwt-auth.guard.ts
|   |   |   jwt.strategy.ts
|   |   |   
|   |   \---dto
|   |           login-user.dto.ts
|   |           
|   +---cache
|   |       cache.module.ts
|   |       cache.service.ts
|   |       
|   +---core
|   |   \---entities
|   |           core.entity.ts
|   |           
|   +---game
|   |   |   game.controller.ts
|   |   |   game.module.ts
|   |   |   game.repository.ts
|   |   |   game.service.spec.ts
|   |   |   game.service.ts
|   |   |   
|   |   +---dto
|   |   |       create-game.dto.ts
|   |   |       update-game.dto.ts
|   |   |       
|   |   \---entities
|   |           game.entity.ts
|   |           
|   +---projects
|   |   |   projects.controller.spec.ts
|   |   |   projects.controller.ts
|   |   |   projects.interface.ts
|   |   |   projects.module.ts
|   |   |   projects.service.spec.ts
|   |   |   projects.service.ts
|   |   |   
|   |   +---dto
|   |   |       create-project.dto.ts
|   |   |       publish-project.dto.ts
|   |   |       update-project.dto.ts
|   |   |       
|   |   \---entities
|   |           project.entity.ts
|   |           
|   \---users
|       |   user.service.spec.ts
|       |   users.controller.spec.ts
|       |   users.controller.ts
|       |   users.module.ts
|       |   users.service.ts
|       |   
|       +---dto
|       |       create-user.dto.ts
|       |       update-user.dto.ts
|       |       
|       \---entities
|               user.entity.ts
|               
\---test
        app.e2e-spec.ts
        jest-e2e.json
```
