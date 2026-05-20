from fastapi import HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import jwt

SECRET = "dev-secret-key-change-in-prod"
security = HTTPBearer()

def create_token(email: str) -> str:
    return jwt.encode({"sub": email}, SECRET, algorithm="HS256")

def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        jwt.decode(credentials.credentials, SECRET, algorithms=["HS256"])
        return True
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
