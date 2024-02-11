import * as yup from 'yup';

export const schemaSignin = yup
	.object({
		email: yup.string().email().required(),
		password: yup.string().required(),
	})
	.required();

export const schemaSignup = yup
	.object({
		email: yup.string().email().required(),
		username: yup.string().min(4, 'At least 4 characters.').max(12, 'At most 12 characters.').required(),
		password: yup.string().min(6, 'At least 6 characters.').required(),
		confirmPassword: yup
			.string()
			.oneOf([yup.ref('password')], 'Passwords must match')
			.required(),
	})
	.required();
