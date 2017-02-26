
import hashlib
import json
import urllib
import boto3
import requests

from base64 import b64decode
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy


SECRETS = b64decode(
    'AQECAHg9ZtQddnXseUhr0aIjd2DO5G'
    'wSp9T4TJbbdHISTvNqwwAAAPswgfgG'
    'CSqGSIb3DQEHBqCB6jCB5wIBADCB4Q'
    'YJKoZIhvcNAQcBMB4GCWCGSAFlAwQB'
    'LjARBAy8S8+XFEvkCCUayOICARCAgb'
    'PSdhpycaU/cIZtPOq8wbr2g6nPENV8'
    'JgRZiedQV/QsocchupRKlEf1jfQLtQ'
    'tCttbkmG5f4rO7Yvl6WRWotxKRjKnp'
    'kuUX9MS+244udZrgmu/3yZHXYFTLUY'
    '+b3a/koNU3WvmTQLH6wGM55IbvP/n8w'
    'mIt9UbFUTc2wRrl3K8bF9Qub1A2xspN'
    'lgsgcu+xV0NCkyKsqPB1xDshEwljURo'
    'CHt8cKgttMGFLNQLbrNAtJifgxg=='
)


def get_credentials():
    kms_client = boto3.client('kms')
    creds = json.loads(kms_client.decrypt(CiphertextBlob=SECRETS)['Plaintext'])
    return creds

CREDENTIALS = get_credentials()

print CREDENTIALS