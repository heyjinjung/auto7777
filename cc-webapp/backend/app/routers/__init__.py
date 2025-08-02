# -*- coding: utf-8 -*-
# Import individual router modules to make them accessible
from . import auth_simple as auth  # 간단한 인증 라우터 사용
# from . import admin  # 임시 비활성화
# from . import games  # 임시 비활성화
# from . import segments  # 임시 비활성화
# from . import chat  # 임시 비활성화
# from . import feedback  # 임시 비활성화
# from . import ai  # 임시 비활성화
# from . import analyze  # 임시 비활성화
# from . import recommend  # 임시 비활성화

# Optional: define __all__ list for controlled imports
__all__ = ["auth"]
