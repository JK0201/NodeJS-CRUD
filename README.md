<img src="https://capsule-render.vercel.app/api?type=waving&color=0:16213E,10:0F3460,30:533483,75:5B2A86,100:E94560&height=100&section=header&text=&fontSize=0" width="100%"/>
<div align="center">
  <a href="https://git.io/typing-svg">
    <img src="https://readme-typing-svg.demolab.com?font=Orbitron&weight=500&pause=10000&color=58A6FF&center=true&random=false&width=435&lines=NodeJS-CRUD" alt="Typing SVG" />
  </a>
  <br>
  
  ![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
  ![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
  ![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)
</div>
<br>

## Overview
- 해당 프로젝트는 복습의 목적으로 Node.js와 Express 프레임워크를 사용하여 만든 간단한 CRUD(Create, Read, Update, Delete) 웹 사이트입니다. NoSQL 데이터베이스인 MongoDB와 EJS 템플릿 엔진을 활용하여 서버에서 동적으로 HTML을 생성하는 SSR(Server-Side Rendering) 방식으로 제작되었습니다.
<br>

## Features
  <details>
    <summary><b>메인 페이지</b></summary>
    <br>
    <div align="center">
      <img src="https://github.com/JK0201/NodeJS-CRUD/assets/124655981/cdb6f703-0733-43e8-920c-2e54b132dbf7" width="45%"/>
    <div>
    <br>
    <p> - 빠른 페이지 이동을 위한 네비게이션 기능</p>
    <p> - 회원가입/로그인 빠른이동
    <p> - 회원 로그인시 로그아웃
    <p> - position:sticky를 활용한 간략한 페이지 소개</p>
    <hr>
  </details>
  
  <details>
    <summary><b>회원가입/로그인</b></summary>
    <br>
    <p><b># 회원가입 페이지</b></p>
    <img src="https://github.com/JK0201/NodeJS-CRUD/assets/124655981/441ad8a3-398f-4324-b19b-d9a9b6fdd384" width="45%" />
    <br>
    <p> - 아이디/비밀번호/닉네임 유효성검사
    <p> - 아이디 중복검사</p>
    <p> - Bcrypt + Salt 기능을 활용한 비밀번호 해싱</p>
    <br>
    <p><b># 로그인 페이지</b></p>
    <img src="https://github.com/JK0201/NodeJS-CRUD/assets/124655981/f4d17add-900d-46c7-805c-60727394bfd7" width="45%"/>
    <br>
    <p> - Passport 라이브러리를 활용한 세션방식의 간단한 로그인기능</p>
    <p> - [회원기능]이 필요한 요청에 대해 session체크 함수를 만들어 미들웨어로 활용</p>
    <hr>
  </details>
  
  <details>
    <summary><b>게시판</b></summary>
    <br>
    <p><b># 글 리스트 페이지</b></p>
    <img src="https://github.com/JK0201/NodeJS-CRUD/assets/124655981/76dd6371-8fe7-4eb2-a0a0-981c849b62dc" width="45%"/>
    <br>
    <p> - 게시물 검색기능</p>
    <br>
    <p><b># 글 작성/수정 페이지 [회원기능]</b></p>
    <img src="https://github.com/JK0201/NodeJS-CRUD/assets/124655981/2bd77ade-926c-453d-bee8-e93c89d448dc" width="45%"/>
    <br>
    <p> - 배열을 활용한 이미지 핸들링(이미지 추가/삭제)</p>
    <p> - 캐러셀 기능을 활용한 업로드 이미지 미리보기</p>
    <p> - Multer 라이브러리를 사용한 다중 이미지 업로드</p>
    <br>
    <p><b># 글 내용 조회 페이지</b></p>
    <img src="https://github.com/JK0201/NodeJS-CRUD/assets/124655981/4fcd69cf-db05-48b5-b2a5-f95e68d11286" width="45%"/>
    <img src="https://github.com/JK0201/NodeJS-CRUD/assets/124655981/baa55cf0-d8fe-476e-a725-03777e4c11d4" width="45%"/>
    <br>
    <p> - 본인 게시물 삭제/수정 [회원기능]</p>
    <p> - 글 작성자와 해당 게시물에 대한 1:1 채팅 기능 [회원기능]</p>
    <p> - 최초 메세지를 보내야 데이터베이스에 채팅방이 생성되도록 구현 (서버 요청 최소화)</p>
    <hr>
  </details>

  <details>
    <summary><b>채팅 [회원기능]</b></summary>
    <br>
    <p><b># 채팅 리스트 페이지</b></p>
    <img src="https://github.com/JK0201/NodeJS-CRUD/assets/124655981/0033050a-1371-4cc9-919d-8120f518d4e9" width="45%" />
    <br>
    <p> - 유저별로 생성된 글 작성자와의 1:1 채팅방 리스트</p>
    <br>
    <p><b># 1:1 채팅 페이지</b></p>
    <img src="https://github.com/JK0201/NodeJS-CRUD/assets/124655981/0ac3dd5b-0433-45ad-ac69-e5e4a12edbf9" width="45%"/>
    <br>
    <p> - SSE(Server-Sent-Events)를 이용한 서버에서 클라이언트로 실시간 이벤트를 전달하는 단방향 통신 채팅방</p>
    <p> - 파이프라인을 만들어 POST요청이 발생할 때, MongoDB의 컬렉션 변화를 실시간으로 감지하고 메세지 업데이트</p>
    <hr>
  </details>
  <br>
<img src="https://capsule-render.vercel.app/api?type=rect&color=0:16213E,10:0F3460,30:533483,75:5B2A86,100:E94560&height=40&section=footer&text=&fontSize=0" width="100%"/>
