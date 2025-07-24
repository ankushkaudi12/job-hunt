// src/app/validators/password-validators.ts
import { AbstractControl, AsyncValidatorFn, ValidationErrors, ValidatorFn } from "@angular/forms";
import { HttpClient } from "@angular/common/http";
import { environment } from "../environments/environment";
import { map, catchError } from "rxjs/operators";
import { of } from "rxjs";

export class PasswordValidators {

    /**
     * ✅ Async validator to check if password is common using backend
     */
    static commonPasswordValidator(http: HttpClient): AsyncValidatorFn {
        return (control: AbstractControl) => {
            const password = control.value;

            if (!password) {
                return of(null);
            }

            return http.post<{ message: string }>(`${environment.apiUrl}/check-password-strength`, { password })
                .pipe(
                    map(response => {
                        return response.message === "Password is strong. You can continue registration"
                            ? null
                            : { commonPassword: true };
                    }),
                    catchError(() => of(null)) // Fails silently on error
                );
        };
    }

    /**
     * ✅ Synchronous validator to ensure strong password pattern
     */
    static strongPasswordValidator(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            const value = control.value || '';

            const hasUpperCase = /[A-Z]/.test(value);
            const hasLowerCase = /[a-z]/.test(value);
            const hasNumber = /\d/.test(value);
            const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);
            const isValidLength = value.length >= 8;

            const isValid = hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar && isValidLength;

            return isValid ? null : { strongPassword: true };
        };
    }
}
