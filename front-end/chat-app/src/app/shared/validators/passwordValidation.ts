import { AbstractControl } from '@angular/forms'

export class PasswordValidation {
    static MatchPassword(AC: AbstractControl) {
        let password = AC.get('password').value; // to get value in input tag
        let rPassword = AC.get('rPassword').value; // to get value in input tag
        if (rPassword != password) {
            AC.get('rPassword').setErrors({ MatchPassword: true })
        } else {
            return null
        }
    }
}