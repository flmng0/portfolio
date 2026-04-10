import GitHub from '$lib/icons/GitHub.svelte'
import LinkedIn from '$lib/icons/LinkedIn.svelte'
import Mail from '$lib/icons/Mail.svelte'

export const socials = [
	{
		name: 'GitHub',
		href: 'https://github.com/flmng0',
		icon: GitHub,
		variant: 'github'
	},
	{
		name: 'LinkedIn',
		href: 'https://www.linkedin.com/in/timothy-davis-dev',
		icon: LinkedIn,
		variant: 'linkedin'
	},
	{
		name: 'Email to me@timd.dev',
		accessibleName: 'Email',
		href: 'mailto:me@timd.dev',
		icon: Mail,
		variant: 'email'
	}
]

export const site = 'https://timd.dev'
