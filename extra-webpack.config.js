const Dotenv = require('dotenv-webpack');

module.exports = {
  plugins: [
    new Dotenv({
      path: './.env', // 환경 변수 파일의 경로
      safe: true // '.env.example' 파일과 함께 사용하여 키가 모두 설정되어 있는지 확인합니다.
    })
  ]
};
