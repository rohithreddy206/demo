from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter(prefix="/api/auth", tags=["auth"])

# Hardcoded demo credentials — no JWT, no hashing needed for this demo
MOCK_USERS = {
    "manager@demo.com":   {"password": "demo1234", "role": "manager",   "name": "Alex Morgan"},
    "recruiter@demo.com": {"password": "demo1234", "role": "recruiter", "name": "Sam Rivera"},
}


class LoginRequest(BaseModel):
    """Request body schema for the login endpoint."""
    email: str
    password: str


@router.post("/login")
def login(payload: LoginRequest):
    """Validate mock credentials and return role/name on success."""
    user = MOCK_USERS.get(payload.email)
    if not user or user["password"] != payload.password:
        return {"status": "error", "data": None, "message": "Invalid email or password."}
    return {
        "status": "success",
        "data": {"role": user["role"], "name": user["name"]},
        "message": "Login successful.",
    }
