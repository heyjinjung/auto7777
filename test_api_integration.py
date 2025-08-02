#!/usr/bin/env python3
"""
API 통합 테스트 스크립트
프론트엔드 → API → 데이터베이스 연결 테스트
Casino-Club F2P Integration Test Suite
"""
import requests
import json
import time
import sys

class APIIntegrationTest:
    def __init__(self):
        self.base_url = "http://localhost:8000"
        self.token = None
        self.test_user_data = None
    
    def print_colored(self, message, color="white"):
        """컬러 출력"""
        colors = {
            "red": "\033[91m",
            "green": "\033[92m", 
            "yellow": "\033[93m",
            "blue": "\033[94m",
            "cyan": "\033[96m",
            "white": "\033[97m",
            "reset": "\033[0m"
        }
        print(f"{colors.get(color, colors['white'])}{message}{colors['reset']}")
    
    def test_health_check(self):
        """헬스체크 테스트"""
        try:
            self.print_colored("🏥 헬스체크 테스트...", "cyan")
            response = requests.get(f"{self.base_url}/health", timeout=10)
            
            if response.status_code == 200:
                self.print_colored("✅ 헬스체크 통과", "green")
                self.print_colored(f"응답: {response.json()}", "blue")
                return True
            else:
                self.print_colored(f"❌ 헬스체크 실패 (상태코드: {response.status_code})", "red")
                return False
                
        except requests.exceptions.ConnectionError:
            self.print_colored("❌ 백엔드 서버에 연결할 수 없습니다.", "red")
            self.print_colored("서버가 실행 중인지 확인하세요: docker ps", "yellow")
            return False
        except Exception as e:
            self.print_colored(f"❌ 헬스체크 실패: {e}", "red")
            return False
    
    def test_swagger_docs(self):
        """Swagger 문서 접근 테스트"""
        try:
            self.print_colored("📚 Swagger 문서 접근 테스트...", "cyan")
            response = requests.get(f"{self.base_url}/docs", timeout=10)
            
            if response.status_code == 200:
                self.print_colored("✅ Swagger 문서 접근 성공", "green")
                return True
            else:
                self.print_colored(f"❌ Swagger 문서 접근 실패 (상태코드: {response.status_code})", "red")
                return False
                
        except Exception as e:
            self.print_colored(f"❌ Swagger 문서 접근 실패: {e}", "red")
            return False
    
    def test_api_openapi_spec(self):
        """OpenAPI 스펙 확인"""
        try:
            self.print_colored("🔍 OpenAPI 스펙 확인...", "cyan")
            response = requests.get(f"{self.base_url}/openapi.json", timeout=10)
            
            if response.status_code == 200:
                spec = response.json()
                paths = list(spec.get('paths', {}).keys())
                self.print_colored(f"✅ API 엔드포인트 발견: {len(paths)}개", "green")
                
                # 주요 엔드포인트 확인
                important_endpoints = ['/api/auth/signup', '/api/auth/login', '/api/users/profile']
                found_endpoints = [ep for ep in important_endpoints if any(ep in path for path in paths)]
                
                if found_endpoints:
                    self.print_colored(f"🎯 주요 엔드포인트: {', '.join(found_endpoints)}", "blue")
                else:
                    self.print_colored("⚠️ 주요 엔드포인트를 찾을 수 없습니다.", "yellow")
                    
                return True
            else:
                self.print_colored(f"❌ OpenAPI 스펙 조회 실패 (상태코드: {response.status_code})", "red")
                return False
                
        except Exception as e:
            self.print_colored(f"❌ OpenAPI 스펙 확인 실패: {e}", "red")
            return False
    
    def test_user_signup(self):
        """회원가입 테스트"""
        try:
            self.print_colored("👤 회원가입 테스트...", "cyan")
            
            # 고유한 닉네임 생성
            timestamp = int(time.time())
            nickname = f"testuser_{timestamp}"
            
            data = {
                "invite_code": "TEST001",
                "nickname": nickname
            }
            
            response = requests.post(
                f"{self.base_url}/api/auth/signup",
                json=data,
                timeout=10
            )
            
            if response.status_code == 200:
                self.test_user_data = response.json()
                self.print_colored("✅ 회원가입 성공", "green")
                self.print_colored(f"생성된 사용자: {nickname}", "blue")
                return self.test_user_data
            else:
                self.print_colored(f"❌ 회원가입 실패 (상태코드: {response.status_code})", "red")
                self.print_colored(f"응답: {response.text}", "yellow")
                return None
                
        except Exception as e:
            self.print_colored(f"❌ 회원가입 실패: {e}", "red")
            return None
    
    def test_user_login(self, nickname):
        """로그인 테스트"""
        try:
            self.print_colored("🔐 로그인 테스트...", "cyan")
            
            data = {
                "nickname": nickname,
                "password": "default_password"  # 기본 패스워드 시스템 확인 필요
            }
            
            response = requests.post(
                f"{self.base_url}/api/auth/login",
                json=data,
                timeout=10
            )
            
            if response.status_code == 200:
                login_data = response.json()
                self.token = login_data.get("access_token")
                self.print_colored("✅ 로그인 성공", "green")
                self.print_colored(f"토큰 획득: {self.token[:20]}...", "blue")
                return True
            else:
                self.print_colored(f"❌ 로그인 실패 (상태코드: {response.status_code})", "red")
                self.print_colored(f"응답: {response.text}", "yellow")
                return False
                
        except Exception as e:
            self.print_colored(f"❌ 로그인 실패: {e}", "red")
            return False
    
    def test_authenticated_request(self):
        """인증이 필요한 요청 테스트"""
        if not self.token:
            self.print_colored("❌ 토큰이 없습니다", "red")
            return False
        
        try:
            self.print_colored("🔒 인증된 요청 테스트...", "cyan")
            
            headers = {"Authorization": f"Bearer {self.token}"}
            response = requests.get(
                f"{self.base_url}/api/users/profile",
                headers=headers,
                timeout=10
            )
            
            if response.status_code == 200:
                profile_data = response.json()
                self.print_colored("✅ 인증된 요청 성공", "green")
                self.print_colored(f"사용자 프로필: {profile_data.get('nickname', 'N/A')}", "blue")
                return True
            else:
                self.print_colored(f"❌ 인증된 요청 실패 (상태코드: {response.status_code})", "red")
                self.print_colored(f"응답: {response.text}", "yellow")
                return False
                
        except Exception as e:
            self.print_colored(f"❌ 인증된 요청 실패: {e}", "red")
            return False
    
    def test_game_api(self):
        """게임 API 테스트"""
        if not self.token:
            self.print_colored("❌ 토큰이 없습니다", "red")
            return False
        
        try:
            self.print_colored("🎰 게임 API 테스트...", "cyan")
            
            headers = {"Authorization": f"Bearer {self.token}"}
            data = {"bet_amount": 5000}
            
            response = requests.post(
                f"{self.base_url}/api/games/slot/spin",
                json=data,
                headers=headers,
                timeout=10
            )
            
            if response.status_code == 200:
                game_result = response.json()
                self.print_colored("✅ 게임 API 성공", "green")
                self.print_colored(f"게임 결과: {game_result}", "blue")
                return True
            else:
                self.print_colored(f"⚠️ 게임 API 실패 (상태코드: {response.status_code})", "yellow")
                self.print_colored("게임 엔드포인트가 아직 구현되지 않았을 수 있습니다.", "yellow")
                return False
                
        except Exception as e:
            self.print_colored(f"❌ 게임 API 실패: {e}", "red")
            return False
    
    def test_database_connection(self):
        """데이터베이스 연결 테스트 (간접적)"""
        try:
            self.print_colored("🗄️ 데이터베이스 연결 테스트...", "cyan")
            
            # 사용자 목록 조회로 DB 연결 확인
            if self.token:
                headers = {"Authorization": f"Bearer {self.token}"}
                response = requests.get(
                    f"{self.base_url}/api/users/profile",
                    headers=headers,
                    timeout=10
                )
                
                if response.status_code == 200:
                    self.print_colored("✅ 데이터베이스 연결 정상 (프로필 조회 성공)", "green")
                    return True
                else:
                    self.print_colored("⚠️ 데이터베이스 연결 문제 가능성", "yellow")
                    return False
            else:
                self.print_colored("⚠️ 토큰 없어서 DB 연결 테스트 스킵", "yellow")
                return True
                
        except Exception as e:
            self.print_colored(f"❌ 데이터베이스 연결 테스트 실패: {e}", "red")
            return False
    
    def run_all_tests(self):
        """모든 테스트 실행"""
        self.print_colored("🚀 Casino-Club F2P API 통합 테스트 시작...", "cyan")
        self.print_colored("=" * 60, "blue")
        
        test_results = {}
        
        # 1. 기본 연결 테스트
        self.print_colored("\n📡 1. 기본 연결 테스트", "cyan")
        test_results['health'] = self.test_health_check()
        test_results['swagger'] = self.test_swagger_docs()
        test_results['openapi'] = self.test_api_openapi_spec()
        
        if not test_results['health']:
            self.print_colored("❌ 기본 연결 실패로 테스트 중단", "red")
            return False
        
        # 2. 인증 플로우 테스트
        self.print_colored("\n🔐 2. 인증 플로우 테스트", "cyan")
        user_data = self.test_user_signup()
        if user_data:
            test_results['signup'] = True
            nickname = user_data.get("nickname") or user_data.get("user", {}).get("nickname")
            if nickname:
                test_results['login'] = self.test_user_login(nickname)
            else:
                self.print_colored("⚠️ 회원가입 응답에서 닉네임을 찾을 수 없습니다.", "yellow")
                test_results['login'] = False
        else:
            test_results['signup'] = False
            test_results['login'] = False
        
        # 3. 인증된 요청 테스트
        self.print_colored("\n🔒 3. 인증된 요청 테스트", "cyan")
        test_results['authenticated'] = self.test_authenticated_request()
        
        # 4. 게임 API 테스트
        self.print_colored("\n🎮 4. 게임 API 테스트", "cyan")
        test_results['game'] = self.test_game_api()
        
        # 5. 데이터베이스 연결 테스트
        self.print_colored("\n🗄️ 5. 데이터베이스 연결 테스트", "cyan")
        test_results['database'] = self.test_database_connection()
        
        # 6. 결과 요약
        self.print_colored("\n" + "=" * 60, "blue")
        self.print_colored("📊 테스트 결과 요약", "cyan")
        
        passed = sum(1 for result in test_results.values() if result)
        total = len(test_results)
        
        for test_name, result in test_results.items():
            status = "✅ 통과" if result else "❌ 실패"
            self.print_colored(f"  {test_name}: {status}", "green" if result else "red")
        
        self.print_colored(f"\n🎯 전체 결과: {passed}/{total} 테스트 통과", "green" if passed == total else "yellow")
        
        if passed == total:
            self.print_colored("🎉 모든 테스트 통과! API 연결이 정상 작동합니다.", "green")
            return True
        else:
            self.print_colored("⚠️ 일부 테스트 실패. 해당 기능을 점검해주세요.", "yellow")
            return False

def main():
    """메인 실행 함수"""
    tester = APIIntegrationTest()
    
    print("Casino-Club F2P API Integration Test")
    print("=" * 40)
    
    # 테스트 실행
    success = tester.run_all_tests()
    
    # 종료 코드 반환
    sys.exit(0 if success else 1)

if __name__ == "__main__":
    main()
