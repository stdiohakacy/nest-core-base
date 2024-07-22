import { HttpException, HttpStatus } from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { ENUM_REQUEST_STATUS_CODE_ERROR } from 'src/common/request/constants/request.status-code.constant';

export class RequestValidationException extends HttpException {
    constructor(errors: ValidationError[]) {
        super(
            {
                statusCode: ENUM_REQUEST_STATUS_CODE_ERROR.VALIDATION_ERROR,
                message: 'request.validation',
                errors,
            },
            HttpStatus.UNPROCESSABLE_ENTITY
        );
    }
}
