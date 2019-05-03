# -*- coding: utf-8 -*-
"""Application configuration."""
import os
from datetime import timedelta

from pathlib import Path
from dotenv import load_dotenv
env_path = Path('..') / '.env'
load_dotenv()


class Config(object):
    """Base configuration."""

    SECRET_KEY = os.environ.get(
        'remixvr_SECRET', 'secret-key')  # TODO: Change me
    APP_DIR = os.path.abspath(os.path.dirname(__file__))  # This directory
    PROJECT_ROOT = os.path.abspath(os.path.join(APP_DIR, os.pardir))
    BCRYPT_LOG_ROUNDS = 13
    DEBUG_TB_INTERCEPT_REDIRECTS = False
    CACHE_TYPE = 'simple'  # Can be "memcached", "redis", etc.
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_AUTH_USERNAME_KEY = 'email'
    JWT_AUTH_HEADER_PREFIX = 'Token'
    CORS_ORIGIN_WHITELIST = [
        'http://0.0.0.0:3000',
        'http://localhost:3000',
        'http://0.0.0.0:4100',
        'http://localhost:4100',
        'http://0.0.0.0:8000',
        'http://localhost:8000',
        'http://0.0.0.0:4200',
        'http://localhost:4200',
        'http://0.0.0.0:4000',
        'http://localhost:4000',
        'http://localhost:8080',
        'https://remixvr.org',
        os.environ.get('WHITELIST', '')
    ]
    JWT_HEADER_TYPE = 'Token'
    UPLOAD_FOLDER = 'uploads'
    MAX_CONTENT_LENGTH = 1024*1024*1024  # limit max upload size


class ProdConfig(Config):
    """Production configuration."""

    ENV = 'prod'
    DEBUG = False
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL',
                                             'postgresql://localhost/remixvr')
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(days=180)


class DevConfig(Config):
    """Development configuration."""

    ENV = 'dev'
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL',
                                             'postgresql://localhost/remixvr')
    # SQLALCHEMY_ECHO = True
    CACHE_TYPE = 'simple'  # Can be "memcached", "redis", etc.
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(days=365)


class TestConfig(Config):
    """Test configuration."""

    TESTING = True
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = os.environ.get('TEST_DATABASE_URL',
                                             'postgresql://localhost/remixvrtest')
    # For faster tests; needs at least 4 to avoid "ValueError: Invalid rounds"
    BCRYPT_LOG_ROUNDS = 4
