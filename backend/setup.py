from setuptools import setup, find_packages

setup(
    name="abare-backend",
    version="0.1.0",
    packages=find_packages(),
    install_requires=[
        "fastapi>=0.109.0",
        "uvicorn>=0.24.0",
        "pydantic>=2.0.0",
        "python-jose[cryptography]>=3.3.0",
        "passlib[bcrypt]>=1.7.4",
        "email-validator>=2.0.0",
        "motor>=3.0.0",
        "pymongo>=4.0.0",
        "python-multipart>=0.0.5",
    ],
) 