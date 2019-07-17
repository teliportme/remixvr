from flask import jsonify


def template(data, code=500):
    return {'message': {'errors': {'body': data}}, 'status_code': code}


USER_NOT_FOUND = template(['User not found'], code=404)
USER_ALREADY_REGISTERED = template(['User already registered'], code=422)
UNKNOWN_ERROR = template([], code=500)
PROJECT_NOT_FOUND = template(['Project not found'], code=404)
THEME_NOT_FOUND = template(['Theme not found'], code=404)
THEME_ALREADY_EXISTS = template(
    ['Theme already exists with same title'], code=422)
FIELD_NOT_FOUND = template(['Field not found'], code=404)
SPACE_NOT_FOUND = template(['Space not found'], code=404)
FIELD_ERROR = template(['Error while updating field'], code=422)
NO_FILES_FOUND = template(['No files found'], code=422)
INVALID_FILETYPE = template(['Invalid file type found'], code=422)
ITEM_NOT_FOUND = template(['Item not found'], code=404)
ITEM_ALREADY_EXISTS = template(['Item already exists'], code=422)
NOT_ASSOCIATED_WITH_ANY_SCHOOL = template(
    ['Not associated with any school'], code=422)


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
    def theme_already_exists(cls):
        return cls(**THEME_ALREADY_EXISTS)

    @classmethod
    def field_not_found(cls):
        return cls(**FIELD_NOT_FOUND)

    @classmethod
    def space_not_found(cls):
        return cls(**SPACE_NOT_FOUND)

    @classmethod
    def field_error(cls):
        return cls(**FIELD_ERROR)

    @classmethod
    def no_files_found(cls):
        return cls(**NO_FILES_FOUND)

    @classmethod
    def invalid_file_type(cls):
        return cls(**INVALID_FILETYPE)

    @classmethod
    def item_not_found(cls):
        return cls(**ITEM_NOT_FOUND)

    @classmethod
    def item_already_exists(cls):
        return cls(**ITEM_ALREADY_EXISTS)

    @classmethod
    def no_associated_school(cls):
        return cls(**NOT_ASSOCIATED_WITH_ANY_SCHOOL)
