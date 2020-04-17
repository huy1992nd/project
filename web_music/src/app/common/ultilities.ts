import { ValidatorFn, FormGroup, ValidationErrors } from "@angular/forms";

export function formatString(...args: any[]) {
    let string = args[0];
    args.shift();
    return string.replace(/{(\d+)}/g, (match, i) => {
        return typeof args[i] != 'undefined'
            ? args[i]
            : match
    })
}

export function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}

export const confirmPasswordValidator: ValidatorFn = (form: FormGroup): ValidationErrors | null => {
    let formKey = Object.keys(form.value);
    let confirmKey = formKey.filter(v => v.indexOf('confirm_') != -1)[0];

    const password = form.get(confirmKey.replace('confirm_', ''));
    const confirmPassword = form.get(confirmKey);
    return password.value != confirmPassword.value ? { confirmPassword: true } : null;
}

export const checkDifferentValidator: ValidatorFn = (form: FormGroup): ValidationErrors | null => {
    let f_1 = form.get('left');
    let f_2 = form.get('right');
    let v_1 = f_1.value;
    let v_2 = f_2.value;
    let result = v_1 == v_2 ? { checkDifferent: true } : null;
    return result ;
}

export const randomColor = () => {
    let colorString = '0123456789abcdef';
    let result = '#';
    for (let i = 0; i < 6; i++) {
        result += colorString[Math.floor(Math.random() * colorString.length)];
    }
    return result;
}