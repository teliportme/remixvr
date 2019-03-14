from flask import jsonify


def template(data, code=500):
    return {'message': {'errors': {'body': data}}, 'status_code': code}


USER_NOT_FOUND = template(['User not found'], code=404)
USER_ALREADY_REGISTERED = template(['User already registered'], code=422)
UNKNOWN_ERROR = template([], code=500)
PROJECT_NOT_FOUND = template(['Project not found'], code=404)
THEME_NOT_FOUND = template(['Theme not found'], code=404)
NO_FILES_FOUND = template(['No files found'], code=500)


class InvalidUsage(Exception):
    status_code = 500

    def __init__(self, message, status_code=None, payload=None):
        Exception.__init__(self)
        self.message = message
        if status_code is not None:
            self.status_code = status_code
        self.payload = payload

    def to_json(self):
        rv = self.message
        return jsonify(rv)

    @classmethod
    def user_not_found(cls):
        return cls(**USER_NOT_FOUND)

    @classmethod
    def user_already_registered(cls):
        return cls(**USER_ALREADY_REGISTERED)

    @classmethod
    def unknown_error(cls):
        return cls(**UNKNOWN_ERROR)

    @classmethod
    def project_not_found(cls):
        return cls(**PROJECT_NOT_FOUND)

    @classmethod
    def theme_not_found(cls):
        return cls(**THEME_NOT_FOUND)

    @classmethod
    def no_files_found(cls):
        return cls(**NO_FILES_FOUND)
